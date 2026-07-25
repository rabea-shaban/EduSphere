"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Star, Users, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  teacherName: string;
  teacherAvatar: string;
  price: number;
  originalPrice?: number;
  studentsCount: number;
  rating: number;
  duration: string;
  thumbnail: string;
  stage: string;
}

interface CoursesSectionProps {
  title: string;
  subtitle: string;
  courses: Course[];
  viewAllText: string;
  studentsLabel: string;
}

export function CoursesSection({
  title,
  subtitle,
  courses,
  viewAllText,
  studentsLabel,
}: CoursesSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} className="bg-card border-b border-border/40" id="courses">
      <Container className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left rtl:text-right space-y-3 max-w-2xl">
            <SectionTitle>{title}</SectionTitle>
            <p className="text-body text-muted-foreground">{subtitle}</p>
          </div>
          <Button variant="outline" className="rounded-xl shrink-0 cursor-pointer w-fit" asChild>
            <Link href="/courses" className="gap-1.5">
              <span>{viewAllText}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180 shrink-0" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Card className="overflow-hidden h-full rounded-2xl border border-border/70 hover:shadow-lg transition-all duration-300 flex flex-col group bg-card">
                {/* Course Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/95 text-primary-foreground text-[9px] font-bold rounded-lg border-none shadow-sm py-1 select-none">
                    {course.stage}
                  </Badge>
                </div>

                <CardContent className="p-4 flex-1 space-y-4">
                  {/* Teacher Bio */}
                  <div className="flex items-center gap-2 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.teacherAvatar}
                      alt={course.teacherName}
                      className="h-7 w-7 rounded-full object-cover border border-border"
                    />
                    <span className="text-[10px] font-bold text-foreground">
                      {course.teacherName}
                    </span>
                  </div>

                  {/* Course Title */}
                  <CardTitle className="text-xs font-extrabold text-foreground leading-snug line-clamp-2 min-h-[36px]">
                    {course.title}
                  </CardTitle>

                  {/* Rating & Students counts */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground pt-1 select-none">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent shrink-0" />
                      <span className="text-foreground">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {course.studentsCount} {studentsLabel}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 select-none">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 select-none">
                    {course.originalPrice && (
                      <span className="text-[10px] font-semibold text-muted-foreground line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-primary">${course.price}</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default CoursesSection;
