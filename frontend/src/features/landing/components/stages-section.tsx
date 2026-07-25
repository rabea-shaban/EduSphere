"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Backpack, BookOpen, Target, GraduationCap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StageItem {
  id: string;
  title: string;
  description: string;
  btnText: string;
  icon: "backpack" | "book" | "target" | "cap" | "trophy";
}

interface StagesSectionProps {
  title: string;
  subtitle: string;
  items: StageItem[];
}

export function StagesSection({ title, subtitle, items }: StagesSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = (iconName: string, iconClass: string) => {
    switch (iconName) {
      case "backpack":
        return <Backpack className={iconClass} />;
      case "book":
        return <BookOpen className={iconClass} />;
      case "target":
        return <Target className={iconClass} />;
      case "cap":
        return <GraduationCap className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  const getColors = (iconName: string) => {
    switch (iconName) {
      case "backpack":
        return { bg: "bg-blue-100 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400" };
      case "book":
        return { bg: "bg-green-100 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400" };
      case "target":
        return { bg: "bg-orange-100 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-400" };
      case "cap":
        return { bg: "bg-indigo-100 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400" };
      default:
        return { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" };
    }
  };

  return (
    <Section ref={ref} className="bg-card border-b border-border/40" id="stages">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((item, idx) => {
            const colors = getColors(item.icon);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col h-full"
              >
                <Card className="rounded-2xl border border-border/70 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between text-center p-5 bg-card h-full group">
                  <div className={cn("rounded-2xl p-4 mb-4 shrink-0 transition-transform group-hover:scale-105", colors.bg)}>
                    {getIcon(item.icon, cn("h-7 w-7", colors.text))}
                  </div>

                  <CardContent className="p-0 flex-grow space-y-2 flex flex-col justify-center">
                    <h3 className="text-xs font-extrabold text-foreground leading-normal">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-0 pt-5 w-full mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl cursor-pointer text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                      asChild
                    >
                      <a href={`/courses?stage=${item.id}`}>
                        {item.btnText}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
export default StagesSection;
