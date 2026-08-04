import { unsplash, IMG } from "./images";

/**
 * Self-contained cartography. The outline is a simplified real India boundary
 * (136 points), projected once at build time — no map SDK, no API key, no
 * external tile host.
 */

export const MAP_VIEWBOX = { width: 1000, height: 1065 };

// Plate carrée with a standard parallel through the middle of the country, so
// the outline keeps its true proportions instead of stretching east–west.
const MIN_LNG = 68.0;
const MAX_LAT = 35.8;
const PARALLEL_K = 0.93264;
const SCALE = 36.3467;

export function projectPoint(lng: number, lat: number) {
  return {
    x: (lng - MIN_LNG) * PARALLEL_K * SCALE,
    y: (MAX_LAT - lat) * SCALE,
  };
}

export const INDIA_OUTLINE =
  "M333.5 11.1 L369.9 53.7 L366.5 83.4 L380 102 L378.9 120.5 L354.5 115.6 L364 155.7 L397.3 178.7 L444.4 204.1 L422.9 220.6 L409.8 254.6 L442.6 268.4 L474.6 286.2 L518.8 306.6 L565.3 311.3 L584.8 329.8 L611 333.3 L651.8 341.7 L680 341.1 L683.9 326.7 L679.4 303.6 L682 288 L702.7 280.3 L705.6 309 L706.3 316.3 L737.1 330 L758.4 324.4 L787 326.8 L814.7 325.7 L817.1 303.4 L803.3 291.8 L830.6 287.3 L861.5 260.2 L900.5 237.1 L929 246 L953.1 230.7 L969 253.3 L957.6 268.6 L994.1 274 L996.7 287.8 L984.8 294.4 L987.6 316.8 L963.4 310.2 L919.5 335.3 L920.5 356.1 L901.8 386.6 L900.1 404.3 L885 434.3 L858.5 426 L857.2 463.7 L849.5 476 L853.1 491.5 L836.4 500.1 L818.5 442.4 L809.2 442.5 L803.6 465.8 L785 446.9 L795.5 426.3 L810.7 424.2 L826.3 393.4 L806.8 387.2 L775.3 387.7 L743.1 382.7 L740.1 357.5 L723.9 355.7 L697.1 340 L685.1 364.6 L709.5 383.9 L688.4 397.4 L680.8 410.7 L701.7 420.4 L695.9 442.3 L707.7 469.6 L712.9 499.6 L708.1 512.8 L685 512.4 L643.2 519.9 L645.2 547.3 L627.1 568.8 L578.3 593.2 L540.4 636 L514.9 658.9 L481.1 682.7 L481.1 699.4 L464.2 708.4 L433.6 721.4 L417.8 723.3 L407.6 751.1 L414.7 798.3 L416.5 828.5 L402.1 863 L402 924.8 L384.4 926.5 L369 954.2 L379.3 966.2 L348.4 976.5 L337 1001.2 L323.4 1011.7 L291.3 977.8 L275.6 926.9 L262.6 890.2 L250.7 873 L232.7 838.1 L224.3 792.6 L218.4 769.9 L187.6 720 L173.6 649.6 L163.4 603.1 L163.5 559 L157 525 L107.6 546.7 L83.7 542.4 L39.5 498.3 L55.8 485.2 L45.7 470.9 L6 440.1 L28.6 415.8 L103.2 415.9 L96.4 384.7 L77.4 366.3 L73.5 338.3 L51.3 322 L88.7 283.9 L128.1 286.7 L163.5 248.6 L184.8 211.7 L217.7 175.2 L217.2 149.3 L246.1 128.3 L218.7 110.3 L206.9 85.7 L194.9 53.9 L211.5 38.2 L263 47.1 L300.7 41.7 L333.5 11.1 Z";

export type Region =
  | "Himalayas"
  | "Northeast"
  | "West Coast"
  | "Western Ghats"
  | "Islands";

export type MapDestination = {
  id: string;
  name: string;
  state: string;
  region: Region;
  lat: number;
  lng: number;
  fromPrice: number;
  packageCount: number;
  image: string;
  blurb: string;
};

export const mapDestinations: MapDestination[] = [
  {
    id: "srinagar",
    name: "Kashmir",
    state: "Jammu & Kashmir",
    region: "Himalayas",
    lat: 34.08,
    lng: 74.8,
    fromPrice: 24999,
    packageCount: 6,
    image: unsplash(IMG.kashmir, 800),
    blurb: "Shikara mornings on Dal Lake and the Gulmarg meadows.",
  },
  {
    id: "leh",
    name: "Ladakh",
    state: "Ladakh",
    region: "Himalayas",
    lat: 34.16,
    lng: 77.58,
    fromPrice: 32999,
    packageCount: 5,
    image: unsplash(IMG.leh, 800),
    blurb: "High passes, Pangong blue and monastery towns above 3,500m.",
  },
  {
    id: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    region: "Himalayas",
    lat: 32.24,
    lng: 77.19,
    fromPrice: 15999,
    packageCount: 7,
    image: unsplash(IMG.manali, 800),
    blurb: "Deodar forest, the Beas valley and the road to Rohtang.",
  },
  {
    id: "spiti",
    name: "Spiti",
    state: "Himachal Pradesh",
    region: "Himalayas",
    lat: 32.23,
    lng: 78.07,
    fromPrice: 27999,
    packageCount: 4,
    image: unsplash(IMG.spiti, 800),
    blurb: "Cold desert villages, Key Monastery and eight days of sky.",
  },
  {
    id: "kasol",
    name: "Kasol",
    state: "Himachal Pradesh",
    region: "Himalayas",
    lat: 32.01,
    lng: 77.31,
    fromPrice: 10999,
    packageCount: 3,
    image: unsplash(IMG.kasol, 800),
    blurb: "Parvati river camps and the trail up to Kheerganga.",
  },
  {
    id: "sikkim",
    name: "Sikkim",
    state: "Sikkim",
    region: "Northeast",
    lat: 27.33,
    lng: 88.61,
    fromPrice: 19999,
    packageCount: 4,
    image: unsplash(IMG.sikkim, 800),
    blurb: "Kanchenjunga at dawn and the old silk route switchbacks.",
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    state: "Meghalaya",
    region: "Northeast",
    lat: 25.58,
    lng: 91.89,
    fromPrice: 19999,
    packageCount: 5,
    image: unsplash(IMG.meghalaya, 800),
    blurb: "Living root bridges, Cherrapunji rain and Dawki's clear water.",
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    region: "West Coast",
    lat: 15.49,
    lng: 73.83,
    fromPrice: 9999,
    packageCount: 9,
    image: unsplash(IMG.goa, 800),
    blurb: "North-coast beach shacks, Latin quarters and slow sunsets.",
  },
  {
    id: "coorg",
    name: "Coorg",
    state: "Karnataka",
    region: "Western Ghats",
    lat: 12.42,
    lng: 75.74,
    fromPrice: 13999,
    packageCount: 6,
    image: unsplash(IMG.coorg, 800),
    blurb: "Coffee estates in mist and the Kaveri running through them.",
  },
  {
    id: "wayanad",
    name: "Wayanad",
    state: "Kerala",
    region: "Western Ghats",
    lat: 11.69,
    lng: 76.13,
    fromPrice: 11999,
    packageCount: 4,
    image: unsplash(IMG.wayanad, 800),
    blurb: "Edakkal caves, tea slopes and elephant corridors.",
  },
  {
    id: "munnar",
    name: "Munnar",
    state: "Kerala",
    region: "Western Ghats",
    lat: 10.09,
    lng: 77.06,
    fromPrice: 12999,
    packageCount: 7,
    image: unsplash(IMG.munnar, 800),
    blurb: "Tea terraces to the horizon and Anamudi behind them.",
  },
  {
    id: "alleppey",
    name: "Alleppey",
    state: "Kerala",
    region: "West Coast",
    lat: 9.5,
    lng: 76.34,
    fromPrice: 17999,
    packageCount: 5,
    image: unsplash(IMG.kerala, 800),
    blurb: "A houseboat, the backwaters, and nowhere in particular to be.",
  },
  {
    id: "ooty",
    name: "Ooty",
    state: "Tamil Nadu",
    region: "Western Ghats",
    lat: 11.41,
    lng: 76.69,
    fromPrice: 10999,
    packageCount: 5,
    image: unsplash(IMG.ooty, 800),
    blurb: "The Nilgiri toy train and eucalyptus air at 2,200m.",
  },
  {
    id: "kodaikanal",
    name: "Kodaikanal",
    state: "Tamil Nadu",
    region: "Western Ghats",
    lat: 10.24,
    lng: 77.49,
    fromPrice: 9499,
    packageCount: 3,
    image: unsplash(IMG.kodaikanal, 800),
    blurb: "Shola forest, Coaker's Walk and a lake in the clouds.",
  },
  {
    id: "andaman",
    name: "Andaman",
    state: "Andaman & Nicobar",
    region: "Islands",
    lat: 11.62,
    lng: 92.73,
    fromPrice: 28999,
    packageCount: 6,
    image: unsplash(IMG.andaman, 800),
    blurb: "Radhanagar sand, wreck dives and bioluminescent night water.",
  },
  {
    id: "lakshadweep",
    name: "Lakshadweep",
    state: "Lakshadweep",
    region: "Islands",
    lat: 10.57,
    lng: 72.64,
    fromPrice: 34999,
    packageCount: 3,
    image: unsplash(IMG.lakshadweep, 800),
    blurb: "Atoll lagoons, permit-only islands and reef straight off the beach.",
  },
];

export const regionOrder: Region[] = [
  "Himalayas",
  "Northeast",
  "Western Ghats",
  "West Coast",
  "Islands",
];
