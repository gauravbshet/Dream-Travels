export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/utils";
import { BookingForm } from "@/components/packages/BookingForm";

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{ package?: string; travellers?: string; date?: string }>;
}) {
    const { package: slug, travellers, date } = await searchParams;

    if (!slug) {
        notFound();
    }

    const supabase = createServerSupabaseClient();
    const { data: pkg } = await supabase
        .from("packages")
        .select("id,slug,title,image,price,duration,location")
        .eq("slug", slug)
        .maybeSingle();

    if (!pkg) {
        notFound();
    }

    return (
        <main className="flex-1 py-16">
            <Container className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Complete your enquiry</p>
                <h1 className="display-section mt-2 text-3xl text-ink">Book {pkg.title}</h1>
                <p className="mt-2 text-sm text-ink/60">
                    Share your details and our travel desk will confirm availability and next steps over
                    WhatsApp or phone.
                </p>

                <div className="mt-8 grid gap-8 sm:grid-cols-[220px_1fr]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-border">
                        {pkg.image && (
                            <Image src={pkg.image} alt={pkg.title} fill sizes="220px" className="object-cover" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold text-ink">{pkg.title}</h2>
                        <p className="mt-1 text-sm text-ink/60">{pkg.location} · {pkg.duration}</p>
                        <p className="mt-2 text-lg font-bold text-ink">{formatPrice(pkg.price)} <span className="text-sm font-normal text-ink/60">/ person</span></p>
                        <Link href={`/packages/${pkg.slug}`} className="mt-2 inline-block text-sm text-primary hover:underline">
                            View full package details
                        </Link>
                    </div>
                </div>

                <div className="mt-10 rounded-[20px] border border-border bg-surface p-6 sm:p-8">
                    <BookingForm
                        packageTitle={pkg.title}
                        defaultTravellers={travellers ? Number(travellers) : 2}
                        defaultDate={date ?? ""}
                        whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
                    />
                </div>
            </Container>
        </main>
    );
}
