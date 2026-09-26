import Seo from "../components/Seo";

const EFFECTIVE = "September 23, 2026";
const VERSION = "v1.0";

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions | Healing Soulutions"
        description="Terms of service, financial agreement, eligibility, consent to treatment, and communications consent for Healing Soulutions concierge nursing services."
      />

      <main className="terms">
        <header className="terms-head">
          <p className="eyebrow">Healing Soulutions</p>
          <h1>Terms &amp; Conditions</h1>
          <p className="meta">
            Effective {EFFECTIVE} &nbsp;·&nbsp; Version {VERSION}
          </p>
          <p className="lede">
            These Terms govern your use of this site and any services you book
            with us. Booking an appointment means you have read and accepted
            every section below, including the Financial Agreement and the
            Consent to Treatment. Please read them in full.
          </p>
        </header>

        <div className="toc" role="navigation" aria-label="Sections">
          <ol>
            <li><a href="#parties">1. Who You Are Contracting With</a></li>
            <li><a href="#services">2. Services</a></li>
            <li><a href="#eligibility">3. Eligibility &amp; Medical Screening</a></li>
            <li><a href="#consent">4. Consent to Treatment</a></li>
            <li><a href="#financial">5. Financial Agreement</a></li>
            <li><a href="#cancellation">6. Cancellation, Rescheduling &amp; No-Show</a></li>
            <li><a href="#access">7. Location &amp; Access Requirements</a></li>
            <li><a href="#risk">8. Risks, Outcomes &amp; Assumption of Risk</a></li>
            <li><a href="#emergency">9. Emergencies &amp; Scope of Care</a></li>
            <li><a href="#privacy">10. Privacy &amp; Health Information</a></li>
            <li><a href="#communications">11. Communications Consent</a></li>
            <li><a href="#media">12. Photography &amp; Media</a></li>
            <li><a href="#disclaimer">13. Medical Disclaimer</a></li>
            <li><a href="#site">14. Website Use &amp; Intellectual Property</a></li>
            <li><a href="#liability">15. Limitation of Liability</a></li>
            <li><a href="#law">16. Governing Law &amp; Disputes</a></li>
            <li><a href="#changes">17. Changes to These Terms</a></li>
            <li><a href="#contact">18. Contact</a></li>
          </ol>
        </div>

        <section id="parties">
          <h2>1. Who You Are Contracting With</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Healing Soulutions is the brand under which concierge wellness and
            nursing services are offered. Clinical care is delivered by licensed
            nurses and by the collaborating nurse practitioner practice
            responsible for your evaluation and orders. Administrative,
            scheduling, marketing, and support functions are provided by
            Healing Soulutions LLC.
          </p>
          <p>
            Billing and card processing are handled by the professional entity
            responsible for your care. The name appearing on your card statement
            may therefore differ from &ldquo;Healing Soulutions.&rdquo; The
            specific entity charging your card is disclosed at booking and on
            your receipt.
          </p>
          </div>
        </section>

        <section id="services">
          <h2>2. Services</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            We provide in-home and on-site wellness and nursing services, which
            may include intravenous hydration and nutrient therapy, intramuscular
            injections, blood draws and lab coordination, post-operative and
            recovery nursing support, and related wellness services. Services are
            elective and supportive in nature.
          </p>
          <p>
            Every visit includes an individual evaluation by a clinician. Orders
            are written for you specifically; we do not work from standing orders.
            The service you book is a request, not a guarantee &mdash; the final
            plan is set by the clinician at the visit.
          </p>
          </div>
        </section>

        <section id="eligibility">
          <h2>3. Eligibility &amp; Medical Screening</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Certain services may not be appropriate for you depending on your
            health history &mdash; for example, cardiac, kidney, or liver
            conditions, a history of cancer, pregnancy or breastfeeding,
            allergies, bleeding or clotting disorders, or the medications and
            supplements you take. Your vital signs at the time of the visit are
            also part of the screening.
          </p>
          <p>
            Final eligibility is determined at the visit. A service may be
            adjusted, deferred, or declined, and in that case the cancellation
            and no-show terms in Section 6 do not apply to you.
          </p>
          <p>
            You agree to disclose your health history, current medications and
            supplements, allergies, and recent procedures accurately and
            completely, and to tell us about any change before your visit begins.
          </p>
          <p>
            If you are under 18, a parent or legal guardian must complete the
            booking, be present for the visit, and accept these Terms on your
            behalf.
          </p>
          </div>
        </section>

        <section id="consent">
          <h2>4. Consent to Treatment</h2>
          <div className="box" tabIndex={0} role="region">
          <p>By booking and by accepting these Terms, you consent to the following.</p>
          <ul>
            <li>
              Evaluation, treatment, and nursing care by our clinicians for the
              services you selected, as ordered by the responsible provider.
            </li>
            <li>
              Peripheral intravenous catheter insertion, intramuscular or
              subcutaneous injection, venipuncture for laboratory testing, and
              administration of the fluids, vitamins, minerals, amino acids,
              antioxidants, or medications included in your plan.
            </li>
            <li>
              Vital sign measurement and clinical observation before, during, and
              after your service.
            </li>
            <li>
              Ordering and processing of laboratory specimens through our
              contracted laboratories, and release of your results to you and to
              the ordering provider.
            </li>
            <li>
              Emergency first-aid measures, including administration of emergency
              medication and activation of 911, if a reaction occurs.
            </li>
          </ul>
          <p>
            You confirm that you have had the opportunity to ask questions and
            that they were answered to your satisfaction. You understand that
            outcomes are not guaranteed, that you may decline any part of the
            service, and that you may withdraw your consent at any time before or
            during the visit. Services already rendered before you withdraw
            remain chargeable.
          </p>
          <p>
            Some services require a separate, service-specific written consent
            signed at or before the visit. That consent supplements these Terms
            and controls where the two differ.
          </p>
          </div>
        </section>

        <section id="financial">
          <h2>5. Financial Agreement</h2>
          <div className="box" tabIndex={0} role="region">
          <ul>
            <li>
              A valid credit card is required to reserve and confirm your
              appointment. At booking we process a $0.50 card verification
              charge to confirm the card is valid and to place it on file. The
              price of your service is not charged at booking.
            </li>
            <li>
              Your card is charged after your service is complete, or as
              described in Section 6 for late cancellations and missed
              appointments.
            </li>
            <li>
              You authorize us to keep your card securely on file with our
              payment processor and to charge it for services rendered, agreed
              add-ons, applicable travel or after-hours fees, taxes, and any fee
              owed under Section 6.
            </li>
            <li>
              Prices are quoted before your visit. If the clinician adjusts your
              plan at the visit, the revised price is confirmed with you before
              the service proceeds.
            </li>
            <li>
              All services are private pay. We do not bill insurance, and we are
              not a participating provider with any insurance plan, Medicare, or
              Medicaid. You are responsible for the full amount regardless of any
              reimbursement you may later seek. On request we can provide an
              itemized receipt for your own submission to an insurer, HSA, or
              FSA; we make no representation that any amount will be reimbursed.
            </li>
            <li>
              Declined or disputed charges may result in suspension of service.
              You agree to raise any billing concern with us directly before
              initiating a chargeback.
            </li>
            <li>
              Deposits, packages, and memberships are governed by the terms
              disclosed at purchase. Unless stated otherwise, deposits are
              applied to the service and are non-refundable inside the
              cancellation window.
            </li>
          </ul>
          </div>
        </section>

        <section id="cancellation">
          <h2>6. Cancellation, Rescheduling &amp; No-Show</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Because appointments are reserved one-to-one and supplies are
            prepared for you specifically, the following applies:
          </p>
          <ul>
            <li>
              Cancellations or reschedules made at least 24 hours before your
              appointment are free of charge.
            </li>
            <li>
              Cancellations or reschedules made within 24 hours are charged 50%
              of the scheduled service.
            </li>
            <li>
              A missed appointment, or a visit our clinician cannot begin within
              15 minutes of the scheduled start because you are unavailable or
              access cannot be obtained, is charged in full as a no-show.
            </li>
            <li>
              If we cancel, reschedule, or decline a service for clinical or
              operational reasons, you are not charged.
            </li>
          </ul>
          </div>
        </section>

        <section id="access">
          <h2>7. Location &amp; Access Requirements</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            You agree to provide a safe, clean, private, and well-lit space for
            your visit, with a chair or bed, accessible power, and hand-washing
            access. You agree to secure pets for the duration of the visit and to
            arrange building access, doorman clearance, parking, or elevator use
            in advance.
          </p>
          <p>
            Our clinicians may end or decline a visit if the environment is
            unsafe, if anyone present is abusive or intoxicated, or if care
            cannot be delivered safely. A visit ended for these reasons is
            charged as a no-show under Section 6.
          </p>
          </div>
        </section>

        <section id="risk">
          <h2>8. Risks, Outcomes &amp; Assumption of Risk</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            You understand that every clinical service carries risk. Risks
            associated with intravenous and injection services include, without
            limitation, bruising, pain, swelling, bleeding, infiltration,
            phlebitis, nerve irritation, infection, vein damage, scarring,
            lightheadedness, nausea, headache, changes in blood pressure or heart
            rate, electrolyte or fluid imbalance, allergic reaction, and rarely
            anaphylaxis or other serious reaction.
          </p>
          <p>
            You understand that benefits are individual, that results are not
            guaranteed, that no specific outcome has been promised to you, and
            that you accept these risks voluntarily.
          </p>
          </div>
        </section>

        <section id="emergency">
          <h2>9. Emergencies &amp; Scope of Care</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Our services are not emergency care and do not replace your primary
            care provider, specialist, or urgent or emergency services. If you
            are experiencing a medical emergency, call 911 or go to the nearest
            emergency department. We are not an on-call medical service and do
            not provide continuous monitoring after a visit.
          </p>
          <p>
            You agree to notify your other treating providers of the services you
            receive from us, and we encourage you to maintain a relationship with
            a primary care provider.
          </p>
          </div>
        </section>

        <section id="privacy">
          <h2>10. Privacy &amp; Health Information</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Your health information is handled in accordance with our Privacy
            Policy and applicable law. You consent to the collection, use, and
            disclosure of your information as necessary to provide and coordinate
            your care, to arrange laboratory testing, to process payment, and to
            meet legal and regulatory obligations.
          </p>
          <p>
            You may request a copy of your records or ask questions about how
            your information is used by contacting us.
          </p>
          </div>
        </section>

        <section id="communications">
          <h2>11. Communications Consent</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            You consent to receive service-related communications by phone,
            email, and text message, including scheduling confirmations,
            reminders, clinician arrival updates, intake forms, and receipts.
            These messages are part of your care and are not marketing. Message
            and data rates may apply. Reply STOP to opt out of text messages;
            doing so may affect scheduling reminders.
          </p>
          <p>
            Marketing email is separate and optional. You receive it only if you
            opt in, and you may unsubscribe at any time using the link in any
            message.
          </p>
          <p>
            Email and text are not fully secure. You agree that we may
            communicate with you by these channels, and you may ask us to use
            phone or secure portal instead.
          </p>
          </div>
        </section>

        <section id="media">
          <h2>12. Photography &amp; Media</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            We do not photograph, record, or publish any image of you without a
            separate written media release signed by you. A media release is
            always optional and is never a condition of receiving services. You
            may revoke it at any time going forward.
          </p>
          <p>
            You agree not to photograph or record our clinicians without their
            consent.
          </p>
          </div>
        </section>

        <section id="disclaimer">
          <h2>13. Medical Disclaimer</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Content on this site, in our materials, and on our social channels is
            for general educational purposes only. It is not medical advice,
            diagnosis, or treatment, and it does not create a clinician-patient
            relationship. Statements about wellness services have not been
            evaluated by the U.S. Food and Drug Administration, and our services
            are not intended to diagnose, treat, cure, or prevent any disease.
            Always consult a qualified provider about your individual situation.
          </p>
          </div>
        </section>

        <section id="site">
          <h2>14. Website Use &amp; Intellectual Property</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            The Healing Soulutions name, marks, logo, text, images, and design
            are our property and may not be copied, reproduced, or used without
            written permission. You agree to use this site lawfully, not to
            interfere with its operation, and not to submit false information
            through our forms.
          </p>
          </div>
        </section>

        <section id="liability">
          <h2>15. Limitation of Liability</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            To the fullest extent permitted by law, our total liability arising
            out of or relating to the services is limited to the amount you paid
            for the service giving rise to the claim. We are not liable for
            indirect, incidental, special, consequential, or punitive damages, or
            for loss of income or opportunity.
          </p>
          <p>
            Nothing in these Terms limits any liability that cannot be limited
            under applicable law, including liability for professional negligence
            to the extent New York law prohibits its limitation.
          </p>
          </div>
        </section>

        <section id="law">
          <h2>16. Governing Law &amp; Disputes</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            These Terms are governed by the laws of the State of New York,
            without regard to conflict-of-laws rules. Any dispute is subject to
            the exclusive jurisdiction of the state and federal courts located in
            New York County, New York. If any provision is found unenforceable,
            the remaining provisions stay in effect.
          </p>
          </div>
        </section>

        <section id="changes">
          <h2>17. Changes to These Terms</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            We may update these Terms. The version in effect on the date you book
            is the version that applies to that appointment. The effective date
            and version number appear at the top of this page.
          </p>
          </div>
        </section>

        <section id="contact">
          <h2>18. Contact</h2>
          <div className="box" tabIndex={0} role="region">
          <p>
            Healing Soulutions LLC &mdash; New York, NY
            <br />
            <a href="tel:+15857472215">(585) 747-2215</a>
            <br />
            <a href="mailto:hello@healingsoulutions.care">
              hello@healingsoulutions.care
            </a>
          </p>
          </div>
        </section>

        <p className="foot">
          Last updated {EFFECTIVE}. See also our Privacy Policy.
        </p>
      </main>

      <style jsx>{`
        .terms {
          max-width: 820px;
          margin: 6.5rem auto 4rem;
          padding: 3rem 2.25rem 3.5rem;
          background: #ffffff;
          border: 1px solid #eae9ea;
          border-radius: 16px;
          color: #251f21;
          font-family: "KMR Melange Grotesk", system-ui, -apple-system, sans-serif;
          font-size: 1rem;
          line-height: 1.75;
        }
        .terms-head {
          border-bottom: 1px solid rgba(115, 168, 154, 0.45);
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }
        .eyebrow {
          font-family: "KMR Melange Grotesk", sans-serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 0.7rem;
          color: #73a89a;
          margin: 0 0 0.75rem;
        }
        h1 {
          font-family: "Aime", Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 400;
          color: #251f21;
          margin: 0 0 0.5rem;
          line-height: 1.15;
        }
        .meta {
          font-size: 0.85rem;
          color: #969394;
          margin: 0 0 1.5rem;
        }
        .lede {
          font-size: 1.05rem;
          color: #585254;
          margin: 0;
        }
        .toc {
          background: #f4efec;
          border-left: 3px solid #73a89a;
          padding: 1.25rem 1.5rem 1.25rem 2.5rem;
          margin-bottom: 3rem;
          border-radius: 2px;
        }
        .toc ol {
          margin: 0;
          padding: 0 0 0 0.5rem;
          list-style: none;
          columns: 2;
          column-gap: 2rem;
        }
        .toc li {
          font-size: 0.9rem;
          break-inside: avoid;
          margin-bottom: 0.35rem;
        }
        .toc a {
          color: #251f21;
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        .toc a:hover {
          border-bottom-color: #73a89a;
        }
        .box {
          max-height: 200px;
          overflow-y: auto;
          padding: 1rem 1.25rem 0.25rem;
          border: 1px solid rgba(37, 31, 33, 0.14);
          border-left: 3px solid #73a89a;
          border-radius: 2px;
          background: #fbfaf9;
          font-size: 0.94rem;
        }
        .box:focus-visible {
          outline: 2px solid #73a89a;
          outline-offset: 2px;
        }
        .box::-webkit-scrollbar {
          width: 6px;
        }
        .box::-webkit-scrollbar-thumb {
          background: rgba(37, 31, 33, 0.2);
          border-radius: 3px;
        }
        .hint {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4f7f73;
          margin: 0.4rem 0 0;
        }
        section {
          margin-bottom: 1.75rem;
          scroll-margin-top: 6rem;
        }
        h2 {
          font-family: "Aime", Georgia, serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #251f21;
          margin: 0 0 0.75rem;
          line-height: 1.3;
        }
        p {
          margin: 0 0 1rem;
        }
        ul {
          margin: 0 0 1rem;
          padding-left: 1.25rem;
        }
        li {
          margin-bottom: 0.6rem;
        }
        a {
          color: #4f7f73;
        }
        .foot {
          margin-top: 3.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(115, 168, 154, 0.45);
          font-size: 0.85rem;
          color: #969394;
        }
        @media (max-width: 640px) {
          .toc ol {
            columns: 1;
          }
          .terms {
            margin: 5.5rem 0.75rem 3rem;
            padding: 2rem 1.1rem 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
