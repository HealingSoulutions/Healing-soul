import LegalLayout, { Sec } from '../components/LegalLayout';

// HIPAA Notice of Privacy Practices (45 CFR 164.520). Posted here because the practice
// maintains a website describing its services; a signed acknowledgment of receipt is
// obtained at the first visit.
export default function NoticeOfPrivacyPractices() {
  return (
    <LegalLayout
      title="Notice of Privacy Practices"
      effective="September 23, 2026"
      description="Healing Soulutions HIPAA Notice of Privacy Practices — how your health information may be used and disclosed, and your rights regarding that information."
    >
      <Sec>
        <strong>
          THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS
          TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
        </strong>
      </Sec>
      <Sec heading="Who We Are">
        This notice applies to Healing Soulutions, a trade name used under license by BT RPN PLLC and Kristina Castro,
        Nurse Practitioner in Family Health, PLLC (together, &ldquo;we&rdquo; or &ldquo;the practice&rdquo;), and to the
        licensed nurses and nurse practitioners who provide care on our behalf. We are required by law to maintain the
        privacy of your protected health information (&ldquo;PHI&rdquo;), to give you this notice of our legal duties and
        privacy practices, and to follow the terms of the notice currently in effect.
      </Sec>
      <Sec heading="How We May Use and Disclose Your Health Information">
        <strong>Treatment.</strong> We use your health information to provide, coordinate, and manage your care &mdash;
        for example, sharing your history and results between our nurses and nurse practitioner, or with a laboratory,
        pharmacy, or another provider involved in your care. <strong>Payment.</strong> We use your information to bill
        and collect payment for services, including providing a Good Faith Estimate and processing card payments through
        our payment processor. <strong>Health care operations.</strong> We use your information to run the practice
        &mdash; quality review, training, compliance, and scheduling.
      </Sec>
      <Sec heading="Other Uses and Disclosures Permitted or Required by Law">
        We may use or disclose your information without your authorization when required by law; for public-health
        activities (such as reporting communicable disease to the New York State or New York City Department of
        Health); to report suspected abuse, neglect, or domestic violence; for health-oversight activities such as
        licensing audits; in response to a court order, subpoena, or other lawful process; to law enforcement in limited
        circumstances; to avert a serious threat to health or safety; to a medical examiner or funeral director; for
        workers&rsquo; compensation; and for certain specialized government functions. We may contact you about
        appointment reminders, follow-up care, and services we offer that may be of interest to you.
      </Sec>
      <Sec heading="Uses That Require Your Written Authorization">
        We will not use or disclose your information for marketing purposes, sell your information, or disclose
        psychotherapy notes without your written authorization. Other uses and disclosures not described in this notice
        will be made only with your written authorization, which you may revoke in writing at any time, except to the
        extent we have already acted on it.
      </Sec>
      <Sec heading="Your Rights">
        You have the right to: <strong>inspect and receive a copy</strong> of your health record, including an electronic
        copy, generally within 30 days of a written request (a reasonable, cost-based fee may apply);{' '}
        <strong>request an amendment</strong> of information you believe is incorrect or incomplete;{' '}
        <strong>receive an accounting</strong> of certain disclosures we have made in the prior six years;{' '}
        <strong>request restrictions</strong> on how we use or disclose your information &mdash; we are not required to
        agree, except that we must honor a request not to disclose information to your health plan for a service you have
        paid for in full out of pocket; <strong>request confidential communications</strong> by an alternative means or at
        an alternative location; <strong>receive a paper copy</strong> of this notice on request, even if you agreed to
        receive it electronically; and <strong>be notified</strong> if a breach of your unsecured health information
        occurs.
      </Sec>
      <Sec heading="Our Duties">
        We are required by law to maintain the privacy and security of your PHI, to notify you promptly if a breach may
        have compromised the privacy or security of your information, to follow the duties and privacy practices
        described in this notice, and to give you a copy of it. We reserve the right to change the terms of this notice
        and to make the new terms effective for all information we maintain. The current notice is always available on
        this website and at your visit.
      </Sec>
      <Sec heading="Complaints">
        If you believe your privacy rights have been violated, you may file a complaint with us at the contact below, or
        with the U.S. Department of Health and Human Services, Office for Civil Rights, by mail (200 Independence Avenue
        SW, Washington, DC 20201), by phone (1-800-368-1019), or online at hhs.gov/ocr/privacy/hipaa/complaints. We will
        not retaliate against you for filing a complaint.
      </Sec>
      <Sec heading="Acknowledgment">
        You will be asked to sign an acknowledgment that you received this notice at your first visit. Your care does not
        depend on signing the acknowledgment.
      </Sec>
      <Sec heading="Contact">
        Privacy Officer, Healing Soulutions &mdash; email info@healingsoulutions.care or call (585) 747-2215.
      </Sec>
    </LegalLayout>
  );
}
