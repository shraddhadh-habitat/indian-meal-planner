import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs py-6 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center sm:text-left leading-relaxed">
          © 2026 Bhojan Planner. All rights reserved.{' '}
          <span className="block sm:inline">
            Unauthorized copying or reproduction is prohibited.
          </span>
        </p>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/terms" className="hover:text-white transition-colors underline underline-offset-2">
            Terms of Use
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
          <a href="mailto:shraddhadh@gmail.com" className="hover:text-white transition-colors underline underline-offset-2">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
