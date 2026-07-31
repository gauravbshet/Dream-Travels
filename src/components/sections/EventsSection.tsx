"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { events } from "@/data/events";

export function EventsSection() {
  return (
    <section className="py-10 lg:py-16">
      <Container>
        <SectionHeading eyebrow="Don't Miss Out" title="Upcoming Events" />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 xl:grid-cols-5 lg:gap-5">
          {events.map((event, i) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="w-[70%] xs:w-[60%] sm:w-[42%] shrink-0 snap-start lg:w-full overflow-hidden rounded-2xl bg-surface shadow-soft border border-black/[0.04]"
            >
              <div className="relative h-32 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 60vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-ink leading-snug line-clamp-1">
                  {event.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/55">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {event.date}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </p>
              </div>
            </motion.article>
          ))}
        </ResponsiveScroller>
      </Container>
    </section>
  );
}
