import { motion } from "framer-motion";

function PageLoader({
  title = "Loading dashboard",
  subtitle = "Fetching the latest academy data...",
  compact = false,
}) {
  return (
    <div
      className={`flex items-center justify-center px-4 ${
        compact ? "py-6" : "min-h-[60vh] py-10"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`sas-panel sas-glass-edge relative overflow-hidden text-center ${
          compact ? "w-full p-5" : "w-full max-w-sm p-7"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.16),transparent_42%)]" />

        <div className="relative mx-auto grid h-20 w-20 place-items-center">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-cyan-200/20 border-t-cyan-200"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-emerald-200/20 border-b-emerald-200"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.86, 1, 0.86] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] p-2 shadow-[0_18px_46px_rgba(34,211,238,0.16)]"
          >
            <img
              src="/logo-icon.png"
              alt="LEXORA"
              className="h-full w-full rounded-full object-contain"
            />
          </motion.div>
        </div>

        <div className="relative mt-5">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>

        <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-200 via-sky-300 to-emerald-200"
            animate={{ x: ["-110%", "220%"] }}
            transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default PageLoader;
