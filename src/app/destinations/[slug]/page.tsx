export const dynamic = "force-dynamic";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { MapPin, Package as PackageIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

async function getDestination(slug: string) {
    const supabase = createServerSupabaseClient();
    const { data: destination } = await supabase
        .from("destinations")
        .select("id,slug,name,cover_image,image,description,price,rating")
        .eq("slug", slug)
        .single();

    if (!destination) {
        return null;
    }

    const { data: packages } = await supabase
        .from("packages")
        .select("id,slug,title,location,image,category,duration,pickup,dates,price,rating,reviews")
        .eq("destination_id", destination.id);

    return { destination, packages: packages ?? [] };
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
    const data = await getDestination(params.slug);

    if (!data) {
        return <div className="min-h-screen py-24 text-center">Destination not found.</div>;
    }

    return (
        <main className="flex-1 py-20">
            <Container>
                <SectionHeading
                    eyebrow="Destination"
                    title={data.destination.name}
                    emoji="📍"
                    description={data.destination.description ?? "Explore one of our featured destinations."}
                />

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="overflow-hidden rounded-[24px] bg-white border border-border">
                        <div className="relative h-[420px] w-full">
                            <Image
                                src={data.destination.cover_image ?? data.destination.image}
                                alt={data.destination.name}
                                fill
                                sizes="100vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-border bg-white p-8">
                        <div className="space-y-4">
                            <p className="text-sm text-text-secondary">Location overview</p>
                            <div className="flex items-center gap-3 text-ink/80">
                                <MapPin className="h-4 w-4" />
                                <span>{data.destination.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <PackageIcon className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-ink">Packages available</span>
                            </div>
                            <p className="text-sm text-ink/80">{data.packages.length} packages found for this destination.</p>
                        </div>
                    </div>
                </div>

                <Section className="mt-14">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {data.packages.map((pkg) => (
                            <div key={pkg.id} className="rounded-[20px] border border-border bg-white p-5">
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px]">
                                    <Image
                                        src={pkg.image}
                                        alt={pkg.title}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-text-secondary">{pkg.category}</p>
                                    <h3 className="mt-2 text-lg font-semibold text-ink tracking-[-0.01em]">{pkg.title}</h3>
                                    <p className="mt-2 text-sm text-text-secondary">{pkg.duration}</p>
                                    <p className="mt-3 font-semibold text-ink">{formatPrice(pkg.price)}</p>
                                </div>
                                <a
                                    href={`/packages/${pkg.slug}`}
                                    className="mt-5 inline-flex items-center justify-center rounded-[12px] bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                >
                                    View package
                                </a>
                            </div>
                        ))}
                    </div>
                </Section>
            </Container>
        </main>
    );
}
