export const dynamic = "force-dynamic";

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
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { formatPrice } from "@/lib/utils";
import { PackageGallery } from "@/components/packages/PackageGallery";
import { PackageBookingCard } from "@/components/packages/PackageBookingCard";
import { PackageMobileBar } from "@/components/packages/PackageMobileBar";

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

async function getPackageData(slug: string) {
    const supabase = createServerSupabaseClient();

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

// Next.js 16 passes `params` as a Promise for dynamic route segments — this
// was the root cause of "Package not found" on every package: the previous
// code read `params.slug` synchronously and always got `undefined`.
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
        aggregateRating: pkg.rating
            ? {
                  "@type": "AggregateRating",
                  ratingValue: pkg.rating,
                  reviewCount: pkg.reviews ?? 0,
              }
            : undefined,
    };

    return (
        <main className="flex-1 pb-24 lg:pb-0">
            {/* eslint-disable-next-line react/no-danger */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumb */}
            <Container className="pt-6">
                <nav className="flex items-center gap-2 text-xs text-ink/50">
                    <Link href="/" className="hover:text-ink">Home</Link>
                    <span>/</span>
                    <Link href="/packages" className="hover:text-ink">Packages</Link>
                    <span>/</span>
                    <span className="text-ink/70">{pkg.title}</span>
                </nav>
            </Container>

            {/* Hero */}
            <div className="relative mt-4 h-[360px] w-full overflow-hidden sm:h-[460px]">
                {gallery[0] && (
                    <Image src={gallery[0]} alt={pkg.title} fill priority sizes="100vw" className="object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                <Container className="relative flex h-full flex-col justify-end pb-8 text-white">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        {pkg.rating != null && (
                            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {pkg.rating.toFixed(1)}
                            </span>
                        )}
                        {pkg.duration && (
                            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{pkg.duration}</span>
                        )}
                        {pkg.category && (
                            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{pkg.category}</span>
                        )}
                        {pkg.travel_type && (
                            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{pkg.travel_type}</span>
                        )}
                    </div>
                    <h1 className="display-section mt-4 max-w-2xl text-3xl sm:text-5xl">{pkg.title}</h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/85">
                        {pkg.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" /> {pkg.location}
                            </span>
                        )}
                        <span className="font-semibold text-white">
                            Starting {formatPrice(pkg.price)} / person
                        </span>
                    </div>
                </Container>
            </div>

            <Container className="mt-10">
                <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                    <div className="space-y-10">
                        {/* Gallery */}
                        {gallery.length > 1 && <PackageGallery images={gallery} title={pkg.title} />}

                        {/* Overview */}
                        {pkg.overview && (
                            <section>
                                <h2 className="text-xl font-semibold text-ink">Overview</h2>
                                <p className="prose-measure mt-3 text-[15px] leading-relaxed text-ink/75">
                                    {pkg.overview}
                                </p>
                            </section>
                        )}

                        {/* Highlights */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-ink">Highlights</h2>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {pkg.highlights.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2.5 rounded-[14px] border border-border bg-surface p-4 text-sm text-ink/80"
                                        >
                                            <Compass className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Trip facts */}
                        <section>
                            <h2 className="text-xl font-semibold text-ink">Trip facts</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <Fact icon={<Clock className="h-4 w-4" />} label="Duration" value={pkg.duration} />
                                <Fact icon={<Users className="h-4 w-4" />} label="Group size" value={pkg.max_group_size ? `Up to ${pkg.max_group_size}` : null} />
                                <Fact icon={<Compass className="h-4 w-4" />} label="Difficulty" value={pkg.difficulty} />
                                <Fact icon={<Utensils className="h-4 w-4" />} label="Meals" value={pkg.meals} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Transport" value={pkg.transport} />
                                <Fact icon={<LanguagesIcon className="h-4 w-4" />} label="Languages" value={pkg.languages?.join(", ")} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Pickup" value={pkg.pickup} />
                                <Fact icon={<MapPin className="h-4 w-4" />} label="Drop" value={pkg.drop_point} />
                                <Fact icon={<Clock className="h-4 w-4" />} label="Best time" value={pkg.best_time} />
                            </div>
                        </section>

                        {/* Day-wise itinerary */}
                        {itinerary.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-ink">Day-by-day itinerary</h2>
                                <div className="relative mt-6 space-y-6 border-l border-border pl-8">
                                    {itinerary.map((day) => (
                                        <div key={day.id} className="relative">
                                            <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                                {day.day}
                                            </span>
                                            <div className="rounded-[18px] border border-border bg-surface p-5">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                    Day {day.day}
                                                </p>
                                                <h3 className="mt-1 text-lg font-semibold text-ink">{day.title}</h3>
                                                {day.description && (
                                                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{day.description}</p>
                                                )}
                                                {day.image && (
                                                    <div className="relative mt-3 h-48 w-full overflow-hidden rounded-[14px]">
                                                        <Image src={day.image} alt={day.title} fill sizes="600px" className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
                                                    {day.meals && (
                                                        <span className="rounded-full bg-sage-100 px-3 py-1">🍽 {day.meals}</span>
                                                    )}
                                                    {day.stay_location && (
                                                        <span className="rounded-full bg-sage-100 px-3 py-1">
                                                            🏨 {day.stay_location}
                                                            {day.stay_type ? ` (${day.stay_type})` : ""}
                                                        </span>
                                                    )}
                                                    {day.optional_note && (
                                                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-700">
                                                            {day.optional_note}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Inclusions / Exclusions */}
                        {((pkg.inclusions?.length ?? 0) > 0 || (pkg.exclusions?.length ?? 0) > 0) && (
                            <section className="grid gap-6 sm:grid-cols-2">
                                {(pkg.inclusions?.length ?? 0) > 0 && (
                                    <div className="rounded-[18px] border border-border bg-surface p-5">
                                        <h3 className="font-semibold text-ink">What&apos;s included</h3>
                                        <ul className="mt-3 space-y-2 text-sm text-ink/75">
                                            {pkg.inclusions!.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {(pkg.exclusions?.length ?? 0) > 0 && (
                                    <div className="rounded-[18px] border border-border bg-surface p-5">
                                        <h3 className="font-semibold text-ink">Not included</h3>
                                        <ul className="mt-3 space-y-2 text-sm text-ink/75">
                                            {pkg.exclusions!.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* FAQs */}
                        {pkg.faq && pkg.faq.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-ink">Frequently asked questions</h2>
                                <div className="mt-4 space-y-2">
                                    {pkg.faq.map((item, i) => (
                                        <details key={i} className="group rounded-[14px] border border-border bg-surface p-4">
                                            <summary className="cursor-pointer list-none font-medium text-ink">
                                                {item.question}
                                            </summary>
                                            <p className="mt-2 text-sm text-ink/70">{item.answer}</p>
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
