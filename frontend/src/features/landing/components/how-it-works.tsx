"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Container, Section, SectionTitle } from "@/components/layout";

interface Step {
  step: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export function HowItWorks({ title, subtitle, steps }: HowItWorksProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line in desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center space-y-4 px-4"
            >
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground text-sm font-extrabold flex items-center justify-center border-4 border-card shadow-sm select-none">
                {step.step}
              </div>
              <h3 className="text-h4 font-heading font-extrabold">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default HowItWorks;
