import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="TraceLayer home"
      className="group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Mark: three offset bars, like spans in a trace waterfall */}
      <span
        aria-hidden="true"
        className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-sm shadow-violet-500/30 ring-1 ring-inset ring-white/25 transition-shadow duration-200 group-hover:shadow-md group-hover:shadow-violet-500/40"
      >
        {/* Top-left light */}
        <span className="absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-transparent" />

        <svg viewBox="0 0 24 24" fill="none" className="relative size-5 text-white">
          <rect
            x="3"
            y="5"
            width="10"
            height="3"
            rx="1.5"
            fill="currentColor"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
          <rect
            x="7"
            y="10.5"
            width="13"
            height="3"
            rx="1.5"
            fill="currentColor"
            opacity="0.75"
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
          <rect
            x="5"
            y="16"
            width="8"
            height="3"
            rx="1.5"
            fill="currentColor"
            opacity="0.5"
            className="transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="pr-1 text-base font-semibold leading-none tracking-tight text-foreground">
        Trace
        <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
          Layer
        </span>
      </span>
    </Link>
  );
};

export default Logo;