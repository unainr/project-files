"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const WORD = "TraceLayer";
const DEPTH = 8; // extrusion length in px

// Stepped hard shadows form the solid side of the letters.
// Each step gets slightly stronger, so the edge reads as a shaded wall.
const EXTRUSION = Array.from({ length: DEPTH }, (_, i) => {
  const n = i + 1;
  return `${n}px ${n}px 0 color-mix(in oklab, var(--color-foreground) ${
    7 + n * 1.5
  }%, var(--color-background))`;
}).join(", ");

// Solid face: a faint violet tint over the page background, so nothing shows through.
const FACE =
  "color-mix(in oklab, var(--color-violet-500) 16%, var(--color-background))";

const TEXT =
  "col-start-1 row-start-1 select-none whitespace-nowrap text-center text-[15vw] font-semibold leading-none tracking-tighter lg:text-[11rem]";

const SPOT_MASK =
  "[-webkit-mask-image:radial-gradient(circle_200px_at_var(--mx)_var(--my),black,transparent)] [mask-image:radial-gradient(circle_200px_at_var(--mx)_var(--my),black,transparent)]";

const FADE_MASK =
  "[-webkit-mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)] [mask-image:linear-gradient(to_bottom,black_35%,transparent_95%)]";

/**
 * Decorative 3D wordmark for the footer. It listens on the parent <footer>,
 * because it sits behind the content and never receives the pointer itself.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Read inside the handler, so the effect below never needs to re-run.
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;

  useEffect(() => {
    const el = ref.current;
    const footer = el?.closest("footer");
    if (!el || !footer) return;

    let frame = 0;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - box.left}px`);
        el.style.setProperty("--my", `${e.clientY - box.top}px`);
        el.dataset.spot = "on";

        if (!reduceRef.current) {
          const fb = footer.getBoundingClientRect();
          const nx = (e.clientX - fb.left) / fb.width - 0.5;
          const ny = (e.clientY - fb.top) / fb.height - 0.5;
          el.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-ny * 6).toFixed(2)}deg`);
        }
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(frame);
      el.dataset.spot = "off";
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    footer.addEventListener("pointermove", handleMove);
    footer.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      footer.removeEventListener("pointermove", handleMove);
      footer.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      data-spot="off"
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "group/word absolute inset-x-0 bottom-[-2vw] [--mx:50%] [--my:50%] [--rx:0deg] [--ry:0deg] perspective-[900px] lg:-bottom-6",
        FADE_MASK
      )}
    >
      <div className="grid transition-transform duration-200 ease-out transform-[rotateX(var(--rx))_rotateY(var(--ry))] motion-reduce:transition-none">
        {/* Solid face with the stepped extrusion behind it */}
        <span
          className={TEXT}
          style={{ color: FACE, textShadow: EXTRUSION }}
        >
          {WORD}
        </span>

        {/* Idle shimmer across the face */}
        {!reduce && (
          <motion.span
            className={cn(
              TEXT,
              "bg-linear-to-r from-transparent via-violet-400/40 to-transparent bg-clip-text text-transparent"
            )}
            style={{ backgroundSize: "200% 100%", backgroundRepeat: "no-repeat" }}
            animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
            transition={{
              duration: 7,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            {WORD}
          </motion.span>
        )}

        {/* Cursor spotlight: brighter violet face seen through a soft circle */}
        <span
          className={cn(
            TEXT,
            SPOT_MASK,
            "bg-linear-to-br from-violet-400 to-indigo-500 bg-clip-text text-transparent opacity-0 transition-opacity duration-300 group-data-[spot=on]/word:opacity-100 motion-reduce:transition-none"
          )}
        >
          {WORD}
        </span>
      </div>
    </motion.div>
  );
}