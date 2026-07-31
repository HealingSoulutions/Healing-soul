import LegalLayout, { Sec } from '../components/LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" effective="August 1, 2026"
      description="How Healing Soulutions collects, uses, and protects information submitted through this website, and how it relates to our HIPAA Notice of Privacy Practices.">
      <Sec>This Privacy Policy explains how Healing Soulutions (a trade name used under license from BT RPN PLLC and Kristina Castro, Nurse Practitioner in Family Health, PLLC) collects, uses, and safeguards information submitted through this website. Protected Health Information you share as a patient is separately governed by our HIPAA Notice of Privacy Practices, provided during booking.</Sec>
      <Sec heading="Information We Collect">We collect information you provide through our forms — such as your name, contact details, address, appointment preferences, and the intake and health information you enter to request care. Payment card details are collected and processed by our third-party payment processor and are not stored on our own servers. We may also collect limited technical data (such as device and usage information) automatically through standard web technologies.</Sec>
      <Sec heading="How We Use Information">We use your information to schedule and provide care, communicate with you about appointments and billing, comply with legal obligations, and improve our services. We do not sell your personal information.</Sec>
      <Sec heading="Service Providers">We share information only as needed with vendors that help us operate — for example, our payment processor (Stripe) and our practice/intake systems — under agreements requiring them to protect your information, and as required by law.</Sec>
      <Sec heading="Data Security">We maintain reasonable administrative, technical, and physical safeguards designed to protect personal information, consistent with the New York SHIELD Act (General Business Law §899-bb) and, for health information, HIPAA. No method of transmission or storage is completely secure, and standard email and text messages are not fully secure methods of communication.</Sec>
      <Sec heading="Your Choices & Rights">You may request access to, correction of, or deletion of personal information, and may opt out of non-essential communications, subject to legal and recordkeeping requirements. Health-record rights are addressed in our HIPAA Notice of Privacy Practices.</Sec>
      <Sec heading="Changes">We may update this policy from time to time; the effective date above reflects the latest revision.</Sec>
      <Sec heading="Contact">Questions about privacy? Email info@healingsoulutions.care or call (585) 747-2215.</Sec>
    </LegalLayout>
  );
}
