import { Container } from "@/components/ui/Container";

export default function CategoryLoading() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-16">
      <Container>
        <div className="h-7 w-48 animate-pulse rounded bg-surface-sage" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-surface-sage" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-[16px] bg-surface-sage" />
          ))}
        </div>
      </Container>
    </main>
  );
}
