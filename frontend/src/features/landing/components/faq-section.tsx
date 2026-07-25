"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredFAQs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Section className="bg-muted/10 border-b border-border/40">
      <Container className="space-y-10 max-w-4xl">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest select-none">
            FAQ
          </span>
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        {/* FAQ Search Filter Box */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground shrink-0 rtl:right-3 rtl:left-auto" />
          <Input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 rtl:pr-9 rtl:pl-4 h-10 text-xs rounded-xl"
          />
        </div>

        {/* Accordions */}
        <div className="pt-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              No matching questions found. Try typing another keyword.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredFAQs.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-card border border-border/70 rounded-xl px-4 overflow-hidden"
                >
                  <AccordionTrigger className="text-xs font-extrabold text-foreground text-left rtl:text-right py-4 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </Container>
    </Section>
  );
}
export default FAQSection;
