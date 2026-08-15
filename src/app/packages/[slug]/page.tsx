// Cached for 5 minutes rather than rendered per request. Catalogue content
// changes rarely, so serving every visitor a fresh Supabase round-trip was
// pure waste. Admin edits appear within 5 minutes.
export const revalidate = 300;

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    MapPin,
    Star,
    Clock,
    Users,
    Utensils,
    Languages as LanguagesIcon,
    Compass,
    Check,
    X as XIcon,
    ShieldCheck,
    Sparkles,
    Headphones,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { createPublicSupabaseClient } from "@/lib/supabase.server";
import { formatPrice } from "@/lib/utils";
import { PackageGallery } from "@/components/packages/PackageGallery";
import { PackageBookingCard } from "@/components/packages/PackageBookingCard";
import { PackageMobileBar } from "@/components/packages/PackageMobileBar";
import { PackageSectionNav } from "@/components/packages/PackageSectionNav";
import { PackageItinerary } from "@/components/packages/PackageItinerary";

type PackageDetail = {
    id: string;
    slug: string;
    title: string;
    location: string | null;
    image: string | null;
    additional_images: string[] | null;
    category: string | null;
    duration: string | null;
    pickup: string | null;
    drop_point: string | null;
    dates: string | null;
    price: number;
    original_price: number | null;
    overview: string | null;
    destination_id: string | null;
    rating: number | null;
    reviews: number | null;
    is_top_pick: boolean | null;
    status: string | null;
    highlights: string[] | null;
    inclusions: string[] | null;
    exclusions: string[] | null;
    faq: { question: string; answer: string }[] | null;
    difficulty: string | null;
    best_time: string | null;
    languages: string[] | null;
    travel_type: string | null;
    max_group_size: number | null;
    transport: string | null;
    accommodation: string | null;
    meals: string | null;
};

type ItineraryDay = {
    id: string;
    day: number;
    title: string;
    description: string | null;
    stay_location: string | null;
    stay_type: string | null;
    meals: string | null;
    image: string | null;
    optional_note: string | null;
};

type RelatedPackage = {
    id: string;
    slug: string;
    title: string;
    image: string | null;
    price: number;
    duration: string | null;
    location: string | null;
};

const PACKAGE_COLUMNS =
    "id,slug,title,location,image,additional_images,category,duration,pickup,drop_point,dates,price,original_price,overview,destination_id,rating,reviews,is_top_pick,status,highlights,inclusions,exclusions,faq,difficulty,best_time,languages,travel_type,max_group_size,transport,accommodation,meals";

// Prerender every published package at build time. Drafts are excluded
// deliberately — `getPackageData` 404s them anyway. New packages still work:
// `dynamicParams` defaults to true, so an unknown slug renders on first
// request and is cached from then on.
export async function generateStaticParams() {
    try {
        const supabase = createPublicSupabaseClient();
        const { data } = await supabase
            .from("packages")
            .select("slug")
            .eq("status", "published");
        return (data ?? [])
            .map((row) => row.slug)
            .filter((slug): slug is string => Boolean(slug))
            .map((slug) => ({ slug }));
    } catch {
        // No database reachable at build time — render on demand rather than
        // failing the build.
        return [];
    }
}

async function getPackageData(slug: string) {
    const supabase = createPublicSupabaseClient();

    const { data: pkg } = await supabase
        .from("packages")
        .select(PACKAGE_COLUMNS)
        .eq("slug", slug)
        .maybeSingle<PackageDetail>();

    if (!pkg || pkg.status === "draft") {
        return null;
    }

    const { data: itinerary } = await supabase
        .from("itineraries")
        .select("id,day,title,description,stay_location,stay_type,meals,image,optional_note")
        .eq("package_id", pkg.id)
        .order("day", { ascending: true });

    let related: RelatedPackage[] = [];
    if (pkg.destination_id) {
        const { data } = await supabase
            .from("packages")
            .select("id,slug,title,image,price,duration,location")
            .eq("destination_id", pkg.destination_id)
            .eq("status", "published")
            .neq("id", pkg.id)
            .limit(4);
        related = data ?? [];
    }

    if (related.length === 0 && pkg.category) {
        const { data } = await supabase
            .from("packages")
            .select("id,slug,title,image,price,duration,location")
            .eq("category", pkg.category)
            .eq("status", "published")
            .neq("id", pkg.id)
            .limit(4);
        related = data ?? [];
    }

    return {
        pkg,
        itinerary: (itinerary ?? []) as ItineraryDay[],
        related,
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const data = await getPackageData(slug);

    if (!data) {
        return { title: "Package not found | Dream Travels" };
    }

    const { pkg } = data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const description =
        pkg.overview?.slice(0, 155) ?? `${pkg.title} — ${pkg.duration ?? "a curated trip"} with Dream Travels.`;

    return {
        title: `${pkg.title} | Dream Travels`,
        description,
        alternates: siteUrl ? { canonical: `${siteUrl}/packages/${pkg.slug}` } : undefined,
        openGraph: {
            title: pkg.title,
            description,
            images: pkg.image ? [{ url: pkg.image }] : undefined,
            type: "website",
        },
    };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getPackageData(slug);

    if (!data) {
        notFound();
    }

    const { pkg, itinerary, related } = data;
    const gallery = [pkg.image, ...(pkg.additional_images ?? [])].filter(
        (src): src is string => Boolean(src)
    );
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: pkg.title,
        description: pkg.overview ?? undefined,
        image: gallery,
        offers: {
            "@type": "Offer",
            price: pkg.price,
            priceCurrency: "INR",
        },
        // Only publish a rating when real reviews sit behind it. Google rejects
        // an AggregateRating whose reviewCount is 0, and shipping one anyway
        // puts the domain's rich results at risk. A package that has a rating
        // but no reviews yet simply omits the field.
        aggregateRating:
            pkg.rating && pkg.reviews && pkg.reviews > 0
                ? {
                      "@type": "AggregateRating",
                      ratingValue: pkg.rating,
                      reviewCount: pkg.reviews,
                  }
                : undefined,
    };

    return (
        <main className="flex-1 pt-24 sm:pt-28 lg:pt-32 pb-28 lg:pb-16 bg-canvas">
            {/* eslint-disable-next-line react/no-danger */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <Container className="mb-4">
                <nav className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                    <Link href="/" className="hover:text-canopy transition-colors">Home</Link>
                    <span className="text-border-lit">/</span>
                    <Link href="/packages" className="hover:text-canopy transition-colors">Packages</Link>
                    <span className="text-border-lit">/</span>
                    <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none">{pkg.title}</span>
                </nav>
            </Container>

            {/* Hero Banner */}
            <Container className="mb-8">
                <div className="relative h-[380px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-md border border-border/60">
                    {gallery[0] && (
                        <Image src={gallery[0]} alt={pkg.title} fill priority sizes="100vw" className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-8 text-white">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            {pkg.rating != null && (
                                <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md border border-white/15">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {pkg.rating.toFixed(1)}
                                </span>
                            )}
                            {pkg.duration && (
                                <span className="rounded-full bg-canopy px-3 py-1 font-bold text-white shadow-xs">
                                    {pkg.duration}
                                </span>
                            )}
                            {pkg.category && (
                                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-md border border-white/15">
                                    {pkg.category}
                                </span>
                            )}
                            {pkg.travel_type && (
                                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-md border border-white/15">
                                    {pkg.travel_type}
                                </span>
                            )}
                        </div>
                        <h1 className="font-sans mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                            {pkg.title}
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 font-medium">
                            {pkg.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-canopy shrink-0" /> {pkg.location}
                                </span>
                            )}
                            <span className="rounded-full bg-black/50 px-4 py-1.5 text-base sm:text-lg text-white font-bold backdrop-blur-md border border-white/10">
                                Starting {formatPrice(pkg.price)} <span className="text-sm sm:text-base font-normal text-white/70">/ person</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Sticky Section Quick Jump Nav Bar */}
            <PackageSectionNav />

            <Container>
                <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
                    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
                        {/* Gallery */}
                        {gallery.length > 1 && <PackageGallery images={gallery} title={pkg.title} />}

                        {/* Overview */}
                        {pkg.overview && (
                            <section id="overview" className="scroll-mt-36">
                                <h2 className="text-2xl font-bold tracking-tight text-ink">Trip Overview</h2>
                                <div 
                                    className="prose-measure mt-3 text-base leading-relaxed text-ink/80 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: pkg.overview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                />
                            </section>
                        )}

                        {/* Highlights */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                            <section id="highlights" className="scroll-mt-36">
                                <h2 className="text-2xl font-bold tracking-tight text-ink">Trip Highlights</h2>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {pkg.highlights.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 rounded-[16px] border border-border/80 bg-surface p-4 text-sm font-medium text-ink shadow-2xs hover:border-canopy/40 hover:shadow-xs transition-all"
                                        >
                                            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-canopy" /> 
                                            <span 
                                                className="whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Trip facts */}
                        <section id="facts" className="scroll-mt-36">
                            <h2 className="text-2xl font-bold tracking-tight text-ink">Trip Facts & Details</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <Fact icon={<Clock className="h-4 w-4" />} label="Duration" value={pkg.duration} />
                                <Fact icon={<Users className="h-4 w-4" />} label="Group size" value={pkg.max_group_size ? `Up to ${pkg.max_group_size} guests` : null} />
                                <Fact icon={<Compass className="h-4 w-4" />} label="Difficulty" value={pkg.difficulty} />
                                <Fact icon={<Utensils className="h-4 w-4" />} label="Meals Included" value={pkg.meals} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Transport" value={pkg.transport} />
                                <Fact icon={<LanguagesIcon className="h-4 w-4" />} label="Languages" value={pkg.languages?.join(", ")} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Pickup Point" value={pkg.pickup} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Drop Point" value={pkg.drop_point} />
                                <Fact icon={<Clock className="h-4 w-4" />} label="Best Time to Visit" value={pkg.best_time} />
                            </div>
                        </section>

                        {/* Day-wise itinerary (Interactive & Timeline modes) */}
                        <PackageItinerary itinerary={itinerary} />

                        {/* Inclusions / Exclusions */}
                        {((pkg.inclusions?.length ?? 0) > 0 || (pkg.exclusions?.length ?? 0) > 0) && (
                            <section id="inclusions" className="scroll-mt-36 grid gap-6 sm:grid-cols-2">
                                {(pkg.inclusions?.length ?? 0) > 0 && (
                                    <div className="rounded-[20px] border border-emerald-200/80 bg-emerald-50/30 p-5 sm:p-6">
                                        <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">✓</span>
                                            What&apos;s Included
                                        </h3>
                                        <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink/80">
                                            {pkg.inclusions!.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> 
                                                    <span 
                                                        className="whitespace-pre-wrap"
                                                        dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(pkg.exclusions?.length ?? 0) > 0 && (
                                    <div className="rounded-[20px] border border-rose-200/80 bg-rose-50/30 p-5 sm:p-6">
                                        <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold">✕</span>
                                            Not Included
                                        </h3>
                                        <ul className="mt-4 space-y-2.5 text-sm font-medium text-ink/80">
                                            {pkg.exclusions!.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> 
                                                    <span 
                                                        className="whitespace-pre-wrap"
                                                        dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Why Choose Us / Trust Badges */}
                        <section id="trust" className="scroll-mt-36 rounded-[20px] border border-border/80 bg-surface p-5 sm:p-6 shadow-2xs">
                            <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-canopy" /> Why Book With Dream Travels?
                            </h2>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-[14px] bg-canvas/60 p-3.5 border border-border/60">
                                    <ShieldCheck className="h-5 w-5 text-canopy shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-ink">100% Verified Local Guides</h4>
                                        <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">Experienced, licensed local experts ensuring your trip is safe, authentic, and hassle-free.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-[14px] bg-canvas/60 p-3.5 border border-border/60">
                                    <Sparkles className="h-5 w-5 text-canopy shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-ink">Transparent Pricing</h4>
                                        <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">No hidden fees or unexpected costs. What you see is exactly what you pay.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-[14px] bg-canvas/60 p-3.5 border border-border/60">
                                    <Headphones className="h-5 w-5 text-canopy shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-ink">24/7 On-Trip Support</h4>
                                        <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">Dedicated trip coordinator available round the clock on WhatsApp and call throughout your journey.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-[14px] bg-canvas/60 p-3.5 border border-border/60">
                                    <Check className="h-5 w-5 text-canopy shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-xs sm:text-sm text-ink">Flexible Cancellation</h4>
                                        <p className="text-[11px] text-ink-muted mt-0.5 leading-relaxed">Free cancellation up to 48 hours before departure on qualifying package bookings.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQs */}
                        {pkg.faq && pkg.faq.length > 0 && (
                            <section id="faq" className="scroll-mt-36">
                                <h2 className="text-2xl font-bold tracking-tight text-ink">Frequently Asked Questions</h2>
                                <div className="mt-4 space-y-3">
                                    {pkg.faq.map((item, i) => (
                                        <details key={i} className="group rounded-[16px] border border-border/80 bg-surface p-4 sm:p-5 transition-colors [&[open]]:border-canopy/40">
                                            <summary className="cursor-pointer list-none font-bold text-ink flex items-center justify-between gap-4">
                                                <span>{item.question}</span>
                                                <span className="text-canopy font-bold text-lg transition-transform group-open:rotate-45">+</span>
                                            </summary>
                                            <p className="mt-3 text-sm leading-relaxed text-ink/80 border-t border-border/60 pt-3">{item.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Bottom CTA */}
                        <section className="rounded-[20px] bg-primary/10 p-6 text-center">
                            <h3 className="text-lg font-semibold text-ink">Ready for {pkg.title}?</h3>
                            <p className="mt-1 text-sm text-ink/70">Lock in your dates before they fill up.</p>
                            <Link
                                href={`/booking?package=${encodeURIComponent(pkg.slug)}`}
                                className="mt-4 inline-flex items-center justify-center rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
                            >
                                Book Now
                            </Link>
                        </section>

                        {/* Related packages */}
                        {related.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-ink">You may also like</h2>
                                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {related.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/packages/${item.slug}`}
                                            className="group overflow-hidden rounded-[16px] border border-border bg-surface"
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        sizes="320px"
                                                        className="object-cover transition-transform group-hover:scale-105"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="line-clamp-1 font-semibold text-ink">{item.title}</h3>
                                                <p className="mt-1 text-xs text-ink/60">{item.location ?? item.duration}</p>
                                                <p className="mt-2 font-semibold text-ink">{formatPrice(item.price)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sticky booking card (desktop) */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <PackageBookingCard
                                slug={pkg.slug}
                                title={pkg.title}
                                price={pkg.price}
                                originalPrice={pkg.original_price}
                                whatsappNumber={whatsappNumber}
                            />
                        </div>
                    </aside>
                </div>
            </Container>

            {/* Sticky bottom bar (mobile) */}
            <PackageMobileBar
                slug={pkg.slug}
                title={pkg.title}
                price={pkg.price}
                whatsappNumber={whatsappNumber}
            />
        </main>
    );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="rounded-[14px] border border-border bg-surface p-4">
            <div className="flex items-center gap-2 text-ink/50">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
        </div>
    );
}
