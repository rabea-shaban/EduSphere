"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  course: string;
  review: string;
  rating: number;
  avatar: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({ title, subtitle, testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <Section className="bg-muted/10 border-b border-border/40 overflow-hidden">
      <Container className="space-y-12 max-w-4xl">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest select-none">
            Testimonials
          </span>
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        {/* Carousel slider card wrapper */}
        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl border border-border/70 p-6 md:p-10 shadow-lg relative bg-card">
              <Quote className="absolute right-6 top-6 h-12 w-12 text-muted/10 rotate-180 -z-0 pointer-events-none" />
              <CardContent className="space-y-6 pt-4 relative z-10 text-center md:text-left rtl:md:text-right">
                {/* Rating stars */}
                <div className="flex items-center justify-center md:justify-start gap-1 select-none">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "h-4 w-4 shrink-0",
                        idx < Math.floor(current.rating) ? "text-accent fill-accent" : "text-muted"
                      )}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm md:text-base font-semibold leading-relaxed text-foreground italic">
                  &ldquo;{current.review}&rdquo;
                </p>

                {/* Student Avatar Bio details */}
                <div className="flex flex-col md:flex-row items-center gap-3 pt-4 border-t border-border/40">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={current.avatar} alt={current.name} className="object-cover" />
                    <AvatarFallback>{current.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left rtl:md:text-right">
                    <h4 className="text-xs font-extrabold text-foreground">{current.name}</h4>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {current.course}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Slider controls */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="h-9 w-9 rounded-full cursor-pointer shadow-sm"
              aria-label="Previous testimonial review"
            >
              <ChevronLeft className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </Button>
            <span className="text-[10px] font-bold text-muted-foreground select-none">
              {activeIndex + 1} / {testimonials.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-9 w-9 rounded-full cursor-pointer shadow-sm"
              aria-label="Next testimonial review"
            >
              <ChevronRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
export default TestimonialsSection;
