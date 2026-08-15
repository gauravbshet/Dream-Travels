"use client";

import dynamic from "next/dynamic";

export const AtmosphereField = dynamic(
  () => import("@/components/ui/AtmosphereField").then((m) => m.AtmosphereField),
  { ssr: false }
);

export const DreamTravelsReelWidget = dynamic(
  () => import("@/components/widgets/DreamTravelsReelWidget").then((m) => m.DreamTravelsReelWidget),
  { ssr: false }
);
