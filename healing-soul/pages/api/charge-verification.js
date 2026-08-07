export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Step 1: Client calls GET to create a SetupIntent
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment system not configured.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {
      const { email, name } = req.query;

      // Create or find customer
      let customer;
      if (email) {
        const existing = await stripe.customers.list({ email, limit: 1 });
        if (existing.data.length > 0) {
          customer = existing.data[0];
        } else {
          customer = await stripe.customers.create({
            email: email,
            name: name || undefined,
          });
        }
      } else {
        customer = await stripe.customers.create({
          name: name || 'Healing Soulutions Patient',
        });
      }

      // Create SetupIntent - this is Stripe's recommended way to save a card.
      // Note: we intentionally do NOT put the patient's name/email in metadata.
      // Stripe's customer object (created above) already holds the email and name
      // natively, so there's no need to duplicate identifying info into metadata.
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        metadata: {
          type: 'card_on_file',
        },
      });

      return res.status(200).json({
        clientSecret: setupIntent.client_secret,
        customerId: customer.id,
      });
    } catch (error) {
      console.error('SetupIntent creation error:', error.message);
      return res.status(500).json({ error: 'Could not initialize payment form.' });
    }
  }

  if (req.method === 'POST') {
    // Step 2: Client confirms card was saved, we place a true authorization
    // HOLD (not a charge). A manual-capture PaymentIntent reserves the funds
    // to validate the card, then we cancel it to release the hold immediately —
    // so nothing is ever actually charged or refunded on the customer's statement.
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Payment system not configured.' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {
      const { setupIntentId, customerId } = req.body;

      // Retrieve the SetupIntent to get the payment method
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Card setup did not complete.' });
      }

      const paymentMethodId = setupIntent.payment_method;

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      // Place a true authorization HOLD to verify the card, then release it.
      // capture_method:'manual' authorizes the amount without capturing (charging) it.
      // Canceling the uncaptured intent releases the hold — no money ever moves.
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 1,
          currency: 'usd',
          customer: customerId,
          payment_method: paymentMethodId,
          payment_method_types: ['card'],
          capture_method: 'manual',
          confirm: true,
          off_session: true,
          description: 'Healing Soulutions - Card verification hold (released)',
        });

        // A successful manual-capture auth lands in 'requires_capture'.
        // We never capture — cancel to release the hold right away.
        if (paymentIntent.status === 'requires_capture') {
          await stripe.paymentIntents.cancel(paymentIntent.id);
        }
      } catch (holdErr) {
        // Hold couldn't be placed, but the card is still saved via the SetupIntent - this is OK.
        console.log('Verification hold skipped:', holdErr.message);
      }

      // Get card details for confirmation
      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

      return res.status(200).json({
        success: true,
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        brand: pm.card ? pm.card.brand : '',
        last4: pm.card ? pm.card.last4 : '',
      });
    } catch (error) {
      console.error('Card verification error:', error.message);
      return res.status(400).json({ error: 'Card verification failed: ' + error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
