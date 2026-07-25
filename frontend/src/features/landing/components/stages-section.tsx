"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, GraduationCap, ChevronRight } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StageItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  subjectsCount: number;
  coursesCount: number;
  exploreText: string;
  image: string;
}

interface StagesSectionProps {
  title: string;
  subtitle: string;
  items: StageItem[];
}

export function StagesSection({ title, subtitle, items }: StagesSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="overflow-hidden h-full rounded-2xl border border-border/70 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="relative h-48 w-full bg-muted overflow-hidden select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover h-full w-full hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-bold text-primary">
                    {item.subtitle}
                  </div>
                </div>

                <CardHeader className="space-y-1 pt-5">
                  <CardTitle className="text-h4 font-heading font-extrabold">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-foreground pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1.5 select-none">
                      <BookOpen className="h-4 w-4 text-secondary shrink-0" />
                      <span>{item.subjectsCount} Subjects</span>
                    </div>
                    <div className="flex items-center gap-1.5 select-none">
                      <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                      <span>{item.coursesCount} Courses</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pb-5">
                  <Button variant="outline" className="w-full rounded-xl cursor-pointer" asChild>
                    <a href={`/courses?stage=${item.id}`} className="gap-1.5">
                      <span>{item.exploreText}</span>
                      <ChevronRight className="h-4 w-4 rtl:rotate-180 shrink-0" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default StagesSection;
