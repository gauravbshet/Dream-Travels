export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { formatPrice } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { WishlistButton } from "@/components/ui/WishlistButton";

async function getPackageData(slug: string) {
    const supabase = createServerSupabaseClient();

    const { data: pkg } = await supabase
        .from("packages")
        .select(
            "id,slug,title,location,image,category,duration,pickup,dates,price,original_price,overview,destination_id"
        )
        .eq("slug", slug)
        .single();

    if (!pkg) {
        return null;
    }

    const { data: itinerary } = await supabase
        .from("itineraries")
        .select("day,title,description")
        .eq("package_id", pkg.id)
        .order("day", { ascending: true });

    return { pkg, itinerary: itinerary ?? [] };
}

export default async function PackagePage({ params }: { params: { slug: string } }) {
    const data = await getPackageData(params.slug);

    if (!data) {
        return <div className="min-h-screen py-24 text-center">Package not found.</div>;
    }

    return (
        <main className="flex-1 py-20">
            <Container>
                <SectionHeading
                    title={data.pkg.title}
                    description={data.pkg.overview ?? "Explore the itinerary and book with confidence."}
                />

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-8">
                        <div className="overflow-hidden rounded-[24px] bg-white border border-border">
                            <div className="relative h-[320px] sm:h-[460px] w-full">
                                <Image
                                    src={data.pkg.image}
                                    alt={data.pkg.title}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-border bg-white p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-[16px] bg-sage-100/60 p-5">
                                    <p className="text-sm text-text-secondary">Duration</p>
                                    <p className="mt-2 text-lg font-semibold text-ink">{data.pkg.duration}</p>
                                </div>
                                <div className="rounded-[16px] bg-sage-100/60 p-5">
                                    <p className="text-sm text-text-secondary">Price</p>
                                    <p className="mt-2 text-lg font-semibold text-ink">
                                        {formatPrice(data.pkg.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-ink">What&apos;s included</h3>
                                <p className="mt-3 text-sm text-text-secondary">A carefully designed trip with all essentials set for your journey.</p>
                                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <li className="rounded-[16px] border border-border bg-white p-4 text-sm text-ink/80">Accommodation</li>
                                    <li className="rounded-[16px] border border-border bg-white p-4 text-sm text-ink/80">Transfers</li>
                                    <li className="rounded-[16px] border border-border bg-white p-4 text-sm text-ink/80">Guided tours</li>
                                    <li className="rounded-[16px] border border-border bg-white p-4 text-sm text-ink/80">Meals included</li>
                                </ul>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-border bg-white p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-text-secondary">Trip itinerary</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-ink">Day-by-day plan</h2>
                                </div>
                                <div className="flex items-center gap-2 text-ink/60">
                                    <MapPin className="h-4 w-4" />
                                    {data.pkg.location}
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                {data.itinerary.length === 0 ? (
                                    <p className="text-sm text-text-secondary">Itinerary details are coming soon.</p>
                                ) : (
                                    data.itinerary.map((item) => (
                                        <div key={item.day} className="rounded-[16px] border border-border bg-white p-5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-ink">Day {item.day}</p>
                                                    <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
                                                </div>
                                                <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-primary">
                                                    {data.pkg.duration}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm text-ink/75">{item.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-[24px] border border-border bg-white p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-text-secondary">Booking</p>
                                    <h3 className="mt-2 text-lg font-semibold text-ink">Ready to book?</h3>
                                </div>
                                <WishlistButton />
                            </div>

                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent(
                                    `Hello! I would like to inquire about booking *${data.pkg.title}* (${data.pkg.duration}). Price: $${data.pkg.price}. Please share availability.`
                                )}`}
                                className="mt-8 inline-flex w-full items-center justify-center rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                            >
                                Contact on WhatsApp
                            </a>

                            <div className="mt-6 rounded-[16px] bg-sage-100/60 p-5 text-sm text-ink/70">
                                <p>
                                    <strong>Pickup:</strong> {data.pkg.pickup}
                                </p>
                                <p className="mt-2">
                                    <strong>Category:</strong> {data.pkg.category}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-border bg-white p-8">
                            <h3 className="text-lg font-semibold text-ink">Related packages</h3>
                            <div className="mt-5 space-y-4">
                                <Link href="/packages" className="block rounded-[16px] border border-border bg-white p-4 text-sm text-primary transition hover:bg-sage-100">
                                    View all packages
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </Container>
        </main>
    );
}
