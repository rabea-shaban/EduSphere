"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Globe, GraduationCap, Sparkles } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WhyItem {
  title: string;
  description: string;
}

interface WhySectionProps {
  title: string;
  subtitle: string;
  items: WhyItem[];
}

export function WhySection({ title, subtitle, items }: WhySectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Globe className="h-5 w-5 text-secondary shrink-0" />;
      case 1:
        return <GraduationCap className="h-5 w-5 text-primary shrink-0" />;
      default:
        return <Sparkles className="h-5 w-5 text-accent shrink-0" />;
    }
  };

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <Card className="hover:shadow-md hover:scale-[1.01] transition-all duration-300 h-full rounded-2xl">
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="rounded-xl bg-muted p-2.5 shrink-0">{getIcon(idx)}</div>
                  <CardTitle className="text-sm font-extrabold">{item.title}</CardTitle>
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
export default WhySection;
