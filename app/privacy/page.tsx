import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – Bhojan Planner',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-orange-100 text-sm hover:text-white mb-3 inline-block">
            ← Back to Bhojan Planner
          </Link>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-orange-100 text-sm mt-1">Last updated: January 2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-gray-700">

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">1. What We Collect</h2>
          <p className="leading-relaxed">
            When you sign in with Google, we receive and store:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li><strong>Email address</strong> — used to identify your account.</li>
            <li><strong>Display name and profile picture</strong> — shown in the app header.</li>
          </ul>
          <p className="leading-relaxed mt-2">
            When you use the app, we also store:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li><strong>Meal preferences</strong> — your saved weekly meal plan, servings count, diet mode, cuisine filter, allergy avoidances, and IBS mode setting.</li>
            <li><strong>Group membership</strong> — if you create or join a family meal planning group, the group ID and plan are stored.</li>
            <li><strong>Page visit logs</strong> — the pages you visit, along with an anonymised IP address, to help us understand usage patterns. These logs do not contain personally identifiable information beyond your account ID.</li>
          </ul>
          <p className="leading-relaxed mt-2">
            If you use the app without signing in, only your preferences are stored — locally in your browser via <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code>. No data is sent to our servers for anonymous sessions.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li>To save and restore your meal planning preferences across devices.</li>
            <li>To enable the family group sharing feature.</li>
            <li>To send daily meal plan notifications via the optional Telegram bot.</li>
            <li>To understand how the app is used so we can improve it.</li>
          </ul>
          <p className="leading-relaxed">
            We do not use your data for advertising, profiling, or any purpose unrelated to the app.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">3. Data Storage</h2>
          <p className="leading-relaxed">
            Your data is stored on <strong>Supabase</strong>, a secure cloud database platform.
            Data is stored on servers in the region selected by Supabase (typically the EU or US).
            Supabase uses Row Level Security — your data can only be accessed by your own
            authenticated session. We do not have access to your Google account password or
            any other credentials.
          </p>
          <p className="leading-relaxed">
            Meal preferences that have not been synced are stored only in your browser's
            <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> and never leave your device.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">4. Sharing of Data</h2>
          <p className="leading-relaxed">
            We do not sell, rent, or share your personal data with any third party, except:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li><strong>Supabase</strong> — as our database and authentication provider.</li>
            <li><strong>Google</strong> — solely to facilitate sign-in via Google OAuth.</li>
            <li><strong>Telegram</strong> — only if you choose to subscribe to the Telegram bot, your Telegram Chat ID is stored to deliver daily plan messages.</li>
          </ul>
          <p className="leading-relaxed">
            We do not use any analytics services (such as Google Analytics) that would
            share your behaviour data with third parties.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">5. Cookies and Local Storage</h2>
          <p className="leading-relaxed">
            We use a single session cookie set by Supabase to keep you signed in across
            page loads. This is a strictly functional cookie — it is not used for tracking
            or advertising.
          </p>
          <p className="leading-relaxed">
            We use <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> to
            save your preferences (servings, filters, avoidances) locally on your device.
            This data never leaves your browser unless you are signed in, in which case
            it is also synced to your account in Supabase.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">6. Data Retention and Deletion</h2>
          <p className="leading-relaxed">
            Your account and all associated data (preferences, group memberships, visit logs)
            are retained as long as your account is active.
          </p>
          <p className="leading-relaxed">
            To request deletion of your data, email us at{' '}
            <a href="mailto:shraddhadh@gmail.com" className="text-orange-600 underline hover:text-orange-800">
              shraddhadh@gmail.com
            </a>{' '}
            with the subject line <em>"Data Deletion Request"</em>. We will delete your
            account and all associated data within 30 days.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">7. Your Rights</h2>
          <p className="leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li>Know what data we hold about you.</li>
            <li>Request a copy of your data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Withdraw consent by signing out and clearing your browser's local storage.</li>
          </ul>
          <p className="leading-relaxed">
            To exercise any of these rights, contact{' '}
            <a href="mailto:shraddhadh@gmail.com" className="text-orange-600 underline hover:text-orange-800">
              shraddhadh@gmail.com
            </a>.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">8. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be
            reflected on this page with an updated date. Continued use of the app after
            changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">9. Contact</h2>
          <p className="leading-relaxed">
            For any privacy-related questions or requests:
          </p>
          <p>
            <a href="mailto:shraddhadh@gmail.com" className="text-orange-600 underline hover:text-orange-800">
              shraddhadh@gmail.com
            </a>
          </p>
        </section>

        <div className="text-center text-sm text-gray-400 pt-4">
          <Link href="/terms" className="underline hover:text-gray-600">Terms of Use</Link>
          {' · '}
          <Link href="/" className="underline hover:text-gray-600">Back to app</Link>
        </div>

      </main>
    </div>
  );
}
