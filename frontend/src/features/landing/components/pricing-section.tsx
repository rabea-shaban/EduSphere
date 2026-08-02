"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/layout/section-layout";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

interface PricingPlan {
  id?: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
  currency?: string;
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

  // Fetch live active subscription plans from backend MongoDB
  const { data: apiData, isLoading } = useQuery({
    queryKey: ["public-subscription-plans"],
    queryFn: async () => {
      try {
        const res = await api.get("/subscriptions");
        return res.data?.data?.plans || res.data?.data || [];
      } catch (err) {
        console.error("Failed to fetch public subscription plans:", err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const activePlans = React.useMemo(() => {
    if (Array.isArray(apiData) && apiData.length > 0) {
      return apiData
        .filter((p: any) => p.status === "Active" || !p.status)
        .map((p: any) => {
          const isYearlyType = p.subscriptionType === "Yearly";
          const monthlyPrice = isYearlyType ? Math.round((p.price || 0) / 12) : (p.price || 0);
          const yearlyPrice = isYearlyType ? (p.price || 0) : Math.round((p.price || 0) * 10);
          return {
            id: p._id,
            name: p.name,
            priceMonthly: monthlyPrice,
            priceYearly: yearlyPrice,
            description: p.description || "استكشف ميزات الباقة من منصتنا التعليمية",
            features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["دخول لجميع الكورسات", "اختبارات ومراجعات دورية"],
            buttonText: p.price === 0 ? "ابدأ مجاناً الآن" : "اشترك الآن",
            isPopular: !!p.isPopular,
            currency: p.currency || "ج.م",
          };
        });
    }
    return plans;
  }, [apiData, plans]);

  return (
    <SectionWrapper ref={ref} id="pricing" className="bg-slate-50/50 dark:bg-slate-950/60">
      <SectionContainer className="space-y-12">
        
        {/* Section Header */}
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription>{subtitle}</SectionDescription>

          {/* Toggle Switch Monthly/Yearly */}
          <div className="flex items-center justify-center gap-3 pt-6 select-none">
            <span
              className={cn(
                "text-xs sm:text-sm font-bold transition-colors",
                !isYearly ? "text-[#1E73D8] dark:text-blue-400" : "text-slate-400"
              )}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {billingOptions.monthly}
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="تبديل الخطة السنوية"
              className="cursor-pointer"
            />
            <span
              className={cn(
                "text-xs sm:text-sm font-bold transition-colors",
                isYearly ? "text-[#1E73D8] dark:text-blue-400" : "text-slate-400"
              )}
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {billingOptions.yearly}
            </span>
          </div>
        </SectionHeader>

        {/* Pricing Cards Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-8 w-8 text-[#1E73D8] animate-spin" />
            <span className="text-xs font-bold text-slate-500">جاري تحميل خطط الاشتراكات...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {activePlans.map((plan: any, idx: number) => {
              const price = isYearly ? plan.priceYearly : plan.priceMonthly;
              const currencySymbol = plan.currency || "ج.م";
              return (
                <motion.div
                  key={plan.id || plan.name || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col h-full"
                >
                <Card
                  className={cn(
                    "rounded-[24px] border flex flex-col h-full transition-all duration-300 relative bg-white dark:bg-slate-900",
                    plan.isPopular
                      ? "border-[#1E73D8] shadow-xl scale-[1.02] ring-2 ring-[#1E73D8]/20 dark:ring-blue-500/20"
                      : "border-slate-100 dark:border-slate-800 hover:shadow-md"
                  )}
                >
                  {plan.isPopular && (
                    <span
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#F58220] px-3.5 py-1 text-[11px] font-extrabold text-white tracking-wider select-none shadow-md"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      الأكثر شعبية
                    </span>
                  )}

                  <CardHeader className="pt-6 text-right">
                    <CardTitle
                      className="text-lg font-bold text-[#0B2D5B] dark:text-white"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {plan.name}
                    </CardTitle>
                    <CardDescription
                      className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 min-h-[36px]"
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                    >
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6 text-right">
                    {/* Price Display in EGP (ج.م) */}
                    <div className="flex items-baseline justify-end gap-1.5 select-none dir-rtl">
                      <span
                        className="text-3xl sm:text-4xl font-black text-[#0B2D5B] dark:text-white leading-none"
                        style={{ fontFamily: "'Cairo', sans-serif" }}
                      >
                        {price === 0 ? "مجاناً" : `${price} ج.م`}
                      </span>
                      {price > 0 && (
                        <span
                          className="text-xs font-bold text-slate-400"
                          style={{ fontFamily: "'Cairo', sans-serif" }}
                        >
                          / {isYearly ? "سنوياً" : "شهرياً"}
                        </span>
                      )}
                    </div>

                    {/* Features checklist */}
                    <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {plan.features.map((feature: string, fIdx: number) => (
                        <li
                          key={fIdx}
                          className="flex items-center justify-end gap-2.5 select-none leading-tight"
                          style={{ fontFamily: "'Cairo', sans-serif" }}
                        >
                          <span>{feature}</span>
                          <Check className="h-4 w-4 text-[#1E73D8] dark:text-blue-400 shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pb-6">
                    <Button
                      variant={plan.isPopular ? "default" : "outline"}
                      className={cn(
                        "w-full rounded-xl h-11 font-bold text-xs sm:text-sm cursor-pointer transition-all duration-200",
                        plan.isPopular
                          ? "bg-[#1E73D8] hover:bg-[#155ab3] text-white shadow-md"
                          : "border-slate-200 dark:border-slate-700 text-[#0B2D5B] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                      style={{ fontFamily: "'Cairo', sans-serif" }}
                      asChild
                    >
                      <a
                        href={
                          plan.priceMonthly === 0
                            ? "/register"
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
      )}
      </SectionContainer>
    </SectionWrapper>
  );
}

export default PricingSection;
