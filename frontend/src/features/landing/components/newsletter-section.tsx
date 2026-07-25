"use client";

import * as React from "react";
import { toast } from "sonner";
import { Container, Section } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterSectionProps {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  successMsg: string;
}

export function NewsletterSection({
  title,
  subtitle,
  placeholder,
  buttonText,
  successMsg,
}: NewsletterSectionProps) {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email format.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(successMsg);
      setEmail("");
    }, 1000);
  };

  return (
    <Section className="bg-card border-b border-border/40">
      <Container className="max-w-3xl">
        <div className="bg-muted/30 border border-border/85 rounded-3xl p-8 md:p-12 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-h3 font-heading font-extrabold tracking-tight">{title}</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 rounded-xl text-xs bg-card"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 rounded-xl px-6 font-bold cursor-pointer shrink-0"
              loading={isLoading}
            >
              {buttonText}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
export default NewsletterSection;
