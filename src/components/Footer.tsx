export default function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px] gap-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-neutral-400">PostFlow AI v2.4</span>
        <span aria-hidden="true">·</span>
        <span>Cloud Queue: Active</span>
        <span aria-hidden="true">·</span>
        <span>Latency: 28ms</span>
      </div>

      {/* Subtle, elegant, low-profile owner credit exactly as requested */}
      <div className="text-[10px] sm:text-[11px] text-neutral-400/90 font-mono tracking-wide text-center">
        App Owner: Sanjib Konwar
      </div>

      <div className="flex items-center gap-3 text-[10px] text-neutral-500">
        <span>Privacy</span>
        <span aria-hidden="true">·</span>
        <span>Terms</span>
        <span aria-hidden="true">·</span>
        <span>Security</span>
      </div>
    </footer>
  );
}
