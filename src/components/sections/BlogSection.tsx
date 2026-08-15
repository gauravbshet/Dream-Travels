"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { Section } from "@/components/ui/Section";
import { blogs as staticBlogs } from "@/data/blogs";
import type { Blog } from "@/data/blogs";
import { cldUrl } from "@/lib/cloudinary";

export function BlogSection({ blogs = staticBlogs }: { blogs?: Blog[] }) {
  return (
    <Section tone="light" id="blogs">
      <Container>
        <SectionHeading title="Travel Stories" />
        <ResponsiveScroller gridClassName="lg:grid-cols-3 lg:gap-6">
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}              whileHover={{ y: -4 }}
              className="w-[82%] xs:w-[72%] sm:w-[56%] shrink-0 snap-start lg:w-full overflow-hidden rounded-[14px] bg-surface border border-border"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] m-1.5">
                <Image
                  src={cldUrl(blog.image, 600)}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 30vw"
                  className="object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[oklch(0.19_0.024_158/0.82)] px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  {blog.category}
                </span>
              </div>
              <div className="px-4 pb-4 pt-2.5">
                <h3 className="font-semibold text-ink tracking-[-0.01em] leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-muted border-t border-border pt-3">
                  <span className="flex items-center gap-1">
                    <User2 className="h-3.5 w-3.5" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}
