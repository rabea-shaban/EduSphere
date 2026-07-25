"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PricingPlan {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

interface PricingSectionProps {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
  billingOptions: { monthly: string; yearly: string };
}

export function PricingSection({ title, subtitle, plans, billingOptions }: PricingSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = React.useState(false);

  return (
    <Section ref={ref} className="bg-card border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest select-none">
            Pricing Plans
          </span>
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>

          {/* Toggle Switch Monthly/Yearly */}
          <div className="flex items-center justify-center gap-3 pt-4 select-none">
            <span
              className={cn(
                "text-xs font-bold transition-colors",
                !isYearly ? "text-primary" : "text-muted-foreground"
              )}
            >
              {billingOptions.monthly}
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="Toggle annual billing discount"
              className="cursor-pointer"
            />
            <span
              className={cn(
                "text-xs font-bold transition-colors",
                isYearly ? "text-primary" : "text-muted-foreground"
              )}
            >
              {billingOptions.yearly}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, idx) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col h-full"
              >
                <Card
                  className={cn(
                    "rounded-2xl border flex flex-col h-full transition-all duration-300 relative",
                    plan.isPopular
                      ? "border-primary shadow-lg scale-[1.02] bg-card ring-2 ring-primary/10"
                      : "border-border/70 hover:shadow-md"
                  )}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[9px] font-extrabold uppercase text-primary-foreground tracking-wider select-none shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <CardHeader className="pt-6">
                    <CardTitle className="text-sm font-extrabold text-foreground">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-[10px] text-muted-foreground leading-normal mt-1 min-h-[30px]">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6">
                    {/* Price display */}
                    <div className="flex items-baseline gap-1 select-none">
                      <span className="text-h1 font-heading font-extrabold text-foreground leading-none">
                        ${price}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">/ month</span>
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-2.5 text-xs font-bold text-foreground">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2 select-none leading-tight text-left rtl:text-right"
                        >
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-6">
                    <Button
                      variant={plan.isPopular ? "default" : "outline"}
                      className="w-full rounded-xl cursor-pointer"
                      asChild
                    >
                      <a
                        href={
                          plan.priceMonthly === 0
                            ? "/auth/register"
                            : `/checkout?plan=${plan.name.toLowerCase()}`
                        }
                      >
                        {plan.buttonText}
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
export default PricingSection;
