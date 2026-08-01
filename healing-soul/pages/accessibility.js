import LegalLayout, { Sec } from '../components/LegalLayout';

export default function Accessibility() {
  return (
    <LegalLayout title="Accessibility Statement" effective="August 1, 2026"
      description="Healing Soulutions is committed to making its website accessible to everyone, aiming to conform to WCAG 2.1 Level AA.">
      <Sec>Healing Soulutions is committed to ensuring that our website is accessible to people of all abilities, including those who use assistive technologies such as screen readers, screen magnifiers, and keyboard-only navigation. We believe everyone deserves equal access to information about their care.</Sec>
      <Sec heading="Conformance Goal">We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible to people with a wide range of disabilities. Accessibility is an ongoing effort, and we work to improve the site continually.</Sec>
      <Sec heading="Measures We Take">Our website includes: a "skip to main content" link; clear keyboard focus indicators; keyboard-operable navigation and interactive controls; descriptive labels on form fields and controls; text and background color combinations chosen for readability; descriptive text alternatives for meaningful images and decorative images marked to be ignored by assistive technology; and a setting that reduces or stops background motion for visitors who prefer reduced motion in their device settings.</Sec>
      <Sec heading="Emergencies">If you are experiencing a medical emergency, call 911. This website is informational and is not a substitute for emergency care.</Sec>
      <Sec heading="Feedback & Assistance">We welcome your feedback on the accessibility of this website. If you encounter a barrier, need information in an alternative format, or would like assistance completing a booking, please contact us and we will help promptly. Email info@healingsoulutions.care or call (585) 747-2215.</Sec>
      <Sec heading="Ongoing Improvement">Accessibility is never "finished." We periodically review the site, respond to feedback, and make improvements. This statement will be updated as our accessibility efforts continue.</Sec>
    </LegalLayout>
  );
}
