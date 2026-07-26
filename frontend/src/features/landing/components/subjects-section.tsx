"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Calculator, FlaskConical, BookOpen, PenTool, Activity, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, Section, SectionTitle } from "@/components/layout";

interface SubjectItem {
  name: string;
  icon: string;
  color: string;
}

interface SubjectsSectionProps {
  title: string;
  subtitle: string;
  items: SubjectItem[];
}

export function SubjectsSection({ title, subtitle, items }: SubjectsSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = (iconName: string, color: string) => {
    const classes = cn("h-6 w-6 shrink-0", color);
    switch (iconName) {
      case "calculator":
        return <Calculator className={classes} />;
      case "flask":
        return <FlaskConical className={classes} />;
      case "pen-tool":
        return <PenTool className={classes} />;
      case "activity":
        return <Activity className={classes} />;
      case "droplets":
        return <Droplet className={classes} />;
      default:
        return <BookOpen className={classes} />;
    }
  };

  return (
    <Section id="subjects" ref={ref} className="bg-card border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border/60 rounded-2xl text-center gap-3 hover:border-primary/20 hover:bg-muted/50 transition-all select-none cursor-default"
            >
              {getIcon(item.icon, item.color)}
              <span className="text-xs font-bold text-foreground">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default SubjectsSection;
