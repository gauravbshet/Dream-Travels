"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, User2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { Section } from "@/components/ui/Section";
import { fadeUp, viewportOnce, fadeUpDelay } from "@/lib/motion";
import { blogs as staticBlogs } from "@/data/blogs";
import type { Blog } from "@/data/blogs";

export function BlogSection({ blogs = staticBlogs }: { blogs?: Blog[] }) {
  return (
    <Section id="blogs">
      <Container>
        <SectionHeading eyebrow="Read & Explore" title="Travel Stories" />
        <ResponsiveScroller gridClassName="lg:grid-cols-3 lg:gap-6">
          {blogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={fadeUpDelay(i)}
              whileHover={{ y: -4 }}
              className="w-[82%] xs:w-[72%] sm:w-[56%] shrink-0 snap-start lg:w-full overflow-hidden rounded-[20px] bg-white border border-border"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] m-1.5">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 70vw, 30vw"
                  className="object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
                  {blog.category}
                </span>
              </div>
              <div className="px-4 pb-4 pt-2.5">
                <h3 className="font-semibold text-ink tracking-[-0.01em] leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-text-secondary border-t border-border pt-3">
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
