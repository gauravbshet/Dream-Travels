import { NextResponse } from "next/server";

/**
 * Server-side geocoding via OpenStreetMap's Nominatim, used only by the
 * admin dashboard when saving a destination. Free, no API key, but the
 * public instance requires a proper User-Agent and light usage (max ~1
 * request/second, no bulk/systematic queries) - fine here since this only
 * fires on an admin save, not on public page views.
 *
 * https://operations.osmfoundation.org/policies/nominatim/
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "DreamTravelsAdmin/1.0 (internal destination geocoding)";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'." }, { status: 400 });
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "in");

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nominatim request failed (${response.status}).` },
        { status: 502 }
      );
    }

    const results = (await response.json()) as Array<{
      lat: string;
      lon: string;
      address?: { state?: string };
    }>;

    if (!results.length) {
      return NextResponse.json(
        { error: `Couldn't find a location for "${query}".` },
        { status: 404 }
      );
    }

    const [top] = results;
    return NextResponse.json({
      lat: Number(top.lat),
      lng: Number(top.lon),
      state: top.address?.state ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Geocoding request failed." },
      { status: 500 }
    );
  }
}
