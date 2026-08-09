"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { blogs as staticBlogs, type Blog } from "@/data/blogs";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * "The Latest" + "Trending" two-column magazine block: blog posts on the
 * left, a ranked list of top packages on the right. Stacks to a single
 * column on mobile with trending shown as a compact list below the posts.
 */
export function LatestArticles({
  blogs = staticBlogs,
  packages = staticPackages,
}: {
  blogs?: Blog[];
  packages?: Package[];
}) {
  const trending = [...packages]
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 5);

  if (blogs.length === 0 && trending.length === 0) return null;

  return (
    <Section tone="light">
      <Container>
        <SectionHeading title="The Latest" description="Travel tips, guides, and stories from our team." />

        <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:gap-6">
          <div className="grid gap-3.5 sm:grid-cols-2">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-[16px] border border-border bg-surface"
              >
                <Link href="#" className="relative block aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-canopy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {post.category}
                  </span>
                </Link>
                <div className="p-4 sm:p-5">
                  <Link href="#">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink hover:text-canopy sm:text-base">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-2 text-xs text-ink-muted sm:text-sm">{post.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-muted">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="rounded-[16px] border border-border bg-surface p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <TrendingUp className="h-4 w-4 text-amber" />
              Trending
            </div>
            <ol className="mt-4 space-y-4">
              {trending.map((pkg, index) => (
                <li key={pkg.id}>
                  <Link
                    href={`/packages/${pkg.slug ?? pkg.id}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="mt-0.5 text-lg font-extrabold text-ink/20 group-hover:text-canopy">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-canopy">
                        {pkg.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">{pkg.location}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
