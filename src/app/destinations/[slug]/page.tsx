// Cached for 5 minutes rather than rendered per request. Catalogue content
// changes rarely, so serving every visitor a fresh Supabase round-trip was
// pure waste. Admin edits appear within 5 minutes.
export const revalidate = 300;

import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { createPublicSupabaseClient } from "@/lib/supabase.server";
import { MapPin, Package as PackageIcon, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary";

// Prerender every destination that exists at build time. Destinations added
// later still work — `dynamicParams` defaults to true, so an unknown slug is
// rendered on first request and cached from then on.
export async function generateStaticParams() {
    try {
        const supabase = createPublicSupabaseClient();
        const { data } = await supabase.from("destinations").select("slug");
        // Cast needed: the Supabase client has no generated Database type, so
        // TypeScript infers query results as `never` instead of the real row
        // shape. See supabase_schema.md — generating types would remove this.
        return ((data ?? []) as { slug: string | null }[])
            .map((row) => row.slug)
            .filter((slug): slug is string => Boolean(slug))
            .map((slug) => ({ slug }));
    } catch {
        // No database reachable at build time (a CI box without secrets, say).
        // Fall back to rendering on demand rather than failing the build.
        return [];
    }
}

// Casts below needed: the Supabase client has no generated Database type, so
// TypeScript infers query results as `never` instead of the real row shape.
// See supabase_schema.md — generating types would remove this.
type DestinationRow = {
    id: string;
    slug: string;
    name: string;
    cover_image: string | null;
    image: string | null;
    description: string | null;
    price: number | null;
    rating: number | null;
};

type DestinationPackageRow = {
    id: string;
    slug: string;
    title: string;
    location: string | null;
    image: string | null;
    category: string | null;
    duration: string | null;
    pickup: string | null;
    dates: string | null;
    price: number;
    rating: number | null;
    reviews: number | null;
};

async function getDestination(slug: string) {
    const supabase = createPublicSupabaseClient();
    const { data } = await supabase
        .from("destinations")
        .select("id,slug,name,cover_image,image,description,price,rating")
        .eq("slug", slug)
        .maybeSingle();
    const destination = data as DestinationRow | null;

    if (!destination) {
        return null;
    }

    const { data: packagesData } = await supabase
        .from("packages")
        .select("id,slug,title,location,image,category,duration,pickup,dates,price,rating,reviews")
        .eq("destination_id", destination.id)
        .eq("status", "published");
    const packages = packagesData as DestinationPackageRow[] | null;

    return { destination, packages: packages ?? [] };
}

// Next.js 16 passes `params` as a Promise for dynamic route segments.
export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDestination(slug);

    if (!data) {
        notFound();
    }

    return (
        <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-12">
            <Container>
                <div className="mb-6">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">{data.destination.name}</h1>
                </div>

                <Section>
                    {data.packages.length === 0 ? (
                        <div className="rounded-[24px] border border-border bg-surface p-8 sm:p-12 text-center shadow-2xs">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy/10 px-3.5 py-1 text-xs font-bold text-canopy border border-canopy/20">
                                <Sparkles className="h-3.5 w-3.5" /> Coming Soon
                            </span>
                            <h3 className="mt-4 text-xl font-bold text-ink">Packages for {data.destination.name} Launching Soon!</h3>
                            <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
                                We are currently curating handpicked packages for {data.destination.name}. Contact us on WhatsApp for custom itineraries!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                            {data.packages.map((pkg) => (
                                <div key={pkg.id} className="flex flex-col justify-between rounded-[16px] border border-border bg-surface p-3 sm:rounded-[20px] sm:p-5">
                                    <div>
                                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] sm:rounded-[16px]">
                                            <Image
                                                src={cldUrl(pkg.image, 500)}
                                                alt={pkg.title}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="mt-3 sm:mt-4">
                                            <p className="text-[10px] text-text-secondary sm:text-sm">{pkg.category}</p>
                                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold tracking-tight text-ink sm:mt-2 sm:text-lg">{pkg.title}</h3>
                                            <p className="mt-1 text-[11px] text-text-secondary sm:mt-2 sm:text-sm">{pkg.duration}</p>
                                            <p className="mt-1.5 text-sm font-bold text-ink sm:mt-3 sm:text-base">{formatPrice(pkg.price)}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`/packages/${pkg.slug}`}
                                        className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-primary-dark sm:mt-5 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </Container>
        </main>
    );
}
