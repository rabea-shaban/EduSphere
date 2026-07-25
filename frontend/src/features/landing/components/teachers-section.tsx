"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Star, Award } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Teacher {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  avatar: string;
}

interface TeachersSectionProps {
  title: string;
  subtitle: string;
  teachers: Teacher[];
}

export function TeachersSection({ title, subtitle, teachers }: TeachersSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <Card className="rounded-2xl border border-border/60 hover:shadow-md transition-all duration-300 overflow-hidden text-center p-6 flex flex-col items-center bg-card">
                <Avatar className="h-20 w-20 shadow-md">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} className="object-cover" />
                  <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                </Avatar>

                <h3 className="text-sm font-extrabold text-foreground mt-4">{teacher.name}</h3>
                <p className="text-[10px] font-bold text-primary tracking-wide uppercase mt-1">
                  {teacher.specialization}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground pt-4 mt-4 border-t border-border/40 w-full justify-center select-none">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-secondary shrink-0" />
                    <span>{teacher.experience} Exp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent fill-accent shrink-0" />
                    <span className="text-foreground">{teacher.rating}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default TeachersSection;
