import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase.server";

/**
 * Server-side geocoding via OpenStreetMap's Nominatim, used only by the
 * admin dashboard when saving a destination. Free, no API key, but the
 * public instance requires a proper User-Agent and light usage (max ~1
 * request/second, no bulk/systematic queries).
 *
 * This route previously had no auth check of its own — middleware.ts only
 * guards the /admin *page*, not /api/*, so this endpoint was reachable by
 * anyone, unrate-limited, as an open proxy to Nominatim. That risks the
 * app's own server IP getting throttled/banned under Nominatim's usage
 * policy from unrelated abuse. Since this is genuinely admin-only
 * functionality, it should require the same admin session the dashboard
 * does.
 *
 * https://operations.osmfoundation.org/policies/nominatim/
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "DreamTravelsAdmin/1.0 (internal destination geocoding)";

import { z } from "zod";

const querySchema = z.string().min(1, "Missing query parameter 'q'.");

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q")?.trim();
  
  const parsedQuery = querySchema.safeParse(rawQuery);

  if (!parsedQuery.success) {
    return NextResponse.json({ error: parsedQuery.error.errors[0].message }, { status: 400 });
  }
  
  const query = parsedQuery.data;

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
