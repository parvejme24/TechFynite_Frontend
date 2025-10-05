import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#EBF3FF] to-[#E4EEFF] dark:from-[#05070f] dark:via-[#0b1433] dark:to-[#050a1f]">
      {/* animated background orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#9CC2FF] blur-3xl opacity-30 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#0F59BC] blur-3xl opacity-20 animate-[pulse_3s_ease-in-out_infinite]" />

      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0F5BBD 1px, transparent 1px), linear-gradient(to bottom, #0F5BBD 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#BBD8FC]/60 dark:border-[#2a4281] px-4 py-1 text-xs uppercase tracking-wider text-[#0F59BC] dark:text-[#9CC2FF] bg-white/60 dark:bg-white/5 backdrop-blur">
          Oops! Page not found
        </div>

        <h1 className="text-[84px] md:text-[120px] font-extrabold leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#0F59BC] to-[#0F35A7] drop-shadow-sm">
          404
        </h1>
        <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-[#0F1E3A] dark:text-white">
          We couldn’t find that page
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-sm md:text-base text-gray-600 dark:text-gray-300">
          The link may be broken or the page may have been moved. Try going back
          or head to the homepage.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-white bg-gradient-to-r from-[#0F59BC] to-[#0F35A7] shadow-sm hover:opacity-90 transition"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 border-2 border-[#0F5BBD] text-[#0F5BBD] dark:border-[#305aa8] dark:text-[#9CC2FF] hover:bg-[#0F59BC] hover:text-white transition"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
