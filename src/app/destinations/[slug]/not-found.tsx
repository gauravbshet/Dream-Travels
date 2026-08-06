import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function DestinationNotFound() {
    return (
        <main className="flex flex-1 items-center justify-center py-24">
            <Container className="max-w-xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Compass className="h-10 w-10 text-primary" />
                </div>
                <h1 className="display-section mt-6 text-3xl text-ink">This destination is off the map</h1>
                <p className="prose-measure mx-auto mt-3 text-ink/70">
                    We couldn&apos;t find a destination at this link. It may have been renamed or removed.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to home
                    </Link>
                </div>
            </Container>
        </main>
    );
}
