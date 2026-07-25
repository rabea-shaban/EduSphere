"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, Star, Users2 } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card } from "@/components/ui/card";

interface SuccessStoriesProps {
  title: string;
  subtitle: string;
}

export function SuccessStories({ title, subtitle }: SuccessStoriesProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    {
      value: "98%",
      label: "Syllabus Score Rate",
      description: "Students scoring in top percentiles",
    },
    { value: "4.9/5", label: "Average Rating", description: "From verified parent reviews" },
    { value: "25K+", label: "Quizzes Solved", description: "Practice exams completed" },
  ];

  return (
    <Section ref={ref} className="bg-card border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-all text-center p-6 flex flex-col items-center justify-center bg-muted/20">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 select-none">
                  {idx === 0 ? (
                    <Trophy className="h-5 w-5 shrink-0" />
                  ) : idx === 1 ? (
                    <Star className="h-5 w-5 fill-primary shrink-0" />
                  ) : (
                    <Users2 className="h-5 w-5 shrink-0" />
                  )}
                </div>
                <span className="block text-h2 font-heading font-extrabold text-foreground leading-none">
                  {m.value}
                </span>
                <span className="block text-xs font-bold text-foreground mt-2">{m.label}</span>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                  {m.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default SuccessStories;
