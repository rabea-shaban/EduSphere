"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Plus, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AISectionProps {
  badgeText: string;
  title: string;
  subtitle: string;
  btnText: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export function AISection({
  badgeText,
  title,
  subtitle,
  btnText,
  q1,
  q2,
  q3,
  q4,
}: AISectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const prompts = [q1, q2, q3, q4];

  return (
    <Section ref={ref} className="bg-muted/10 border-b border-border/40 overflow-hidden" id="ai-assistant">
      <Container className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side: Mock Robot & Chat Prompts Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full flex flex-col md:flex-row items-center gap-6 bg-card border border-border/70 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
        >
          {/* Radial soft background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          {/* Robot Visual placeholder block */}
          <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border border-primary/10 w-full md:w-1/2 select-none z-10">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-inner">
              <Bot className="h-10 w-10 animate-bounce" />
            </div>
            <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">EduBot Assistant</span>
            <span className="text-[9px] text-muted-foreground mt-1">24/7 Smart Companion</span>
          </div>

          {/* Prompt options list */}
          <div className="flex-1 w-full space-y-2 z-10">
            <span className="block text-[10px] font-bold text-muted-foreground mb-3 text-left rtl:text-right select-none">
              How can I help you today?
            </span>
            {prompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-between p-3 text-left rtl:text-right bg-muted/50 hover:bg-muted border border-border/60 hover:border-primary/20 rounded-xl text-[10px] font-bold text-foreground transition-all cursor-pointer"
              >
                <span>{prompt}</span>
                <Plus className="h-3.5 w-3.5 text-primary shrink-0 ml-2 rtl:mr-2 rtl:ml-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Slogans & Button */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 text-left rtl:text-right space-y-6"
        >
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 text-xs border-accent/20 bg-accent/5 text-accent rounded-full font-semibold select-none"
          >
            <Sparkles className="h-3 w-3 text-accent shrink-0" />
            {badgeText}
          </Badge>

          <h2 className="text-h2 font-heading font-extrabold tracking-tight text-foreground leading-[1.2] max-w-md">
            {title}
          </h2>

          <p className="text-body text-muted-foreground max-w-md leading-relaxed">
            {subtitle}
          </p>

          <Button
            size="lg"
            className="rounded-xl h-12 px-6 font-bold bg-accent hover:bg-accent/90 text-white shadow-md cursor-pointer shrink-0"
            asChild
          >
            <Link href="/advisor" className="gap-2">
              <span>{btnText}</span>
              <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
            </Link>
          </Button>
        </motion.div>

      </Container>
    </Section>
  );
}
export default AISection;
