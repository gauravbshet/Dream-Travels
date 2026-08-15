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
    available_dates: string[] | null;
    available_from: string | null;
    available_to: string | null;
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
    slots_left: number | null;
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
    "id,slug,title,location,image,additional_images,category,duration,pickup,drop_point,dates,available_dates,available_from,available_to,price,original_price,overview,destination_id,rating,reviews,is_top_pick,status,highlights,inclusions,exclusions,faq,difficulty,best_time,languages,travel_type,max_group_size,transport,accommodation,meals,slots_left";

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

    // These two don't depend on each other — only both depend on `pkg`,
    // fetched above. Running them together instead of sequentially cuts
    // one round-trip of latency off every render (build time + each
    // 5-minute ISR revalidation).
    const [{ data: itinerary }, { data: relatedByDestination }] = await Promise.all([
        supabase
            .from("itineraries")
            .select("id,day,title,description,stay_location,stay_type,meals,image,optional_note")
            .eq("package_id", pkg.id)
            .order("day", { ascending: true }),
        pkg.destination_id
            ? supabase
                .from("packages")
                .select("id,slug,title,image,price,duration,location")
                .eq("destination_id", pkg.destination_id)
                .eq("status", "published")
                .neq("id", pkg.id)
                .limit(4)
            : Promise.resolve({ data: [] as RelatedPackage[] }),
    ]);

    let related: RelatedPackage[] = relatedByDestination ?? [];

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
            <Container className="mb-8 overflow-hidden">
                <div className="relative min-h-[340px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-md border border-border/60">
                    {gallery[0] && (
                        <Image src={gallery[0]} alt={pkg.title} fill priority sizes="100vw" className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                    <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-end p-4 sm:p-8 text-white">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
                            {pkg.rating != null && (
                                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 sm:px-3 sm:py-1 backdrop-blur-md border border-white/15">
                                    <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" /> {pkg.rating.toFixed(1)}
                                </span>
                            )}
                            {pkg.duration && (
                                <span className="rounded-full bg-canopy px-2.5 py-0.5 sm:px-3 sm:py-1 font-bold text-white shadow-xs">
                                    {pkg.duration}
                                </span>
                            )}
                            {pkg.category && (
                                <span className="rounded-full bg-black/40 px-2.5 py-0.5 sm:px-3 sm:py-1 backdrop-blur-md border border-white/15">
                                    {pkg.category}
                                </span>
                            )}
                            {pkg.travel_type && (
                                <span className="rounded-full bg-black/40 px-2.5 py-0.5 sm:px-3 sm:py-1 backdrop-blur-md border border-white/15 truncate max-w-[180px] sm:max-w-none">
                                    {pkg.travel_type}
                                </span>
                            )}
                        </div>
                        <h1 className="font-sans mt-2 sm:mt-3 text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-snug drop-shadow-md">
                            {pkg.title}
                        </h1>
                        <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/90 font-medium">
                            {pkg.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-canopy shrink-0" /> {pkg.location}
                                </span>
                            )}
                            <span className="rounded-full bg-black/50 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-lg text-white font-bold backdrop-blur-md border border-white/10">
                                Starting {formatPrice(pkg.price)} <span className="text-[10px] sm:text-base font-normal text-white/70">/ person</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Sticky Section Quick Jump Nav Bar */}
            <PackageSectionNav />

            <Container className="overflow-hidden">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] items-start min-w-0 w-full">
                    <div className="min-w-0 w-full space-y-6 sm:space-y-8 lg:space-y-12">
                        {/* Gallery */}
                        {gallery.length > 1 && <PackageGallery images={gallery} title={pkg.title} />}

                        {/* Overview */}
                        {pkg.overview && (
                            <section id="overview" className="scroll-mt-36">
                                <h2 className="text-2xl font-bold tracking-tight text-ink">Trip Overview</h2>
                                <div 
                                    className="prose-measure mt-3 text-sm sm:text-base leading-relaxed text-ink/80 whitespace-pre-wrap break-words max-w-full overflow-hidden"
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

                        {/* Cancellation & Refund Policy */}
                        <section id="refund-policy" className="scroll-mt-36 rounded-[20px] border border-border/80 bg-surface p-5 sm:p-7 shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
                                        <ShieldCheck className="h-6 w-6 text-canopy shrink-0" /> Cancellation & Refund Policy
                                    </h2>
                                    <p className="mt-1 text-xs sm:text-sm text-ink-muted">
                                        Clear, transparent cancellation terms. All refunds are calculated based on departure timeline.
                                    </p>
                                </div>
                                <Link
                                    href="/cancellation-policy"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-canopy hover:underline"
                                >
                                    View Full Policy →
                                </Link>
                            </div>

                            {/* Refund Timeline Table */}
                            <div className="mt-5 overflow-x-auto w-full">
                                <div className="min-w-[320px] sm:min-w-[440px] overflow-hidden rounded-[16px] border border-border/80 bg-canvas/40">
                                    <table className="w-full text-left text-xs sm:text-sm">
                                        <thead className="bg-sage-100/70 border-b border-border/80">
                                            <tr className="text-ink font-bold">
                                                <th className="px-4 py-3">Cancellation Notice</th>
                                                <th className="px-4 py-3">Refund Amount</th>
                                                <th className="px-4 py-3">Retention Charge</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/60 bg-surface">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-ink">30+ Days before departure</td>
                                                <td className="px-4 py-3 font-extrabold text-emerald-600">90% Refund</td>
                                                <td className="px-4 py-3 text-ink-muted">10% Charge</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-ink">21 – 29 Days before departure</td>
                                                <td className="px-4 py-3 font-extrabold text-emerald-600">75% Refund</td>
                                                <td className="px-4 py-3 text-ink-muted">25% Charge</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-ink">15 – 20 Days before departure</td>
                                                <td className="px-4 py-3 font-extrabold text-amber-600">50% Refund</td>
                                                <td className="px-4 py-3 text-ink-muted">50% Charge</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-ink">8 – 14 Days before departure</td>
                                                <td className="px-4 py-3 font-extrabold text-amber-600">25% Refund</td>
                                                <td className="px-4 py-3 text-ink-muted">75% Charge</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-ink">0 – 7 Days before departure / No-show</td>
                                                <td className="px-4 py-3 font-extrabold text-rose-600">Non-Refundable</td>
                                                <td className="px-4 py-3 text-ink-muted">100% Charge</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Important Policy Guidelines */}
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-[14px] bg-canvas/60 p-4 border border-border/60">
                                    <h4 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4 text-canopy shrink-0" /> Non-Refundable Direct Costs
                                    </h4>
                                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                        Trek/Forest permits, entry tickets, hotel reservations, transport bookings & payment gateway fees are non-refundable once issued.
                                    </p>
                                </div>

                                <div className="rounded-[14px] bg-canvas/60 p-4 border border-border/60">
                                    <h4 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5">
                                        <ShieldCheck className="h-4 w-4 text-canopy shrink-0" /> Weather & Force Majeure
                                    </h4>
                                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                        If roads/destinations close due to weather, landslides or Govt orders, we offer alternative dates, modified routes, or partial refunds after deducting direct non-recoverable supplier costs.
                                    </p>
                                </div>

                                <div className="rounded-[14px] bg-canvas/60 p-4 border border-border/60">
                                    <h4 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-canopy shrink-0" /> Quick Refund Processing
                                    </h4>
                                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                        Approved refunds are processed back to your original payment method (bank account / UPI) within <strong>7–15 working days</strong>.
                                    </p>
                                </div>

                                <div className="rounded-[14px] bg-canvas/60 p-4 border border-border/60">
                                    <h4 className="font-bold text-xs sm:text-sm text-ink flex items-center gap-1.5">
                                        <Users className="h-4 w-4 text-canopy shrink-0" /> Booking Transfer Option
                                    </h4>
                                    <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                        Cannot travel? You can transfer your seat to a friend or family member free of charge up to 72 hours before departure (subject to permit rules).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Bottom CTA */}
                        <section className="rounded-[20px] bg-primary/10 p-6 text-center">
                            <h3 className="text-lg font-semibold text-ink">Ready for {pkg.title}?</h3>
                            <p className="mt-1 text-sm text-ink/70">Lock in your dates before they fill up.</p>
                            <Link
                                href={`/booking?package=${encodeURIComponent(pkg.slug)}${pkg.available_from ? `&available_from=${pkg.available_from}` : ''}${pkg.available_to ? `&available_to=${pkg.available_to}` : ''}`}
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
                                slotsLeft={pkg.slots_left}
                                availableDates={pkg.available_dates}
                                availableFrom={pkg.available_from}
                                availableTo={pkg.available_to}
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
                availableFrom={pkg.available_from}
                availableTo={pkg.available_to}
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
