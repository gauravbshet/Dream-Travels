"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative only. Pointer tracking never carries information, since touch and
 * keyboard users never drive it — the drift and contour layers stand alone.
 */
export function AtmosphereField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const coarse = window.matchMedia("(pointer: coarse)");
    if (coarse.matches) return;

    // Lerp toward the pointer so the light trails rather than snaps.
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.32;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    function onPointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
    }

    function tick() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      field!.style.setProperty("--mx", `${currentX.toFixed(1)}px`);
      field!.style.setProperty("--my", `${currentY.toFixed(1)}px`);
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={fieldRef} className="aurora-field" />
      <div className="aurora-drift" />
      <ContourField />
    </div>
  );
}

/** Topographic linework — the brand's cartographic signature. */
function ContourField() {
  return (
    <div className="contour-field">
      <svg
        className="contour-drift h-[130%] w-[130%]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          stroke="var(--canopy)"
          strokeOpacity="0.16"
          strokeWidth="1"
          fill="none"
        >
          {CONTOURS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * Concentric ridge lines, offset to read as elevation rather than ripples.
 * Generated once and inlined so the field costs no runtime geometry.
 */
const CONTOURS = [
  "M-60 250 C 140 190, 300 300, 470 262 S 800 150, 980 214 S 1200 300, 1290 258",
  "M-60 300 C 150 236, 306 348, 476 310 S 806 196, 986 262 S 1200 350, 1290 306",
  "M-60 352 C 160 282, 312 396, 482 358 S 812 242, 992 310 S 1200 400, 1290 354",
  "M-60 408 C 170 330, 318 446, 488 408 S 818 290, 998 360 S 1200 452, 1290 404",
  "M-60 470 C 180 382, 324 500, 494 462 S 824 342, 1004 414 S 1200 508, 1290 458",
  "M-60 540 C 190 440, 330 560, 500 522 S 830 400, 1010 474 S 1200 570, 1290 518",
  "M-60 620 C 200 506, 336 628, 506 590 S 836 466, 1016 542 S 1200 640, 1290 586",
  "M-60 712 C 210 582, 342 706, 512 668 S 842 542, 1022 620 S 1200 722, 1290 664",
];
