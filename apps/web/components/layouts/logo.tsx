import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="TraceLayer home"
      className="group flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Mark: three offset bars, like spans in a trace waterfall */}
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-sm ring-1 ring-inset ring-white/20 transition-[filter] duration-200 group-hover:brightness-110"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-5 text-white">
          <rect x="3" y="5" width="10" height="3" rx="1.5" fill="currentColor" />
          <rect
            x="7"
            y="10.5"
            width="13"
            height="3"
            rx="1.5"
            fill="currentColor"
            opacity="0.75"
          />
          <rect
            x="5"
            y="16"
            width="8"
            height="3"
            rx="1.5"
            fill="currentColor"
            opacity="0.5"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="pr-1 text-[15px] font-semibold leading-none tracking-tight text-foreground">
        Trace<span className="text-muted-foreground">Layer</span>
      </span>
    </Link>
  );
};

export default Logo;