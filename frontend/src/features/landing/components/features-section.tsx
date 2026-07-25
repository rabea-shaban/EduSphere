"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Video, Users, Calendar, TrendingUp } from "lucide-react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export function FeaturesSection({ title, subtitle, items }: FeaturesSectionProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "video":
        return <Video className="h-5 w-5 text-primary shrink-0" />;
      case "users":
        return <Users className="h-5 w-5 text-secondary shrink-0" />;
      case "calendar":
        return <Calendar className="h-5 w-5 text-accent shrink-0" />;
      default:
        return <TrendingUp className="h-5 w-5 text-success shrink-0" />;
    }
  };

  return (
    <Section ref={ref} className="bg-card border-b border-border/40">
      <Container className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionTitle>{title}</SectionTitle>
          <p className="text-body text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full rounded-2xl group cursor-default">
                <CardHeader className="space-y-3">
                  <div className="rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors p-2.5 w-fit">
                    {getIcon(item.icon)}
                  </div>
                  <CardTitle className="text-sm font-extrabold group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
export default FeaturesSection;
