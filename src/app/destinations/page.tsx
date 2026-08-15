// Cached for 5 minutes rather than rendered per request. Catalogue content
// changes rarely, so serving every visitor a fresh Supabase round-trip was
// pure waste. Admin edits appear within 5 minutes.
export const revalidate = 300;

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createPublicSupabaseClient } from "@/lib/supabase.server";

type DestinationRow = {
    id: string;
    slug: string | null;
    name: string;
    description: string | null;
    cover_image: string | null;
    image: string | null;
    price: number | null;
    rating: number | null;
};

async function getDestinations(): Promise<DestinationRow[]> {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
        .from("destinations")
        .select("id,slug,name,description,cover_image,image,price,rating")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    return data ?? [];
}

export default async function DestinationsListPage() {
    const destinations = await getDestinations();

    return (
        <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-12">
            <Container>
                <SectionHeading
                    title="All destinations"
                    description="Every place Dream Travels currently runs curated trips to."
                />

                {destinations.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-ink-muted">
                        No destinations are published yet — check back soon.
                    </p>
                ) : (
                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {destinations.map((destination) => (
                            <Link
                                key={destination.id}
                                href={`/destinations/${destination.slug ?? destination.id}`}
                                className="group overflow-hidden rounded-[16px] border border-border bg-surface transition-shadow hover:shadow-lg"
                            >
                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                    {(destination.image || destination.cover_image) && (
                                        <Image
                                            src={(destination.image || destination.cover_image)!}
                                            alt={destination.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="flex items-center gap-1 font-semibold text-ink">
                                            <MapPin className="h-3.5 w-3.5 text-canopy" /> {destination.name}
                                        </h3>
                                        {destination.rating != null && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-ink">
                                                <Star className="h-3.5 w-3.5 fill-amber text-amber" /> {destination.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                    {destination.description && (
                                        <p className="mt-1.5 line-clamp-2 text-xs text-ink-muted">
                                            {destination.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}
