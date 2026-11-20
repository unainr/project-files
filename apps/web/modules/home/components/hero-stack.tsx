"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Bottom to top: data enters at the SDK and ends up as insights.
const STAGES = [
  { title: "SDK", items: ["Install", "Wrap your AI calls"] },
  { title: "Capture", items: ["Input", "Output", "Errors"] },
  { title: "Trace", items: ["Status", "Duration", "Start time"] },
  { title: "Spans", items: ["Model", "Type", "Tokens"] },
  { title: "Insights", items: ["Latency", "Token usage", "Failures"] },
] as const;

const MAIN = 2;

// Geometry, in a 400 x 480 artboard.
const VB_W = 400;
const VB_H = 480;
const CX = 200;
const BASE_CY = 390;
const HW = 110; // half width of a plate
const HH = 63; // half height of a plate
const T = 14; // plate thickness
const REST_STEP = 16;
const OPEN_STEP = 74;

// Layout, in % of the visual's width (desktop).
const SVG_PCT = 56;
const CARD_LEFT = 58;
const TIP = ((CX + HW) / VB_W) * SVG_PCT;

const ORBIT = { cy: 280, rx: 190, ry: 108 };
const ORBIT_PATH = `M${CX + ORBIT.rx} ${ORBIT.cy}A${ORBIT.rx} ${ORBIT.ry} 0 1 1 ${CX - ORBIT.rx} ${ORBIT.cy}A${ORBIT.rx} ${ORBIT.ry} 0 1 1 ${CX + ORBIT.rx} ${ORBIT.cy}Z`;

const cardTop = (i: number) =>
  `${((BASE_CY - i * OPEN_STEP + T / 2) / VB_H) * 100}%`;

type PlateProps = {
  index: number;
  open: boolean;
  lit: boolean;
  reduce: boolean;
  glowId: string;
};

function Plate({ index, open, lit, reduce, glowId }: PlateProps) {
  const main = index === MAIN;
  const cy = BASE_CY;
  const k = 0.55;

  const top = `M${CX - HW} ${cy}L${CX} ${cy - HH}L${CX + HW} ${cy}L${CX} ${cy + HH}Z`;
  const left = `M${CX - HW} ${cy}L${CX} ${cy + HH}L${CX} ${cy + HH + T}L${CX - HW} ${cy + T}Z`;
  const right = `M${CX + HW} ${cy}L${CX} ${cy + HH}L${CX} ${cy + HH + T}L${CX + HW} ${cy + T}Z`;
  const inlay = `M${CX - HW * k} ${cy}L${CX} ${cy - HH * k}L${CX + HW * k} ${cy}L${CX} ${cy + HH * k}Z`;

  return (
    <motion.g
      initial={false}
      animate={{ y: open ? -index * OPEN_STEP : -index * REST_STEP }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 110,
              damping: 22,
              delay: Math.abs(index - MAIN) * 0.04,
            }
      }
    >
      {main && (
        <motion.ellipse
          cx={CX}
          cy={cy + 10}
          rx={190}
          ry={110}
          fill={`url(#${glowId})`}
          initial={false}
          animate={{ opacity: open ? 1 : 0.5 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
        />
      )}
      <path d={left} strokeWidth={1.2} strokeLinejoin="round" className="fill-muted stroke-border" />
      <path d={right} strokeWidth={1.2} strokeLinejoin="round" className="fill-border/60 stroke-border" />
      <path
        d={top}
        strokeWidth={1.2}
        strokeLinejoin="round"
        className={cn(
          "transition-colors duration-200",
          main
            ? "fill-violet-500/10 stroke-violet-500/60"
            : "fill-card stroke-border",
          lit && "stroke-violet-500"
        )}
      />
      <path
        d={inlay}
        fill="none"
        strokeWidth={1}
        className={cn(
          "transition-colors duration-200",
          main || lit ? "stroke-violet-500/50" : "stroke-border"
        )}
      />
      {main && <circle cx={CX} cy={cy} r={5} className="fill-violet-500" />}
    </motion.g>
  );
}

function StageBody({ index }: { index: number }) {
  const stage = STAGES[index];
  const text = stage.items.join(" · ");

  return (
    <>
      <div className="flex items-baseline gap-[0.5em]">
        <span className="font-mono text-[0.75em] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="min-w-0 truncate text-[1.05em] font-medium leading-tight" title={stage.title}>
          {stage.title}
        </p>
        {index === MAIN && (
          <span className="ml-auto shrink-0 text-[0.65em] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Core
          </span>
        )}
      </div>
      <p className="mt-[0.2em] truncate text-[0.85em] text-muted-foreground" title={text}>
        {text}
      </p>
    </>
  );
}

export function HeroStack() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const pointerType = useRef("mouse");
  const reduce = useReducedMotion() ?? false;
  const glowId = useId().replace(/[^\w-]/g, "");

  const fade = { duration: reduce ? 0 : 0.3 };

  return (
    <div className="min-w-0 space-y-4">
      <div
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") {
            setOpen(false);
            setHovered(null);
          }
        }}
        className="@container relative mx-auto aspect-400/480 w-full max-w-xs md:aspect-[100/67.2] md:max-w-160"
      >
        {/* Stack */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-(--svg-w)"
          style={{ "--svg-w": `${SVG_PCT}%` } as React.CSSProperties}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label="Five stacked layers: SDK, Capture, Trace, Spans and Insights"
            className="size-full overflow-visible"
          >
            <defs>
              <radialGradient id={glowId} className="text-violet-500">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Orbit rings and beads, behind the stack */}
            <motion.g
              initial={false}
              animate={{ opacity: open ? 0.25 : 1 }}
              transition={fade}
            >
              <ellipse
                cx={CX}
                cy={ORBIT.cy}
                rx={ORBIT.rx}
                ry={ORBIT.ry}
                fill="none"
                strokeWidth={1}
                strokeDasharray="3 6"
                className="stroke-border"
              />
              {!reduce &&
                [0, -20].map((begin) => (
                  <circle key={begin} r={4} className="fill-violet-500">
                    <animateMotion
                      dur="40s"
                      begin={`${begin}s`}
                      repeatCount="indefinite"
                      path={ORBIT_PATH}
                    />
                  </circle>
                ))}
            </motion.g>

            {STAGES.map((_, i) => (
              <Plate
                key={i}
                index={i}
                open={open}
                lit={hovered === i}
                reduce={reduce}
                glowId={glowId}
              />
            ))}
          </svg>

          {/* Touch and keyboard toggle; a mouse opens it by hovering */}
          <button
            type="button"
            aria-expanded={open}
            aria-label="Show how TraceLayer works"
            onPointerDown={(e) => {
              pointerType.current = e.pointerType;
            }}
            onClick={(e) => {
              if (e.detail === 0 || pointerType.current !== "mouse") {
                setOpen((v) => !v);
              }
            }}
            onBlur={() => setOpen(false)}
            className="absolute inset-x-[8%] bottom-[2%] top-[8%] cursor-default rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Desktop: connectors and cards beside each plate */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          {STAGES.map((_, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={fade}
              style={{
                top: cardTop(i),
                left: `${TIP}%`,
                width: `${CARD_LEFT - TIP}%`,
              }}
              className={cn(
                "absolute h-px transition-colors",
                hovered === i ? "bg-violet-500" : "bg-border"
              )}
            />
          ))}
        </div>

        <ul
          aria-label="How TraceLayer works"
          aria-hidden={!open}
          className="pointer-events-none absolute inset-0 m-0 hidden list-none p-0 text-[clamp(10px,2.3cqw,13px)] md:block"
        >
          {STAGES.map((stage, i) => (
            <li
              key={stage.title}
              style={{
                top: cardTop(i),
                left: `${CARD_LEFT}%`,
                width: `${100 - CARD_LEFT}%`,
              }}
              className="absolute -translate-y-1/2"
            >
              <motion.div
                initial={false}
                animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
                transition={fade}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setHovered(i);
                }}
                onPointerLeave={() => setHovered(null)}
                className={cn(
                  "rounded-[0.9em] border bg-card/80 px-[0.8em] py-[0.55em] shadow-sm backdrop-blur transition-colors",
                  open && "pointer-events-auto",
                  hovered === i && "border-violet-500/50"
                )}
              >
                <StageBody index={i} />
              </motion.div>
            </li>
          ))}
        </ul>
      </div>

      <p
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-opacity duration-300",
          open && "opacity-0"
        )}
      >
        <MousePointer2 className="size-3.5 text-violet-500" />
        <span className="[@media(hover:none)]:hidden">Hover to see how it works</span>
        <span className="hidden [@media(hover:none)]:inline">Tap to see how it works</span>
      </p>

      {/* Mobile: the stages as a list under the stack */}
      <ul
        aria-label="How TraceLayer works"
        className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 text-[13px] sm:grid-cols-2 md:hidden"
      >
        {STAGES.map((stage, i) => (
          <li key={stage.title} className="min-w-0 rounded-xl border bg-card/80 px-3.5 py-2.5">
            <StageBody index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}