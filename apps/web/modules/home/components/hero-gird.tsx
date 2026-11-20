"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GRID =
  "[background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]";

const BASE_MASK =
  "[-webkit-mask-image:radial-gradient(ellipse_80%_75%_at_70%_45%,black,transparent)] [mask-image:radial-gradient(ellipse_80%_75%_at_70%_45%,black,transparent)]";

const SPOT_MASK =
  "[-webkit-mask-image:radial-gradient(circle_170px_at_var(--spot-x)_var(--spot-y),black,transparent)] [mask-image:radial-gradient(circle_170px_at_var(--spot-x)_var(--spot-y),black,transparent)]";

/**
 * A faint grid with a violet copy that shows through a soft circle following the cursor.
 * It listens on its parent section (the grid sits behind the content), and updates CSS
 * variables directly, so moving the mouse never re-renders React.
 */
export function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;

    let frame = 0;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - box.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - box.top}px`);
        el.dataset.spot = "on";
      });
    };

    const handleLeave = () => {
      cancelAnimationFrame(frame);
      el.dataset.spot = "off";
    };

    section.addEventListener("pointermove", handleMove);
    section.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", handleMove);
      section.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-spot="off"
      className="group/grid pointer-events-none absolute inset-0 -z-10 overflow-hidden [--spot-x:50%] [--spot-y:30%]"
    >
      <div
        className={cn(
          "absolute inset-0 text-foreground/[0.07]",
          GRID,
          BASE_MASK
        )}
      />
      <div
        className={cn(
          "absolute inset-0 text-violet-500/60 opacity-0 transition-opacity duration-300 group-data-[spot=on]/grid:opacity-100",
          GRID,
          SPOT_MASK
        )}
      />
    </div>
  );
}