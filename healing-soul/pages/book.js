import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Seo from '../components/Seo';
import { useRouter } from 'next/router';
import SceneBackground from '../components/SceneBackground';
import { GoldPhoneIcon, GoldEmailIcon, GoldClockIcon, GoldPinIcon } from '../components/icons';
import { serviceCategories, timeSlots, CONSENT_TREATMENT, CONSENT_HIPAA, CONSENT_MEDICAL, CONSENT_FINANCIAL } from '../lib/data';

function BookContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selTime, setSelTime] = useState(null);
  const [form, setForm] = useState({
    fname: '', lname: '', dob: '', email: '', phone: '', phoneCode: '+1',
    address1: '', address2: '', city: '', stateProvince: '', country: 'United States', postalCode: '',
    date: '', services: [], notes: '',
    medicalSurgicalHistory: '', medications: '', allergies: '',
    ivReactions: '', clinicianNotes: '',
  });
  const [consents, setConsents] = useState({ treatment: false, hipaa: false, financial: false, medical: false });
  const [signature, setSignature] = useState('');
  const [sigMode, setSigMode] = useState('type');
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const [stepAnnouncement, setStepAnnouncement] = useState('');
  const stepHeadingRef = useRef(null);
  const [cardBrand, setCardBrand] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [additionalPatients, setAdditionalPatients] = useState([]);
  const [openPickerCat, setOpenPickerCat] = useState(null);
  const [intakeAcknowledged, setIntakeAcknowledged] = useState(false);
  const [intakeSignature, setIntakeSignature] = useState('');
  const [intakeSigMode, setIntakeSigMode] = useState('type');
  const [intakeDrawing, setIntakeDrawing] = useState(false);
  const [intakeDrawPoints, setIntakeDrawPoints] = useState([]);

  // â”€â”€ Stripe State â”€â”€
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const paymentMountRef = useRef(null);
  const stripeMountedRef = useRef(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeFailed, setStripeFailed] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [detectedBrand, setDetectedBrand] = useState('');
  const [setupClientSecret, setSetupClientSecret] = useState('');
  const [setupCustomerId, setSetupCustomerId] = useState('');
  const [fallbackCardNum, setFallbackCardNum] = useState('');
  const [fallbackCardExp, setFallbackCardExp] = useState('');
  const [fallbackCardCvc, setFallbackCardCvc] = useState('');

  // â”€â”€ Stripe publishable key from env â”€â”€
  const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51T0RgN33pC3rM5e8T3LAZUvyEUWa2tFIf1pIbOSIlnKO3HzXhcmlmSh7hH081XPhmNa9R4ImGKowDKagzjfeOYyf00zmP9iREh';

  var cardComplete = stripeFailed
    ? !!cardHolderName.trim()
    : paymentComplete;

  // â”€â”€ Patient helpers â”€â”€
  var emptyPatient = function () { return { id: Date.now(), fname: '', lname: '', dob: '', phone: '', phoneCode: '+1', services: [], address1: '', address2: '', city: '', stateProvince: '', country: 'United States', postalCode: '', medicalSurgicalHistory: '', medications: '', allergies: '', ivReactions: '', clinicianNotes: '' }; };
  var addPatient = function () { setAdditionalPatients(function (prev) { return [...prev, emptyPatient()]; }); };
  var removePatient = function (id) { setAdditionalPatients(function (prev) { return prev.filter(function (p) { return p.id !== id; }); }); };
  var updatePatient = function (id, field, val) { setAdditionalPatients(function (prev) { return prev.map(function (p) { if (p.id === id) { var u = { ...p }; u[field] = val; return u; } return p; }); }); };
  var toggleService = function (currentServices, title) {
    if (currentServices.indexOf(title) >= 0) return currentServices.filter(function (s) { return s !== title; });
    return [].concat(currentServices, [title]);
  };
  var peptideServiceTitles = {};
  serviceCategories.forEach(function (cat) { if (cat.consultOnly) { cat.services.forEach(function (s) { peptideServiceTitles[s.title] = true; }); } });
  var isPeptideService = function (title) { return !!peptideServiceTitles[title]; };
  var formatServiceLabel = function (title) { return isPeptideService(title) ? title + ' (Consultation)' : title; };

  // â”€â”€ Card helpers â”€â”€
  function detectBrand(n) { n = n.replace(/\s/g, ''); if (/^4/.test(n)) return 'visa'; if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'; if (/^3[47]/.test(n)) return 'amex'; if (/^6(?:011|5)/.test(n)) return 'discover'; return ''; }
  function formatNum(val) { var n = val.replace(/\D/g, ''); var b = detectBrand(n); var mx = b === 'amex' ? 15 : 16; n = n.slice(0, mx); if (b === 'amex') return n.replace(/(\d{4})(\d{0,6})(\d{0,5})/, function (m, a, bb, c) { return a + (bb ? ' ' + bb : '') + (c ? ' ' + c : ''); }).trim(); return n.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); }
  function formatExp(val) { var n = val.replace(/\D/g, '').slice(0, 4); if (n.length >= 3) return n.slice(0, 2) + ' / ' + n.slice(2); return n; }
  function luhnCheck(num) { var n = num.replace(/\D/g, ''); if (n.length < 13) return false; var s = 0, a = false; for (var i = n.length - 1; i >= 0; i--) { var d = parseInt(n[i], 10); if (a) { d *= 2; if (d > 9) d -= 9; } s += d; a = !a; } return s % 10 === 0; }
  function handleFallbackNum(val) { var f = formatNum(val); setFallbackCardNum(f); setDetectedBrand(detectBrand(f.replace(/\D/g, ''))); }
  function handleFallbackExp(val) { setFallbackCardExp(formatExp(val)); }
  function handleFallbackCvc(val) { var mx = detectedBrand === 'amex' ? 4 : 3; setFallbackCardCvc(val.replace(/\D/g, '').slice(0, mx)); }

  // â”€â”€ International phone codes â”€â”€
  var phoneCodes = ['+1','+44','+61','+81','+82','+86','+91','+49','+33','+39','+34','+31','+46','+47','+45','+358','+7','+55','+52','+54','+56','+57','+58','+20','+27','+234','+254','+971','+966','+972','+90','+48','+380','+63','+65','+66','+84','+62','+60','+64','+353','+351','+30','+41','+43','+32','+852','+886','+880','+92','+94','+977','+374','+995','+998'];

  // â”€â”€ Step 1 validation â”€â”€
  const [step1Error, setStep1Error] = useState('');
  var requiredFieldsFilled = form.fname.trim() && form.lname.trim() && form.dob && form.phone.trim() && form.email.trim() && form.address1.trim() && form.city.trim() && form.stateProvince.trim() && form.country.trim() && form.postalCode.trim();
  var validateStep1 = function () {
    var missing = [];
    if (!form.fname.trim()) missing.push('First Name');
    if (!form.lname.trim()) missing.push('Last Name');
    if (!form.dob) missing.push('Date of Birth');
    if (!form.phone.trim()) missing.push('Phone');
    if (!form.email.trim()) missing.push('Email');
    if (!form.address1.trim()) missing.push('Address Line 1');
    if (!form.city.trim()) missing.push('City');
    if (!form.stateProvince.trim()) missing.push('State / Province');
    if (!form.country.trim()) missing.push('Country');
    if (!form.postalCode.trim()) missing.push('Postal Code');
    if (missing.length > 0) {
      setStep1Error('Please fill in: ' + missing.join(', '));
      return false;
    }
    if (!intakeAcknowledged || !intakeSignature) {
      setStep1Error('Please complete the intake acknowledgment and signature.');
      return false;
    }
    setStep1Error('');
    return true;
  };
  var handleStep1Continue = function () {
    if (validateStep1()) goToStep(2);
  };

  // â”€â”€ Load Stripe.js â”€â”€
  useEffect(function () {
    if (window.Stripe) { setStripeLoaded(true); return; }
    var s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/';
    s.async = true;
    s.onload = function () { setStripeLoaded(true); };
    s.onerror = function () { setStripeFailed(true); setStripeReady(true); };
    document.head.appendChild(s);
  }, []);

  // â”€â”€ Initialize Stripe â”€â”€
  useEffect(function () {
    if (!stripeLoaded || stripeRef.current) return;
    try {
      stripeRef.current = window.Stripe(STRIPE_PK);
    } catch (e) {
      setStripeError('Payment initialization error: ' + e.message);
    }
  }, [stripeLoaded, STRIPE_PK]);

  // â”€â”€ Fetch SetupIntent and mount Payment Element on step 3 â”€â”€
  useEffect(function () {
    if (step !== 3 || !stripeLoaded || !stripeRef.current || stripeMountedRef.current) return;
    var cancelled = false;

    async function initPayment() {
      try {
        // Get SetupIntent from server
        var setupUrl = '/api/charge-verification?email=' + encodeURIComponent(form.email || '') + '&name=' + encodeURIComponent((form.fname + ' ' + form.lname).trim());
        var setupRes = await fetch(setupUrl);
        if (!setupRes.ok) throw new Error('Could not initialize payment.');
        var setupData = await setupRes.json();
        if (cancelled) return;
        
        setSetupClientSecret(setupData.clientSecret);
        setSetupCustomerId(setupData.customerId);

        // Create Elements with clientSecret
        var appearance = {
          theme: 'night',
          variables: {
            colorPrimary: '#DBAA64',
            colorBackground: 'rgba(255,255,255,0.08)',
            colorText: '#FFFFFF',
            colorDanger: '#FF9B9B',
            fontFamily: "'Varela Round', sans-serif",
            borderRadius: '6px',
          },
          rules: {
            '.Input': {
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.08)',
            },
            '.Input:focus': {
              border: '1px solid rgba(219,170,100,0.5)',
              boxShadow: '0 0 0 1px rgba(219,170,100,0.25)',
            },
            '.Label': {
              color: 'rgba(255,255,255,0.6)',
              fontSize: '12px',
            },
          },
        };

        elementsRef.current = stripeRef.current.elements({
          clientSecret: setupData.clientSecret,
          appearance: appearance,
          fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap' }],
        });

        // Wait for mount point
        var tryMount = function () {
          if (cancelled || !paymentMountRef.current) return;
          var paymentElement = elementsRef.current.create('payment', {
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
          });
          paymentElement.on('change', function (ev) {
            setPaymentComplete(ev.complete);
            if (ev.error) setStripeError(ev.error.message);
            else setStripeError('');
            // Detect brand from card
            if (ev.value && ev.value.type === 'card') {
              setDetectedBrand('card');
            } else if (ev.value && ev.value.type) {
              setDetectedBrand(ev.value.type);
            }
          });
          paymentElement.on('ready', function () { setStripeReady(true); });
          paymentElement.mount(paymentMountRef.current);
          stripeMountedRef.current = true;
        };
        setTimeout(tryMount, 120);
      } catch (e) {
        if (!cancelled) {
          setStripeError(e.message || 'Could not load payment form.');
          setStripeFailed(true);
          setStripeReady(true);
        }
      }
    }

    initPayment();
    return function () { cancelled = true; stripeMountedRef.current = false; if (elementsRef.current) { try { elementsRef.current.getElement('payment').destroy(); } catch (e) {} elementsRef.current = null; } };
  }, [step, stripeLoaded]);

  useEffect(function () { if (step !== 3) { setStripeReady(false); setPaymentComplete(false); stripeMountedRef.current = false; setDetectedBrand(''); setSetupClientSecret(''); } }, [step]);

  // â”€â”€ Submit to IntakeQ (HIPAA-secure) â”€â”€
  var submitToIntakeQ = async function (cardBrandVal, cardLast4Val, pmId) {
    // Capture intake signature image
    var intakeSigImage = null;
    if (intakeSignature) {
      if (intakeSigMode === 'draw') {
        var intakeCanvas = document.querySelector('[data-sig-canvas="intake"]');
        if (intakeCanvas) {
          try { intakeSigImage = { type: 'drawn', image: intakeCanvas.toDataURL('image/png') }; } catch (e) { intakeSigImage = { type: 'drawn', image: null }; }
        }
      } else {
        intakeSigImage = { type: 'typed', text: intakeSignature };
      }
    }
    // Capture consent form (step 2) overall signature image
    var consentFormSigImage = null;
    if (signature) {
      if (sigMode === 'draw' && drawPoints.length > 0) {
        try {
          var tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = 500; tmpCanvas.height = 120;
          var tmpCtx = tmpCanvas.getContext('2d');
          tmpCtx.fillStyle = '#FFFFFF'; tmpCtx.fillRect(0, 0, 500, 120);
          tmpCtx.strokeStyle = '#013C1C'; tmpCtx.lineWidth = 2; tmpCtx.lineCap = 'round'; tmpCtx.lineJoin = 'round';
          if (drawPoints.length > 1) { tmpCtx.beginPath(); tmpCtx.moveTo(drawPoints[0].x * (500 / 300), drawPoints[0].y); for (var dp = 1; dp < drawPoints.length; dp++) { tmpCtx.lineTo(drawPoints[dp].x * (500 / 300), drawPoints[dp].y); } tmpCtx.stroke(); }
          consentFormSigImage = { type: 'drawn', image: tmpCanvas.toDataURL('image/png') };
        } catch (e) { consentFormSigImage = { type: 'drawn', image: null }; }
      } else {
        consentFormSigImage = { type: 'typed', text: signature };
      }
    }
    var fullAddress = [form.address1, form.address2, form.city, form.stateProvince, form.postalCode, form.country].filter(Boolean).join(', ');
    var fullPhone = (form.phoneCode || '+1') + ' ' + form.phone;
    try {
      await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname: form.fname, lname: form.lname, dob: form.dob,
          email: form.email, phone: fullPhone, phoneCode: form.phoneCode,
          address: fullAddress,
          address1: form.address1, address2: form.address2, city: form.city,
          stateProvince: form.stateProvince, country: form.country, postalCode: form.postalCode,
          date: form.date, selTime: selTime,
          services: form.services, notes: form.notes,
          medicalSurgicalHistory: form.medicalSurgicalHistory,
          medications: form.medications, allergies: form.allergies,
          ivReactions: form.ivReactions, clinicianNotes: form.clinicianNotes,
          consents: consents, signature: signature,
          consentFormSignature: consentFormSigImage,
          intakeAcknowledged: intakeAcknowledged, intakeSignature: intakeSignature,
          intakeSignatureImage: intakeSigImage,
          cardHolderName: cardHolderName, cardBrand: cardBrandVal || '',
          cardLast4: cardLast4Val || '', stripePaymentMethodId: pmId || '',
          additionalPatients: additionalPatients.map(function (pt) {
            var ptAddr = [pt.address1, pt.address2, pt.city, pt.stateProvince, pt.postalCode, pt.country].filter(Boolean).join(', ');
            var ptPhone = pt.phone ? ((pt.phoneCode || '+1') + ' ' + pt.phone) : '';
            return {
              fname: pt.fname, lname: pt.lname, dob: pt.dob || '',
              phone: ptPhone, services: pt.services,
              address: ptAddr,
              address1: pt.address1, address2: pt.address2, city: pt.city,
              stateProvince: pt.stateProvince, country: pt.country, postalCode: pt.postalCode,
              medicalSurgicalHistory: pt.medicalSurgicalHistory,
              medications: pt.medications, allergies: pt.allergies,
              ivReactions: pt.ivReactions, clinicianNotes: pt.clinicianNotes,
            };
          }),
        }),
      });
    } catch (e) {
      console.error('IntakeQ submit error:', e);
    }
  };

  // â”€â”€ Stripe payment + card verification â”€â”€
  var handleStripePayment = async function () {
    if (!cardHolderName.trim()) { setStripeError('Please enter the name on card.'); return; }
    if (!cardComplete) { setStripeError('Please complete all payment fields.'); return; }
    setIsValidating(true); setStripeError('');
    if (stripeFailed) {
      // Secure card entry unavailable; record as payment-pending and have staff follow up securely.
      setCardBrand('');
      setCardInfo({ ...cardInfo, number: 'Pending - secure follow-up', name: cardHolderName });
      submitToIntakeQ('', '', 'pending');
      setIsValidating(false); setEmailStatus('sent'); goToStep(4); return;
    }
    if (!stripeRef.current || !elementsRef.current || !setupClientSecret) { setStripeError('Payment system not ready. Please wait or refresh.'); setIsValidating(false); return; }
    try {
      // Confirm the SetupIntent with Payment Element (handles 3D Secure, Apple Pay, Venmo automatically)
      var confirmResult = await stripeRef.current.confirmSetup({
        elements: elementsRef.current,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: cardHolderName.trim(),
              email: form.email || undefined,
              phone: form.phone || undefined,
            },
          },
        },
        redirect: 'if_required',
      });

      if (confirmResult.error) {
        setStripeError(confirmResult.error.message); setIsValidating(false); return;
      }

      // Tell server to verify and get payment method details
      var verifyRes = await fetch('/api/charge-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupIntentId: confirmResult.setupIntent.id,
          customerId: setupCustomerId,
        }),
      });
      if (!verifyRes.ok) {
        var verifyErr; try { verifyErr = await verifyRes.json(); } catch (e) { verifyErr = { error: 'Verification error.' }; }
        setStripeError(verifyErr.error || 'Payment verification failed.'); setIsValidating(false); return;
      }
      var verifyData = await verifyRes.json();

      setCardBrand(verifyData.brand || '');
      setCardInfo({ ...cardInfo, number: verifyData.last4 ? '****' + verifyData.last4 : (verifyData.brand || 'Payment method'), name: cardHolderName });
      submitToIntakeQ(verifyData.brand || '', verifyData.last4 || '', verifyData.paymentMethodId || '');
      setIsValidating(false); setEmailStatus('sent'); goToStep(4);
    } catch (e) {
      setStripeError(e.message === 'Failed to fetch' ? 'Could not reach payment server.' : 'Payment error: ' + (e.message || 'Please try again.'));
      setIsValidating(false);
    }
  };

  // â”€â”€ Step navigation â”€â”€
  var stepTitles = { 1: 'Appointment Information', 2: 'Consent Forms', 3: 'Card on File', 4: 'Confirmation' };
  useEffect(function () { setStepAnnouncement('Step ' + step + ' of 4: ' + stepTitles[step]); if (stepHeadingRef.current) stepHeadingRef.current.focus(); }, [step]);

  var allConsentsChecked = consents.treatment && consents.hipaa && consents.medical && signature.length > 0;
  var cardValid = cardHolderName.trim().length > 0 && cardComplete && consents.financial;

  var TS = { fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '0.3rem' };
  var LS = { color: 'rgba(255,255,255,0.85)', fontFamily: "'Varela Round',sans-serif", fontSize: '0.7rem', fontWeight: 500 };
  var IS = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: '6px', padding: '0.65rem 0.85rem', fontFamily: "'Varela Round',sans-serif", fontSize: '0.78rem', outline: 'none', width: '100%', minWidth: 0, boxSizing: 'border-box' };
  var CS = { background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '1.5rem', overflow: 'hidden', boxSizing: 'border-box', width: '100%' };
  var medIS = { ...IS, resize: 'vertical', minHeight: '60px' };
  var consentForms = [{ key: 'treatment', title: 'Patient Treatment Consent', text: CONSENT_TREATMENT }, { key: 'hipaa', title: 'HIPAA Notice of Privacy Practices', text: CONSENT_HIPAA }, { key: 'medical', title: 'Medical History Consent', text: CONSENT_MEDICAL }];
  var goToStep = function (s) { setStep(s); window.scrollTo(0, 0); };
  var stepItems = [{ num: 1, label: 'Appointment' }, { num: 2, label: 'Consent Forms' }, { num: 3, label: 'Card on File' }, { num: 4, label: 'Confirmation' }];
  var backBtn = { flex: 1, padding: '0.7rem', fontSize: '0.6rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 600, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer' };

  // â”€â”€ Service Picker â”€â”€
  var renderServicePicker = function (selectedServices, onToggle) {
    return (
      <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', overflow: 'hidden' }}>
        {serviceCategories.map(function (cat) {
          var isOpen = openPickerCat === cat.id;
          var selectedInCat = cat.services.filter(function (s) { return selectedServices.indexOf(s.title) >= 0; }).length;
          return (
            <div key={cat.id}>
              <div onClick={function () { setOpenPickerCat(isOpen ? null : cat.id); }} role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenPickerCat(isOpen ? null : cat.id); } }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: isOpen ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--gold-soft)', fontSize: '0.7rem' }}>{cat.icon}</span>{cat.title}
                  {cat.consultOnly && <span style={{ fontSize: '0.52rem', color: '#7FD4A0', background: 'rgba(127,212,160,0.12)', border: '1px solid rgba(127,212,160,0.2)', padding: '0.08rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>BOOK CONSULTATION</span>}
                  {selectedInCat > 0 && <span style={{ background: 'var(--gold-soft)', color: '#013C1C', fontSize: '0.52rem', fontWeight: 700, padding: '0.08rem 0.35rem', borderRadius: '10px' }}>{selectedInCat}</span>}
                </span>
                <span style={{ color: 'var(--gold-soft)', fontSize: '0.52rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>{'\u25BC'}</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0.4rem 0.5rem', background: 'rgba(0,0,0,0.1)' }}>
                  {cat.services.map(function (svc) {
                    var checked = selectedServices.indexOf(svc.title) >= 0;
                    return (
                      <label key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem', cursor: 'pointer', borderRadius: '6px', background: checked ? 'rgba(219,170,100,0.08)' : 'transparent', marginBottom: '0.15rem' }}>
                        <input type="checkbox" checked={checked} onChange={function () { onToggle(svc.title); }} style={{ accentColor: 'var(--gold-soft)', width: '0.75rem', height: '0.75rem', flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', color: checked ? 'var(--gold-soft)' : 'rgba(255,255,255,0.7)', fontWeight: checked ? 500 : 400 }}>{svc.title}</span>
                      </label>
                    );
                  })}
                  {cat.consultOnly && (
                    <div style={{ margin: '0.4rem 0.15rem 0.25rem', padding: '0.65rem', background: 'rgba(255,180,50,0.06)', border: '1px solid rgba(255,180,50,0.12)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#FFB432', fontSize: '0.55rem' }}>{'\u26A0'}</span>
                        <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', fontWeight: 700, color: '#FFB432', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consultation Required</span>
                      </div>
                      <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', marginBottom: '0.35rem' }}>Certain therapies offered through our practice may be prescribed off-label or may not be approved by the U.S. Food and Drug Administration (FDA) for the specific uses described.</p>
                      <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', marginBottom: '0.35rem' }}>Any such medications are sourced from licensed U.S. pharmacies. Their use is based on current clinical research, peer-reviewed literature, and clinical experience.</p>
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.52rem' }}>{'\u2695'}</span>
                          <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Medical Disclaimer</span>
                        </div>
                        <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>The information provided is for educational and informational purposes only and does not constitute medical advice, diagnosis, or treatment.</p>
                        <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.45)' }}>By selecting these services, you acknowledge that a mandatory Nurse Practitioner consultation is required before any treatment begins.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // â”€â”€ Consent renderer â”€â”€
  var renderConsent = function (cf) {
    var paragraphs = cf.text.split('\n\n').filter(function (p) { return p.trim(); });
    return (
      <div key={cf.key} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cf.title}</h3>
        <div style={{ maxHeight: '200px', overflow: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem' }}>
          {paragraphs.map(function (para, i) {
            var headerMatch = para.match(/^([A-Z][A-Z\s&,\/\(\)\-]+:)(.*)/);
            if (headerMatch) return <p key={i} style={{ fontSize: '0.52rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', fontFamily: "'Varela Round',sans-serif", marginBottom: '0.6rem' }}><span style={{ color: 'var(--gold-soft)', fontWeight: 600, fontSize: '0.52rem' }}>{headerMatch[1]}</span>{headerMatch[2]}</p>;
            return <p key={i} style={{ fontSize: '0.52rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', fontFamily: "'Varela Round',sans-serif", marginBottom: '0.6rem' }}>{para}</p>;
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <input type="checkbox" aria-label={`I have read, understand, and agree to the ${cf.title}`} checked={consents[cf.key]} onChange={(e) => setConsents({ ...consents, [cf.key]: e.target.checked })} style={{ marginTop: '0.15rem', accentColor: '#7FD4A0' }} />
          <label style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.8)', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.5 }}>I have read, understand, and agree to the {cf.title}</label>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div aria-live="polite" className="sr-only">{stepAnnouncement}</div>
      <SceneBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ padding: '8rem 3rem 0.25rem', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: 'rgba(8,44,26,0.9)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(219,170,100,0.7)', boxShadow: '0 0 0 1px rgba(219,170,100,0.18), 0 10px 30px rgba(0,0,0,0.28)', borderRadius: '16px', padding: '1.5rem', width: '100%' }}>
            <h1 ref={stepHeadingRef} tabIndex={-1} style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{stepTitles[step]}</h1>
            <div style={{ margin: '0.5rem 0' }}><img src={"/emblem.png"} alt="" aria-hidden="true" style={{ height: '8.57rem', width: 'auto', display: 'inline-block' }} /></div>
            <div style={{ width: 25, height: 0.75, background: 'var(--gold-soft)', margin: '0 auto' }} />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem' }}>
              {stepItems.map((s, i) => {
                const active = step >= s.num, done = step > s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: active ? 'var(--gold-soft)' : 'rgba(255,255,255,0.15)', color: active ? '#013C1C' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.52rem', fontWeight: 700, fontFamily: "'Varela Round',sans-serif" }}>{done ? '\u2713' : s.num}</div>
                      <span style={{ fontSize: '0.52rem', color: active ? 'var(--gold-soft)' : 'rgba(255,255,255,0.35)', fontFamily: "'Varela Round',sans-serif", fontWeight: 500 }}>{s.label}</span>
                    </div>
                    {i < stepItems.length - 1 && <div style={{ width: 20, height: 1, background: active ? 'var(--gold-soft)' : 'rgba(255,255,255,0.15)', marginBottom: '1rem' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: '0.5rem 3rem 3rem', maxWidth: 800, margin: '0 auto' }}>

          {/* â•â•â•â•â•â• STEP 1: Appointment â•â•â•â•â•â• */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Contact info cards */}
              <div style={{ ...CS, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
                {[
                  { icon: 'phone', t: 'Call Us', v: <a href="tel:+15857472215" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>(585) 747-2215</a> },
                  { icon: 'email', t: 'Email Us', v: <a href="mailto:info@healingsoulutions.care" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>info@healingsoulutions.care</a> },
                  { icon: 'clock', t: 'Availability', v: 'Contact us for scheduling' },
                  { icon: 'pin', t: 'Service Area', v: 'New York Metropolitan Area' },
                ].map((c) => (
                  <div key={c.t} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '0.3rem' }}>{c.icon === 'phone' ? <GoldPhoneIcon size={28} /> : c.icon === 'email' ? <GoldEmailIcon size={28} /> : c.icon === 'clock' ? <GoldClockIcon size={28} /> : <GoldPinIcon size={28} />}</div>
                    <h3 style={TS}>{c.t}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem' }}>{c.v}</p>
                  </div>
                ))}
              </div>

              <div style={CS}>
                <h2 style={TS}>Schedule Your Appointment</h2>
                <p style={{ ...LS, textAlign: 'center', marginBottom: '1rem' }}>Select a preferred date and time below.</p>
                <div className="form-row"><div className="form-group"><label style={LS}>Preferred Date</label><input aria-label="Preferred Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={IS} /></div></div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ ...LS, marginBottom: '0.4rem', display: 'block' }}>Services Needed</label>
                  {form.services.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                      {form.services.map((s) => (
                        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(219,170,100,0.12)', border: '1px solid rgba(219,170,100,0.25)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.52rem', color: 'var(--gold-soft)', fontFamily: "'Varela Round',sans-serif", fontWeight: 500 }}>
                          {isPeptideService(s) ? s + ' (Consult)' : s}
                          <span onClick={() => setForm({ ...form, services: form.services.filter((x) => x !== s) })} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem' }}>{'\u00D7'}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  {renderServicePicker(form.services, (title) => setForm({ ...form, services: toggleService(form.services, title) }))}
                </div>
                <div style={{ ...LS, marginBottom: '0.5rem' }}>Preferred Time</div>
                <div className="time-slots">{timeSlots.map((t) => <div key={t} className={'time-slot' + (selTime === t ? ' selected' : '')} role="button" tabIndex={0} aria-pressed={selTime === t} onClick={() => setSelTime(t)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelTime(t); } }}>{t}</div>)}</div>

                {/* Personal info */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h2 style={TS}>Your Information</h2>
                  <p style={{ fontSize: '0.52rem', color: 'rgba(255,180,50,0.6)', fontFamily: "'Varela Round',sans-serif", textAlign: 'center', marginBottom: '0.75rem' }}>Fields marked with * are required</p>
                  <div className="form-row" style={{ marginTop: '0.5rem' }}>
                    <div className="form-group"><label style={LS}>First Name *</label><input aria-label="First Name" type="text" placeholder="First name" value={form.fname} onChange={(e) => setForm({ ...form, fname: e.target.value })} style={IS} required /></div>
                    <div className="form-group"><label style={LS}>Last Name *</label><input aria-label="Last Name" type="text" placeholder="Last name" value={form.lname} onChange={(e) => setForm({ ...form, lname: e.target.value })} style={IS} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label style={LS}>Date of Birth *</label><input aria-label="Date of Birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} style={IS} required /></div>
                    <div className="form-group"><label style={LS}>Email *</label><input aria-label="Email" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={IS} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 auto', width: '100px' }}>
                      <label style={LS}>Code *</label>
                      <select aria-label="Code" value={form.phoneCode} onChange={(e) => setForm({ ...form, phoneCode: e.target.value })} style={{ ...IS, appearance: 'auto', cursor: 'pointer' }}>
                        {phoneCodes.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
                      </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}><label style={LS}>Phone *</label><input aria-label="Phone" type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={IS} required /></div>
                  </div>
                  <div className="form-row"><div className="form-group full"><label style={LS}>Address Line 1 *</label><input aria-label="Address Line 1" type="text" placeholder="Street address" value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} style={IS} required /></div></div>
                  <div className="form-row"><div className="form-group full"><label style={LS}>Address Line 2</label><input aria-label="Address Line 2" type="text" placeholder="Apt, suite, unit, etc. (optional)" value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} style={IS} /></div></div>
                  <div className="form-row">
                    <div className="form-group"><label style={LS}>City *</label><input aria-label="City" type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={IS} required /></div>
                    <div className="form-group"><label style={LS}>State / Province / Region *</label><input aria-label="State / Province / Region" type="text" placeholder="State, province, or region" value={form.stateProvince} onChange={(e) => setForm({ ...form, stateProvince: e.target.value })} style={IS} required /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label style={LS}>Country *</label><input aria-label="Country" type="text" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} style={IS} required /></div>
                    <div className="form-group"><label style={LS}>Postal / Zip Code *</label><input aria-label="Postal / Zip Code" type="text" placeholder="Postal or zip code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} style={IS} required /></div>
                  </div>
                  <div className="form-row"><div className="form-group full"><label style={LS}>Additional Notes</label><textarea aria-label="Additional Notes" placeholder="Any additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...IS, minHeight: '60px', resize: 'vertical' }} /></div></div>

                  {/* Medical info */}
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Medical Information</h3>
                    {[{ id: 'medicalSurgicalHistory', l: 'Medical / Surgical History', p: 'List any medical conditions and past surgeries...' }, { id: 'medications', l: 'Current Medications', p: 'List all current medications...' }, { id: 'allergies', l: 'Allergies', p: 'List any known allergies...' }, { id: 'ivReactions', l: 'Previous IV Therapy Reactions', p: 'List any previous reactions to IV therapy...' }, { id: 'clinicianNotes', l: 'Additional Notes for Clinician', p: 'Any additional information...' }].map((f) => (
                      <div key={f.id} className="form-row"><div className="form-group full"><label style={LS}>{f.l}</label><textarea aria-label="{f.l}" placeholder={f.p} value={form[f.id]} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} style={medIS} /></div></div>
                    ))}
                  </div>
                </div>

                {/* Additional Patients */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Additional Patients</h3>
                    <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Varela Round',sans-serif" }}>{additionalPatients.length} added</span>
                  </div>
                  <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.55)', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.6, marginBottom: '0.75rem' }}>Need to add family members or others to this appointment? Add their information below.</p>
                  {additionalPatients.map((pt, idx) => (
                    <div key={pt.id} style={{ background: 'rgba(0,0,0,0.12)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.58rem', fontWeight: 600 }}>Patient {idx + 2}</span>
                        <button onClick={() => removePatient(pt.id)} style={{ background: 'rgba(255,100,100,0.12)', border: '1px solid rgba(255,100,100,0.3)', color: '#FF9B9B', cursor: 'pointer', fontSize: '0.52rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{'\u2715'} Remove</button>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label style={LS}>First Name</label><input aria-label="First Name" type="text" placeholder="First name" value={pt.fname} onChange={(e) => updatePatient(pt.id, 'fname', e.target.value)} style={IS} /></div>
                        <div className="form-group"><label style={LS}>Last Name</label><input aria-label="Last Name" type="text" placeholder="Last name" value={pt.lname} onChange={(e) => updatePatient(pt.id, 'lname', e.target.value)} style={IS} /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label style={LS}>Date of Birth</label><input aria-label="Date of Birth" type="date" value={pt.dob || ''} onChange={(e) => updatePatient(pt.id, 'dob', e.target.value)} style={IS} /></div>
                        <div className="form-group">
                          <label style={LS}>Phone</label>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <select aria-label="Phone" value={pt.phoneCode || '+1'} onChange={(e) => updatePatient(pt.id, 'phoneCode', e.target.value)} style={{ ...IS, width: '80px', flex: '0 0 80px', appearance: 'auto', cursor: 'pointer' }}>
                              {phoneCodes.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
                            </select>
                            <input type="tel" aria-label="Phone number" placeholder="Phone number" value={pt.phone || ''} onChange={(e) => updatePatient(pt.id, 'phone', e.target.value)} style={{ ...IS, flex: 1 }} />
                          </div>
                        </div>
                      </div>
                      <div className="form-row"><div className="form-group full"><label style={LS}>Address Line 1</label><input aria-label="Address Line 1" type="text" placeholder="Street address" value={pt.address1} onChange={(e) => updatePatient(pt.id, 'address1', e.target.value)} style={IS} /></div></div>
                      <div className="form-row"><div className="form-group full"><label style={LS}>Address Line 2</label><input aria-label="Address Line 2" type="text" placeholder="Apt, suite, unit, etc. (optional)" value={pt.address2} onChange={(e) => updatePatient(pt.id, 'address2', e.target.value)} style={IS} /></div></div>
                      <div className="form-row">
                        <div className="form-group"><label style={LS}>City</label><input aria-label="City" type="text" placeholder="City" value={pt.city} onChange={(e) => updatePatient(pt.id, 'city', e.target.value)} style={IS} /></div>
                        <div className="form-group"><label style={LS}>State / Province / Region</label><input aria-label="State / Province / Region" type="text" placeholder="State, province, or region" value={pt.stateProvince} onChange={(e) => updatePatient(pt.id, 'stateProvince', e.target.value)} style={IS} /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label style={LS}>Country</label><input aria-label="Country" type="text" placeholder="Country" value={pt.country} onChange={(e) => updatePatient(pt.id, 'country', e.target.value)} style={IS} /></div>
                        <div className="form-group"><label style={LS}>Postal / Zip Code</label><input aria-label="Postal / Zip Code" type="text" placeholder="Postal or zip code" value={pt.postalCode} onChange={(e) => updatePatient(pt.id, 'postalCode', e.target.value)} style={IS} /></div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ ...LS, marginBottom: '0.4rem', display: 'block' }}>Services Needed</label>
                        {renderServicePicker(pt.services, (title) => updatePatient(pt.id, 'services', toggleService(pt.services, title)))}
                      </div>
                      {[{ id: 'medicalSurgicalHistory', l: 'Medical / Surgical History', p: 'List any medical conditions and past surgeries...' }, { id: 'medications', l: 'Current Medications', p: 'List all current medications...' }, { id: 'allergies', l: 'Allergies', p: 'List any known allergies...' }, { id: 'ivReactions', l: 'Previous IV Therapy Reactions', p: 'List any previous reactions to IV therapy...' }, { id: 'clinicianNotes', l: 'Notes for Clinician', p: 'Any additional information...' }].map((f) => (
                        <div key={f.id} className="form-row"><div className="form-group full"><label style={LS}>{f.l}</label><textarea aria-label="{f.l}" placeholder={f.p} value={pt[f.id]} onChange={(e) => updatePatient(pt.id, f.id, e.target.value)} style={medIS} /></div></div>
                      ))}
                    </div>
                  ))}
                  <button onClick={addPatient} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.65rem', background: 'rgba(255,255,255,0.06)', border: '1px dashed rgba(219,170,100,0.25)', borderRadius: '8px', color: 'var(--gold-soft)', fontFamily: "'Varela Round',sans-serif", fontSize: '0.6rem', fontWeight: 500, cursor: 'pointer' }}><span style={{ fontSize: '0.85rem', lineHeight: 1 }}>+</span> Add Another Patient</button>
                </div>

                {/* Intake Acknowledgment */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ fontSize: '0.7rem' }}>{'\u270D'}</span> Intake Form Acknowledgment</h3>
                  <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem', maxHeight: '160px', overflow: 'auto' }}>
                    {[
                      ['PATIENT INTAKE ACKNOWLEDGMENT:', ' By checking the box and signing below, I acknowledge and certify the following:'],
                      ['(1)', ' All information provided in this intake form, including but not limited to my personal information, contact details, medical history, surgical history, current medications, allergies, and substance use history, is complete, accurate, and truthful to the best of my knowledge.'],
                      ['(2)', ' I have not intentionally omitted, withheld, or misrepresented any medical information, health conditions, medications, allergies, prior adverse reactions, or other facts that may be relevant to my care and treatment.'],
                      ['(3)', ' I understand that incomplete, inaccurate, or misleading information may result in serious adverse health consequences, including but not limited to dangerous drug interactions, allergic reactions, inappropriate treatment protocols, or other medical complications.'],
                      ['(4)', ' I acknowledge that BT RPN PLLC, Kristina Castro, Nurse Practitioner in Family Health, PLLC, providing services under the licensed name Healing Soulutions, and their respective owners, officers, employees, contractors, agents, and affiliated clinicians shall not be held liable for any adverse outcomes, injuries, complications, or damages arising directly or indirectly from my failure to provide complete and accurate medical information.'],
                      ['(5)', ' I agree to promptly notify the Practice of any changes to my medical history, medications, allergies, or health status prior to receiving any services.'],
                      ['(6)', ' I understand that providing false or misleading medical information may constitute fraud and may result in termination of the patient relationship and/or referral to appropriate authorities.'],
                      ['(7)', ' I certify that I am at least 18 years of age (or the legal guardian of the patient) and have the legal capacity to provide this acknowledgment.'],
                    ].map(([label, text], i) => (
                      <p key={i} style={{ fontFamily: "'Varela Round',sans-serif", fontSize: i === 0 ? '0.5rem' : '0.48rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: '0.4rem', ...(i > 0 ? { paddingLeft: '0.5rem', borderLeft: '2px solid rgba(219,170,100,0.15)' } : {}) }}>
                        <span style={{ color: 'var(--gold-soft)', fontWeight: 600, fontSize: '0.52rem' }}>{label}</span>{text}
                      </p>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input type="checkbox" checked={intakeAcknowledged} onChange={(e) => setIntakeAcknowledged(e.target.checked)} style={{ marginTop: '0.15rem', accentColor: '#7FD4A0', width: '0.85rem', height: '0.85rem', flexShrink: 0 }} />
                    <label style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.85)', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.5 }}>I acknowledge and certify that all information provided in this intake form is complete, accurate, and truthful. I understand and accept the terms outlined above, including the limitations of liability for incomplete or inaccurate information.</label>
                  </div>

                  {/* Intake Signature */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ ...LS, marginBottom: '0.4rem', display: 'block' }}>Signature <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)' }}>(required)</span></label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <button onClick={() => setIntakeSigMode('type')} style={{ padding: '0.35rem 0.75rem', fontSize: '0.52rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 600, background: intakeSigMode === 'type' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.08)', color: intakeSigMode === 'type' ? '#013C1C' : 'rgba(255,255,255,0.6)', border: '1px solid ' + (intakeSigMode === 'type' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.15)'), borderRadius: '6px', cursor: 'pointer' }}>Type</button>
                      <button onClick={() => setIntakeSigMode('draw')} style={{ padding: '0.35rem 0.75rem', fontSize: '0.52rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 600, background: intakeSigMode === 'draw' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.08)', color: intakeSigMode === 'draw' ? '#013C1C' : 'rgba(255,255,255,0.6)', border: '1px solid ' + (intakeSigMode === 'draw' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.15)'), borderRadius: '6px', cursor: 'pointer' }}>Draw</button>
                    </div>
                    {intakeSigMode === 'type' ? (
                      <input aria-label="I acknowledge and certify that all information provided in this intake form is complete, accurate, and truthful. I understand and accept the terms outlined above, including the limitations of liability for incomplete or inaccurate information." type="text" placeholder="Type your full legal name" value={intakeSignature} onChange={(e) => setIntakeSignature(e.target.value)} style={{ ...IS, fontFamily: "'Varela Round',serif", fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 500 }} />
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <canvas data-sig-canvas="intake" width={500} height={120} style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'crosshair' }}
                          onMouseDown={(e) => { setIntakeDrawing(true); var r = e.target.getBoundingClientRect(); setIntakeDrawPoints([{ x: e.clientX - r.left, y: e.clientY - r.top }]); }}
                          onMouseMove={(e) => { if (!intakeDrawing) return; var r = e.target.getBoundingClientRect(); var np = [...intakeDrawPoints, { x: e.clientX - r.left, y: e.clientY - r.top }]; setIntakeDrawPoints(np); var ctx = e.target.getContext('2d'); ctx.strokeStyle = '#DBAA64'; ctx.lineWidth = 2; ctx.lineCap = 'round'; if (np.length >= 2) { ctx.beginPath(); ctx.moveTo(np[np.length - 2].x * (500 / e.target.offsetWidth), np[np.length - 2].y * (120 / e.target.offsetHeight)); ctx.lineTo(np[np.length - 1].x * (500 / e.target.offsetWidth), np[np.length - 1].y * (120 / e.target.offsetHeight)); ctx.stroke(); } }}
                          onMouseUp={() => { setIntakeDrawing(false); if (intakeDrawPoints.length > 2) setIntakeSignature('drawn_intake_sig'); }}
                          onMouseLeave={() => setIntakeDrawing(false)}
                          onTouchStart={(e) => { e.preventDefault(); var t = e.touches[0]; var r = e.target.getBoundingClientRect(); setIntakeDrawing(true); setIntakeDrawPoints([{ x: t.clientX - r.left, y: t.clientY - r.top }]); }}
                          onTouchMove={(e) => { e.preventDefault(); if (!intakeDrawing) return; var t = e.touches[0]; var r = e.target.getBoundingClientRect(); var np = [...intakeDrawPoints, { x: t.clientX - r.left, y: t.clientY - r.top }]; setIntakeDrawPoints(np); var ctx = e.target.getContext('2d'); ctx.strokeStyle = '#DBAA64'; ctx.lineWidth = 2; ctx.lineCap = 'round'; if (np.length >= 2) { ctx.beginPath(); ctx.moveTo(np[np.length - 2].x * (500 / e.target.offsetWidth), np[np.length - 2].y * (120 / e.target.offsetHeight)); ctx.lineTo(np[np.length - 1].x * (500 / e.target.offsetWidth), np[np.length - 1].y * (120 / e.target.offsetHeight)); ctx.stroke(); } }}
                          onTouchEnd={() => { setIntakeDrawing(false); if (intakeDrawPoints.length > 2) setIntakeSignature('drawn_intake_sig'); }}
                        />
                        <button onClick={(e) => { setIntakeDrawPoints([]); setIntakeSignature(''); var c = e.target.closest('div').querySelector('canvas'); if (c) { var ctx = c.getContext('2d'); ctx.clearRect(0, 0, 500, 120); } }} style={{ position: 'absolute', top: '0.35rem', right: '0.35rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: 'rgba(255,255,255,0.5)', fontSize: '0.52rem', padding: '0.2rem 0.4rem', cursor: 'pointer', fontFamily: "'Varela Round',sans-serif" }}>Clear</button>
                      </div>
                    )}
                    {intakeSignature && <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', color: '#7FD4A0', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>{'\u2713'}</span> Signature captured</p>}
                  </div>
                  {(!intakeAcknowledged || !intakeSignature) && <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', color: 'rgba(255,180,50,0.7)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span>{'\u26A0'}</span> Please check the acknowledgment box and provide your signature to continue.</p>}
                  {step1Error && <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', color: '#FF9B9B', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,100,100,0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,100,100,0.2)' }}><span>{'\u26A0'}</span> {step1Error}</p>}
                </div>
                <button className="btn-submit" onClick={handleStep1Continue} style={{ marginTop: '0.5rem', opacity: (!intakeAcknowledged || !intakeSignature || !requiredFieldsFilled) ? 0.4 : 1, cursor: (!intakeAcknowledged || !intakeSignature || !requiredFieldsFilled) ? 'not-allowed' : 'pointer' }}>Continue to Consent Forms</button>
              </div>
            </div>
          )}

          {/* â•â•â•â•â•â• STEP 2: Consent Forms â•â•â•â•â•â• */}
          {step === 2 && (
            <div style={CS}>
              <h2 style={{ ...TS, marginBottom: '0.25rem' }}>Patient Consent Forms</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', textAlign: 'center', marginBottom: '1rem', fontFamily: "'Varela Round',sans-serif" }}>Please review and sign each consent form below.</p>
              {consentForms.map(renderConsent)}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(219,170,100,0.08)', border: '1px solid rgba(219,170,100,0.2)', borderRadius: '8px', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => { var allChecked = consents.treatment && consents.hipaa && consents.medical; var newVal = !allChecked; setConsents({ treatment: newVal, hipaa: newVal, medical: newVal, financial: consents.financial }); }}>
                <input type="checkbox" checked={consents.treatment && consents.hipaa && consents.medical} readOnly style={{ accentColor: '#7FD4A0', width: '1rem', height: '1rem', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.6rem', color: 'var(--gold-soft)', fontWeight: 600 }}>Select All — I have read and agree to all consent forms above</span>
              </div>
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Electronic Signature</h3>
                <p style={{ fontFamily: "'Varela Round',sans-serif", fontSize: '0.52rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', lineHeight: 1.6 }}>One signature below applies to all consent forms checked above.</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button onClick={() => setSigMode('type')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 500, background: sigMode === 'type' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.1)', color: sigMode === 'type' ? '#013C1C' : 'rgba(255,255,255,0.6)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Type Signature</button>
                  <button onClick={() => setSigMode('draw')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.55rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 500, background: sigMode === 'draw' ? 'var(--gold-soft)' : 'rgba(255,255,255,0.1)', color: sigMode === 'draw' ? '#013C1C' : 'rgba(255,255,255,0.6)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Draw Signature</button>
                </div>
                {sigMode === 'type' ? (
                  <div>
                    <input type="text" aria-label="Type your full legal name" placeholder="Type your full legal name" value={signature === 'drawn-signature' ? '' : signature} onChange={(e) => setSignature(e.target.value)} style={{ ...IS, marginBottom: '0.5rem' }} />
                    {signature && signature !== 'drawn-signature' && (<div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}><p style={{ fontSize: '0.52rem', color: '#999', marginBottom: '0.3rem', fontFamily: "'Varela Round',sans-serif" }}>Signature Preview</p><p style={{ fontFamily: 'Georgia,serif', fontSize: '1.2rem', color: '#013C1C', fontStyle: 'italic' }}>{signature}</p></div>)}
                  </div>
                ) : (
                  <div>
                    <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '8px', height: '120px', position: 'relative', cursor: 'crosshair', touchAction: 'none' }}
                      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); setIsDrawing(true); var r = e.currentTarget.getBoundingClientRect(); setDrawPoints([{ x: e.clientX - r.left, y: e.clientY - r.top }]); }}
                      onPointerMove={(e) => { if (!isDrawing) return; e.preventDefault(); var r = e.currentTarget.getBoundingClientRect(); setDrawPoints((p) => [...p, { x: e.clientX - r.left, y: e.clientY - r.top }]); }}
                      onPointerUp={(e) => { setIsDrawing(false); e.currentTarget.releasePointerCapture(e.pointerId); if (drawPoints.length > 3) setSignature('drawn-signature'); }}
                    >
                      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>{drawPoints.length > 1 && <polyline points={drawPoints.map((p) => p.x + ',' + p.y).join(' ')} fill="none" stroke="#013C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}</svg>
                      {drawPoints.length === 0 && <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#999', fontSize: '0.6rem', fontFamily: "'Varela Round',sans-serif" }}>Draw your signature here</p>}
                    </div>
                    <button onClick={() => { setDrawPoints([]); setSignature(''); }} style={{ marginTop: '0.5rem', fontSize: '0.52rem', fontFamily: "'Varela Round',sans-serif", background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', textDecoration: 'underline' }}>Clear signature</button>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                  {consentForms.map((cf) => (<div key={cf.key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ fontSize: '0.55rem', color: consents[cf.key] ? '#7FD4A0' : 'rgba(255,255,255,0.25)' }}>{consents[cf.key] ? '\u2713' : '\u25CB'}</span><span style={{ fontSize: '0.52rem', color: consents[cf.key] ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', fontFamily: "'Varela Round',sans-serif" }}>{cf.title}</span></div>))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ fontSize: '0.55rem', color: signature ? '#7FD4A0' : 'rgba(255,255,255,0.25)' }}>{signature ? '\u2713' : '\u25CB'}</span><span style={{ fontSize: '0.52rem', color: signature ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', fontFamily: "'Varela Round',sans-serif" }}>E-Signature</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => goToStep(1)} style={backBtn}>Back</button>
                <button onClick={() => goToStep(3)} disabled={!allConsentsChecked} style={{ flex: 2, padding: '0.7rem', fontSize: '0.6rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 700, background: allConsentsChecked ? 'var(--gold-soft)' : 'rgba(255,255,255,0.1)', color: allConsentsChecked ? '#013C1C' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', cursor: allConsentsChecked ? 'pointer' : 'not-allowed' }}>Continue to Payment</button>
              </div>
            </div>
          )}

          {/* â•â•â•â•â•â• STEP 3: Payment Method (Stripe Payment Element) â•â•â•â•â•â• */}
          {step === 3 && (
            <div style={CS}>
              <h2 style={{ ...TS, marginBottom: '0.25rem' }}>Payment Method</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', textAlign: 'center', marginBottom: '0.5rem', fontFamily: "'Varela Round',sans-serif" }}>A payment method on file is required to complete your booking.</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.52rem', textAlign: 'center', marginBottom: '1.25rem', fontFamily: "'Varela Round',sans-serif" }}>Pay with card, Apple Pay, Google Pay, or Venmo. A $0.01 verification charge may be applied and refunded.</p>
              {renderConsent({ key: 'financial', title: 'Financial Consent', text: CONSENT_FINANCIAL })}
              <div style={{ background: 'rgba(1,60,28,0.95)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(219,170,100,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem' }}>{'\uD83D\uDD12'}</span>
                  <span style={{ fontSize: '0.52rem', color: 'var(--gold-soft)', fontFamily: "'Varela Round',sans-serif" }}>{stripeFailed ? 'Payment follow-up' : 'Secured by Stripe'}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', color: 'var(--gold-soft)', fontSize: '0.52rem', marginBottom: '0.35rem', fontFamily: "'Varela Round',sans-serif" }}>Name on Account</label><input aria-label="Name on Account" type="text" placeholder="Full name" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} className="cc-field" style={{ ...IS, color: '#DBAA64' }} autoComplete="cc-name" /></div>
                {stripeFailed ? (
                  <div style={{ padding: '0.85rem', background: 'rgba(255,180,50,0.08)', border: '1px solid rgba(255,180,50,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.52rem', color: '#FFB432', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.6, marginBottom: '0.4rem', fontWeight: 600 }}>Secure payment is temporarily unavailable.</p>
                    <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.6 }}>Please refresh to try again, or continue and our team will contact you to collect payment securely. For your protection, we never accept card numbers typed into this form.</p>
                  </div>
                ) : (
                  <div ref={paymentMountRef} style={{ marginBottom: '1rem', minHeight: '120px' }} />
                )}
                {!stripeReady && !stripeError && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}><span style={{ display: 'inline-block', width: '0.55rem', height: '0.55rem', border: '1.5px solid rgba(255,255,255,0.15)', borderTop: '1.5px solid var(--gold-soft)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'Varela Round',sans-serif" }}>Loading payment options...</p></div>}
                {cardComplete && cardHolderName.trim() && !stripeError && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.6rem', background: 'rgba(127,212,160,0.1)', borderRadius: '6px', marginBottom: '0.75rem' }}><span style={{ color: '#7FD4A0', fontSize: '0.52rem' }}>{'\u2713'}</span><p style={{ fontSize: '0.52rem', color: '#7FD4A0', fontFamily: "'Varela Round',sans-serif" }}>Payment details complete</p></div>}
                {stripeError && <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)', borderRadius: '6px', marginBottom: '0.75rem' }}><p style={{ fontSize: '0.52rem', color: '#FF9B9B', fontFamily: "'Varela Round',sans-serif" }}>{stripeError}</p></div>}
                <p style={{ fontSize: '0.52rem', color: 'var(--gold-soft)', fontFamily: "'Varela Round',sans-serif", lineHeight: 1.6, marginTop: '0.5rem', opacity: 0.7 }}>Your payment information is handled directly by Stripe and never touches our servers.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button onClick={() => goToStep(2)} style={backBtn}>Back</button>
                <button onClick={handleStripePayment} disabled={!cardValid || isValidating} style={{ flex: 2, padding: '0.7rem', fontSize: '0.6rem', fontFamily: "'Varela Round',sans-serif", fontWeight: 700, background: cardValid && !isValidating ? 'var(--gold-soft)' : 'rgba(255,255,255,0.1)', color: cardValid && !isValidating ? '#013C1C' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '8px', cursor: cardValid && !isValidating ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {isValidating && <span style={{ display: 'inline-block', width: '0.6rem', height: '0.6rem', border: '2px solid rgba(1,60,28,0.3)', borderTop: '2px solid #013C1C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                  {isValidating ? 'Verifying...' : 'Verify & Complete Booking'}
                </button>
              </div>
            </div>
          )}

          {/* â•â•â•â•â•â• STEP 4: Confirmation â•â•â•â•â•â• */}
          {step === 4 && (
            <div style={CS}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{'\u2705'}</div>
              <h2 style={{ ...TS, fontSize: '0.75rem' }}>Booking Confirmed!</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', lineHeight: 1.7, textAlign: 'center', maxWidth: 400, margin: '0 auto 1.5rem', fontFamily: "'Varela Round',sans-serif" }}>Your appointment has been successfully booked.</p>
              {emailStatus === 'sent' && <div style={{ padding: '0.5rem 1rem', background: 'rgba(127,212,160,0.15)', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}><p style={{ fontSize: '0.52rem', color: '#7FD4A0', fontFamily: "'Varela Round',sans-serif" }}>{'\u2713'} Confirmation emails sent successfully</p></div>}
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
                <h3 style={{ fontFamily: "'Varela Round',sans-serif", color: 'var(--gold-soft)', fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Booking Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {[
                    { l: additionalPatients.length > 0 ? 'Primary Patient' : 'Patient', v: form.fname + ' ' + form.lname },
                    { l: 'Email', v: form.email },
                    { l: 'Phone', v: form.phone },
                    { l: 'Date', v: form.date },
                    { l: 'Time', v: selTime || 'TBD' },
                    { l: 'Services', v: form.services.length > 0 ? form.services.map(formatServiceLabel).join(', ') : 'General Consultation' },
                  ].map((item) => (
                    <div key={item.l}><p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Varela Round',sans-serif" }}>{item.l}</p><p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', fontFamily: "'Varela Round',sans-serif" }}>{item.v || '\u2014'}</p></div>
                  ))}
                </div>
                {form.address1 && <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}><p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Varela Round',sans-serif" }}>Address</p><p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', fontFamily: "'Varela Round',sans-serif" }}>{[form.address1, form.address2].filter(Boolean).join(', ')}</p>{(form.city || form.stateProvince || form.postalCode) && <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'Varela Round',sans-serif" }}>{[form.city, form.stateProvince, form.postalCode].filter(Boolean).join(', ')}</p>}{form.country && <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'Varela Round',sans-serif" }}>{form.country}</p>}</div>}
                {additionalPatients.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Varela Round',sans-serif", marginBottom: '0.4rem' }}>Additional Patients ({additionalPatients.length})</p>
                    {additionalPatients.map((pt, idx) => {
                      const ptName = (pt.fname + ' ' + pt.lname).trim() || 'Patient ' + (idx + 2);
                      const ptService = pt.services && pt.services.length > 0 ? pt.services.map(formatServiceLabel).join(', ') : 'Same as primary';
                      const ptAddr = [pt.address1, pt.address2, pt.city, pt.stateProvince, pt.postalCode, pt.country].filter(Boolean).join(', ');
                      return (
                        <div key={pt.id} style={{ background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                            <p style={{ fontSize: '0.6rem', color: 'var(--gold-soft)', fontFamily: "'Varela Round',sans-serif", fontWeight: 600 }}>{ptName}</p>
                          </div>
                          <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Varela Round',sans-serif" }}>Services: {ptService}</p>
                          {ptAddr && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>Address: {ptAddr}</p>}
                          {pt.medicalSurgicalHistory && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>Medical/Surgical: {pt.medicalSurgicalHistory}</p>}
                          {pt.medications && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>Medications: {pt.medications}</p>}
                          {pt.allergies && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>Allergies: {pt.allergies}</p>}
                          {pt.ivReactions && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>IV Reactions: {pt.ivReactions}</p>}
                          {pt.clinicianNotes && <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Varela Round',sans-serif" }}>Clinician Notes: {pt.clinicianNotes}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                {['All consent forms signed', 'Card verified ($0.01 charge)', 'Confirmation sent to ' + (form.email || 'patient'), 'Data securely stored (HIPAA)'].map((s, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ color: '#7FD4A0', fontSize: '0.55rem', fontWeight: 700 }}>{'\u2713'}</span><span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)', fontFamily: "'Varela Round',sans-serif" }}>{s}</span></div>))}
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(193,163,98,0.1)', borderRadius: '8px', marginTop: '1rem', border: '1px solid rgba(193,163,98,0.15)' }}><p style={{ fontSize: '0.52rem', color: 'var(--gold-soft)', lineHeight: 1.6, fontFamily: "'Varela Round',sans-serif", textAlign: 'center' }}>Our team at <strong>info@healingsoulutions.care</strong> will contact you within 24 hours to confirm your appointment.</p></div>
              <p style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem', textAlign: 'center', fontFamily: "'Varela Round',sans-serif" }}>Your {cardBrand ? cardBrand.charAt(0).toUpperCase() + cardBrand.slice(1) : 'card'} ending in {cardInfo.number.replace(/\D/g, '').slice(-4)} has been securely saved.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   APP
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */


export default function Book() {
  return (
    <>
      <Seo title="Book a Visit — Healing Soulutions Concierge Nursing" description="Schedule a concierge nursing visit with Healing Soulutions. Choose your services, complete secure intake and consent, and book your appointment across the New York metro area." />
      <BookContent />
    </>
  );
}
