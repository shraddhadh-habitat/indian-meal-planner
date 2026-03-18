import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use – Bhojan Planner',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-orange-100 text-sm hover:text-white mb-3 inline-block">
            ← Back to Bhojan Planner
          </Link>
          <h1 className="text-2xl font-bold">Terms of Use</h1>
          <p className="text-orange-100 text-sm mt-1">Last updated: January 2026</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-gray-700">

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">1. Ownership and Copyright</h2>
          <p className="leading-relaxed">
            Bhojan Planner — including its name, logo, design, all recipe text, ingredient lists,
            cooking instructions, nutritional data, meal planning logic, and all other written and
            visual content — is the original creative work of its owner (<strong>shraddhadh@gmail.com</strong>)
            and is protected under applicable copyright law.
          </p>
          <p className="leading-relaxed">
            All recipes on this platform have been researched, written, and curated originally.
            The specific expression of each recipe — including the descriptions, ingredient
            quantities, step-by-step methods, nutritional notes, and tags — constitutes
            original authorship and may not be copied, reproduced, or republished without
            explicit written permission.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">2. Permitted Use</h2>
          <p className="leading-relaxed">
            You may use Bhojan Planner for your own personal, non-commercial meal planning.
            You may print or save individual meal plans and recipes for your private household use.
          </p>
          <p className="leading-relaxed">
            You may not:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm leading-relaxed ml-2">
            <li>Copy, reproduce, or republish any recipe text, ingredient list, or cooking instruction on any other website, app, blog, social media account, or publication.</li>
            <li>Scrape, crawl, or systematically extract content from this platform by any automated means.</li>
            <li>Sell, license, or otherwise commercially exploit any content from this platform.</li>
            <li>Claim ownership of, or present as your own, any content originating from this platform.</li>
            <li>Use the content to train machine learning or artificial intelligence models without explicit written permission.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">3. Nutritional Disclaimer</h2>
          <p className="leading-relaxed">
            Protein values and other nutritional estimates provided on this platform are
            approximate figures intended as a practical guide for home meal planning.
            They are not a substitute for professional dietary advice. Actual nutritional
            content varies depending on the specific brands, quantities, and preparation
            methods used. Please consult a registered dietitian for medical dietary needs.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">4. Allergy and Food Safety Disclaimer</h2>
          <p className="leading-relaxed">
            The allergy and avoidance filters on this platform are provided as a convenience
            tool based on keyword matching of listed ingredients. They do not account for
            cross-contamination, shared cooking surfaces, or unlisted trace ingredients.
            Users with severe food allergies or intolerances must independently verify
            every recipe before consumption. Bhojan Planner accepts no liability for
            adverse reactions arising from use of the allergy filter.
          </p>
          <p className="leading-relaxed">
            IBS-friendly mode is based on general high-FODMAP guidelines and is not
            a medical recommendation. Responses to FODMAP foods vary between individuals.
            Always consult a gastroenterologist or dietitian for IBS management.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">5. User Accounts</h2>
          <p className="leading-relaxed">
            Signing in with Google grants Bhojan Planner access to your Google account
            email address and profile information solely for the purpose of identifying
            your account and saving your meal planning preferences. We do not access
            your Google Drive, Gmail, or any other Google services.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">6. Changes to These Terms</h2>
          <p className="leading-relaxed">
            These Terms of Use may be updated from time to time. Continued use of the
            platform after any update constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-orange-100 p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-800">7. Contact</h2>
          <p className="leading-relaxed">
            For permissions, copyright concerns, or any other enquiries:
          </p>
          <p>
            <a href="mailto:shraddhadh@gmail.com" className="text-orange-600 underline hover:text-orange-800">
              shraddhadh@gmail.com
            </a>
          </p>
        </section>

        <div className="text-center text-sm text-gray-400 pt-4">
          <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
          {' · '}
          <Link href="/" className="underline hover:text-gray-600">Back to app</Link>
        </div>

      </main>
    </div>
  );
}
