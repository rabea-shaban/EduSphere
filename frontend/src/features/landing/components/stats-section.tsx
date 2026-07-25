"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout";

interface StatItem {
  value: string;
  label: string;
  description: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-card border-b border-border/50">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="text-center space-y-1 select-none"
            >
              <span className="block text-h2 font-heading font-extrabold text-primary md:text-display leading-none">
                {stat.value}
              </span>
              <h4 className="text-xs font-bold text-foreground">{stat.label}</h4>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
export default StatsSection;
