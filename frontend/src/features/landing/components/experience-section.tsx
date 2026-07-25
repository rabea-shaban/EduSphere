"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Play } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";

interface ExperienceSectionProps {
  title: string;
  subtitle: string;
  bullets: string[];
}

export function ExperienceSection({ title, subtitle, bullets }: ExperienceSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40">
      <Container className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Side: Mock Video Stream Interface */}
        <div className="flex-1 w-full relative flex items-center justify-center min-h-[260px] bg-card border border-border/70 rounded-2xl shadow-xl overflow-hidden aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
            alt="LMS Video Dashboard Mockup"
            className="absolute inset-0 object-cover h-full w-full opacity-60 grayscale-[20%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 h-16 w-16 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer"
            aria-label="Play Demo Stream"
          >
            <Play className="h-6 w-6 fill-primary-foreground ml-1" />
          </motion.button>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/95 font-bold z-10 select-none">
            <span>Lesson 1: Basics</span>
            <span>12:40 / 34:00</span>
          </div>
        </div>

        {/* Right Side: Text Slogans */}
        <div className="flex-1 space-y-6 text-left rtl:text-right">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground leading-relaxed">{subtitle}</p>

          <ul className="space-y-3 pt-2">
            {bullets.map((bullet, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-start gap-2.5 text-xs font-bold text-foreground leading-normal select-none"
              >
                <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
export default ExperienceSection;
