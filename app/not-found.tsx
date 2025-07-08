import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFFFF] to-[#EBF3FF] dark:from-[#010103] dark:to-[#121B3B]">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-[#0F59BC] dark:text-[#0F35A7]">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-[#0F59BC] to-[#0F35A7] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 