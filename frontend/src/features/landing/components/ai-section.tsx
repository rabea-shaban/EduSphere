"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Bot, FileQuestion, CalendarDays, BookMarked } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AIFeature {
  title: string;
  description: string;
}

interface AISectionProps {
  title: string;
  subtitle: string;
  items: AIFeature[];
}

export function AISection({ title, subtitle, items }: AISectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Bot className="h-5 w-5 text-secondary shrink-0" />;
      case 1:
        return <FileQuestion className="h-5 w-5 text-accent shrink-0" />;
      case 2:
        return <CalendarDays className="h-5 w-5 text-primary shrink-0" />;
      default:
        return <BookMarked className="h-5 w-5 text-success shrink-0" />;
    }
  };

  return (
    <Section ref={ref} className="bg-card border-b border-border/40 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10" />

      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest select-none">
            AI-Powered LMS
          </span>
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-md hover:border-accent/35 transition-all duration-300 h-full rounded-2xl group bg-muted/10 border-dashed border-border/70">
                <CardHeader className="space-y-3">
                  <div className="rounded-xl bg-accent/5 p-2.5 w-fit group-hover:bg-accent/15 transition-colors">
                    {getIcon(idx)}
                  </div>
                  <CardTitle className="text-sm font-extrabold group-hover:text-accent transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default AISection;
