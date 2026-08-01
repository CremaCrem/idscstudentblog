import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-medium text-emerald-700 mb-3 tracking-wide uppercase">Legal</p>
        <h1 className="text-4xl font-bold font-display text-zinc-900 tracking-tight">Terms of Use</h1>
        <p className="text-zinc-500 mt-3 text-sm">Last Updated: August 2, 2026 &nbsp;·&nbsp; Version 1.0</p>
      </header>

      <div className="prose prose-zinc max-w-none space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By registering for an account on IDSC Pulse ("the Platform"), you agree to be bound by these Terms of
            Use. If you do not agree to these Terms, please do not register for or use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. What IDSC Pulse Is</h2>
          <p>
            IDSC Pulse is a student-run directory platform for the{' '}
            <strong>Infotech Development Systems College (IDSC)</strong>, operated for currently enrolled BSIT
            students to showcase technical write-ups, capstone research, and software projects.
          </p>
          <p className="mt-3">
            IDSC Pulse <strong>does not host your content</strong>. We store only a link to your externally hosted
            blog or portfolio, along with basic descriptive information (title, thumbnail, tags). Clicking a listing
            on the Platform sends visitors directly to your own external site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. Eligibility</h2>
          <p>
            Access to register an account is restricted to currently enrolled students of IDSC. Registration
            requires submission of your full legal name and IDSC-issued student ID, which will be manually verified
            by an administrator against the official student roster before your account is approved.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Account Registration</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>You must provide accurate and truthful information during registration. Submitting false identity information will result in your registration being rejected.</li>
            <li>You may only register one account per student ID and per email address.</li>
            <li>You are responsible for keeping your login credentials confidential. You are responsible for all activity that occurs under your account.</li>
            <li>Account approval is performed manually by an administrator and may take some time. There is no guaranteed approval timeline.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Your Content and Submissions</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>When you submit a blog post, you are submitting a link to content you have authored or are otherwise permitted to list. You retain full ownership of your content — the Platform only indexes it.</li>
            <li>You are responsible for ensuring that any URL you submit does not violate the rights of others, and does not contain harmful, illegal, or malicious content.</li>
            <li>You must not submit URLs designed to probe, attack, or exploit the Platform's infrastructure or any third-party system. Submissions resolving to private, internal, or restricted network addresses will be automatically rejected.</li>
            <li>You may only submit <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs font-mono">http</code> or <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs font-mono">https</code> URLs.</li>
            <li>Administrators reserve the right to unpublish or remove any submitted post that violates these Terms, contains inappropriate content, or is found to be broken or non-functional after repeated verification attempts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Administrator Actions</h2>
          <p>Administrators of the Platform may, at their discretion:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
            <li>Approve or reject student registrations</li>
            <li>Publish, unpublish, or delete any blog post listing</li>
            <li>Delete user accounts (most commonly to correct erroneous or rejected registrations)</li>
          </ul>
          <p className="mt-3 text-sm">
            Deleting a user account does not automatically delete blog posts previously submitted by that user;
            these may require separate removal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
            <li>Provide false identity information during registration</li>
            <li>Attempt to gain unauthorized access to another user's account or to administrator functions</li>
            <li>Use the Platform to distribute malware, phishing links, or content that violates the law or IDSC's student code of conduct</li>
            <li>Attempt to circumvent, disable, or probe the Platform's security mechanisms</li>
            <li>Use automated tools to scrape, spam, or overload the Platform's services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. No Warranty / Service Availability</h2>
          <p>
            IDSC Pulse is provided on an "as-is" and "as-available" basis, maintained as an academic project. We
            do not guarantee that the Platform will be available at all times, free of errors, or uninterrupted. The
            Platform may occasionally experience downtime, including brief delays when the backend service resumes
            from an idle state.
          </p>
          <p className="mt-3">
            We are not responsible for the availability, accuracy, or content of external websites linked from the
            Platform. Links to student-hosted content do not constitute an endorsement of that content by IDSC or
            the Platform's administrators.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, IDSC Pulse, its administrators, and IDSC shall not be
            liable for any indirect, incidental, or consequential damages arising from your use of the Platform,
            including but not limited to loss of data, loss of access, or issues arising from third-party linked
            content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">10. Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these Terms, provide false registration
            information, or engage in conduct harmful to the Platform or its users. You may request termination of
            your own account at any time by contacting an administrator.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will update the "Last
            Updated" date above. Continued use of the Platform after changes take effect constitutes acceptance of
            the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">12. Governing Law</h2>
          <p>These Terms are governed by the laws of the Republic of the Philippines.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">13. Contact</h2>
          <p>If you have questions about these Terms of Use, please contact:</p>
          <div className="mt-3 bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm space-y-1">
            <p className="font-medium text-zinc-900">Jeremy Jamer</p>
            <p className="text-zinc-600">IDSC Pulse Administrator</p>
            <p>
              <a href="mailto:j3remyz1on@gmail.com" className="text-emerald-700 hover:underline">
                j3remyz1on@gmail.com
              </a>
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};
