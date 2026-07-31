import LegalLayout, { Sec } from '../components/LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Use" effective="August 1, 2026"
      description="The terms that govern your use of the Healing Soulutions website, including informational-only content, electronic communications, and governing law.">
      <Sec>By accessing or using this website, you agree to these Terms of Use. If you do not agree, please do not use the site. This website is operated for Healing Soulutions, a trade name used under license from BT RPN PLLC and Kristina Castro, Nurse Practitioner in Family Health, PLLC (the "Practice").</Sec>
      <Sec heading="Informational Purpose Only">Content on this website is provided for general informational purposes and does not constitute medical advice, diagnosis, or treatment, and does not create a provider-patient relationship. A provider-patient relationship is formed only through the Practice's intake, consent, and clinical evaluation process. Always seek the advice of a qualified clinician, and call 911 in an emergency.</Sec>
      <Sec heading="Booking, Consent & Payment">Requests to book care are subject to confirmation by the Practice. The specific terms of care, privacy, and payment are governed by the consents and Financial Agreement presented during booking, which control in the event of any conflict with these Terms.</Sec>
      <Sec heading="Electronic Communications & Signatures">By using this site and providing your contact information, you consent to receive electronic communications and to transact and sign electronically, as further described in our consents, consistent with the E-SIGN Act and the New York Electronic Signatures and Records Act.</Sec>
      <Sec heading="Intellectual Property">The Healing Soulutions name, logo, and site content are the property of the Practice or its licensors and may not be used without permission.</Sec>
      <Sec heading="Disclaimers & Limitation of Liability">The website is provided "as is" without warranties of any kind. To the fullest extent permitted by law, the Practice is not liable for damages arising from your use of the website. Nothing in these Terms limits any right that cannot be limited under applicable law.</Sec>
      <Sec heading="Governing Law">These Terms are governed by the laws of the State of New York.</Sec>
      <Sec heading="Changes & Contact">We may revise these Terms; continued use constitutes acceptance. Questions? Email info@healingsoulutions.care.</Sec>
    </LegalLayout>
  );
}
