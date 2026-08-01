import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-medium text-emerald-700 mb-3 tracking-wide uppercase">Legal</p>
        <h1 className="text-4xl font-bold font-display text-zinc-900 tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 mt-3 text-sm">Last Updated: August 2, 2026 &nbsp;·&nbsp; Version 1.0</p>
      </header>

      <div className="prose prose-zinc max-w-none space-y-10 text-zinc-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">1. Introduction</h2>
          <p>
            IDSC Pulse ("the Platform," "we," "us") is a student blog directory operated by the{' '}
            <strong>Infotech Development Systems College (IDSC)</strong>, located in Ligao City, Albay, Philippines.
            This Privacy Policy explains what information we collect from students who register on the Platform,
            how we use it, and how it is protected.
          </p>
          <p className="mt-3">
            This Policy is intended to align with the general principles of the Philippine{' '}
            <em>Data Privacy Act of 2012</em> (Republic Act No. 10173). The Platform is a small-scale academic tool
            built for currently enrolled IDSC students, with an expected user base of approximately 100 students.
          </p>
          <p className="mt-3">
            By registering for an account, you agree to the collection and use of your information as described in
            this Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">2. Information We Collect</h2>

          <h3 className="text-base font-semibold text-zinc-800 mb-2">2.1 Information You Provide at Registration</h3>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700 w-1/3">Information</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Why We Collect It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ['Full name', 'To verify your identity against the official IDSC student roster'],
                  ['Student ID', 'To verify your identity and prevent duplicate registrations'],
                  ['Username', 'To identify you publicly as the author of your submitted blog posts'],
                  ['Email address', 'To identify your account for login purposes'],
                  ['Password', 'To secure your account (stored only in encrypted/hashed form — we never store or can see your actual password)'],
                ].map(([info, why]) => (
                  <tr key={info}>
                    <td className="px-4 py-3 font-medium text-zinc-800 align-top">{info}</td>
                    <td className="px-4 py-3 text-zinc-600">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-zinc-800 mb-2 mt-6">2.2 Information You Provide When Submitting a Blog Post</h3>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700 w-1/3">Information</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Why We Collect It</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ['External blog/portfolio URL', 'The core content of a directory listing — a link to your own externally hosted work'],
                  ['Title and thumbnail image', 'Displayed on your post\'s card in the public feed'],
                  ['Genre tags', 'To organize and filter posts by topic'],
                ].map(([info, why]) => (
                  <tr key={info}>
                    <td className="px-4 py-3 font-medium text-zinc-800 align-top">{info}</td>
                    <td className="px-4 py-3 text-zinc-600">{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            If you do not provide a title or thumbnail, our system will automatically attempt to retrieve this
            information from your submitted page (via its public Open Graph metadata) so your post displays correctly.
          </p>

          <h3 className="text-base font-semibold text-zinc-800 mb-2 mt-6">2.3 Information We Do Not Collect</h3>
          <p>
            We do not collect or store your IP address, browser/device information, login history, geolocation,
            or any advertising or tracking identifiers. We do not use analytics or advertising cookies of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Your full name and student ID are used solely by an IDSC administrator to confirm you are a currently enrolled student before your account is approved.</li>
            <li>Your username appears publicly on your blog post cards. Your email is not displayed publicly.</li>
            <li>Your password is used only to verify your identity when you log in. It is stored using industry-standard one-way hashing (bcrypt) and is never stored, logged, or transmitted in readable form.</li>
            <li>The URL, title, thumbnail, and tags you submit are used to build your entry in the public directory feed.</li>
            <li>We periodically check that submitted URLs are still active, so that visitors aren't sent to broken links. This check only records whether your link is reachable — it does not access or store the content of your external site beyond the metadata described above.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">4. Where Your Information Is Stored</h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700 w-1/3">Data</th>
                  <th className="px-4 py-3 text-left font-semibold text-zinc-700">Stored With</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {[
                  ['Account and blog post data', 'MongoDB Atlas (cloud database), transmitted over encrypted (TLS) connections'],
                  ['Uploaded thumbnail images', 'Cloudinary (cloud image hosting)'],
                  ['Application code and processing', 'Render (backend hosting)'],
                  ['Website you\'re browsing right now', 'Vercel or Netlify (frontend hosting)'],
                  ['Webfonts used on this site', 'Google Fonts (your browser requests fonts directly from Google)'],
                ].map(([data, stored]) => (
                  <tr key={data}>
                    <td className="px-4 py-3 font-medium text-zinc-800 align-top">{data}</td>
                    <td className="px-4 py-3 text-zinc-600">{stored}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 mt-3">
            We do not sell, rent, or share your personal information with any third party for marketing or advertising
            purposes. The services above are used strictly to operate the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">5. Cookies and Browser Storage</h2>
          <p>
            IDSC Pulse does not use tracking, analytics, or advertising cookies. When you log in, a login token is
            stored in your browser (in local storage) so you remain signed in. This token does not contain your
            password and is only used to confirm you are logged in when you interact with the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">6. Your Choices and Rights</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>You may contact an administrator at any time to request correction of inaccurate information in your account.</li>
            <li>If you wish to have your account removed, contact an administrator. Please note that deleting your account does not automatically delete blog posts you've submitted — you may request their removal separately.</li>
            <li>If your registration is rejected (for example, if your student ID could not be verified), your submitted information may be deleted from our system at the administrator's discretion.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">7. Data Retention</h2>
          <p>
            We retain your account information for as long as your account remains active, and for a reasonable period
            afterward in case it is needed to resolve disputes or administrative issues. Blog post metadata (title,
            URL, tags) is retained as long as the post remains listed in the directory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">8. Security</h2>
          <p>We take reasonable technical measures to protect your information, including:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
            <li>Password hashing (your actual password is never stored)</li>
            <li>Encrypted (TLS) connections between the application and its database</li>
            <li>Access controls that restrict administrative functions to verified administrator accounts only</li>
          </ul>
          <p className="mt-3 text-sm">
            No system can guarantee absolute security. If you believe your account or information has been
            compromised, please contact an administrator immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">9. Children's Privacy</h2>
          <p>
            This Platform is intended for use by currently enrolled college-level students and is not directed at
            children under 18. We do not knowingly collect information from individuals under this age outside the
            intended student user base.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in how the Platform operates.
            If we make material changes, we will update the "Last Updated" date above. Continued use of the Platform
            after changes take effect constitutes acceptance of the revised Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">11. Contact</h2>
          <p>
            If you have questions about this Privacy Policy or how your information is handled, please contact:
          </p>
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
