export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
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
        .maybeSingle();

    if (!destination) {
        return null;
    }

    const { data: packages } = await supabase
        .from("packages")
        .select("id,slug,title,location,image,category,duration,pickup,dates,price,rating,reviews")
        .eq("destination_id", destination.id)
        .eq("status", "published");

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
        <main data-tone="light" className="flex-1 bg-canvas py-10">
            <Container>
                <div className="mb-8 pt-8">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">{data.destination.name}</h1>
                </div>

                <Section>
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                        {data.packages.map((pkg) => (
                            <div key={pkg.id} className="flex flex-col justify-between rounded-[16px] border border-border bg-surface p-3 sm:rounded-[20px] sm:p-5">
                                <div>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] sm:rounded-[16px]">
                                        <Image
                                            src={pkg.image}
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
                </Section>
            </Container>
        </main>
    );
}
