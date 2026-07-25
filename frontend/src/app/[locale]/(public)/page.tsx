import * as React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { mockCourses } from "@/constants/mock-data/courses";
import { mockFAQs } from "@/constants/mock-data/faq";
import { mockTeachers } from "@/constants/mock-data/teachers";
import { mockTestimonials } from "@/constants/mock-data/testimonials";
import {
  AISection,
  CTASection,
  CoursesSection,
  ExperienceSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  HowItWorks,
  NewsletterSection,
  PartnersSection,
  PricingSection,
  StagesSection,
  SubjectsSection,
  SuccessStories,
  TeachersSection,
  TestimonialsSection,
  WhySection,
} from "@/features/landing/components";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  return {
    title: t("badge"),
    description: t("subtitle"),
    openGraph: {
      title: t("badge"),
      description: t("subtitle"),
      url: `http://localhost:3000/${locale}`,
      siteName: "EduSphere",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("badge"),
      description: t("subtitle"),
    },
  };
}

export default function LandingPage() {
  const tHero = useTranslations("Hero");
  const tStats = useTranslations("Stats");
  const tWhy = useTranslations("Why");
  const tFeatures = useTranslations("Features");
  const tStages = useTranslations("Stages");
  const tSubjects = useTranslations("Subjects");
  const tHowItWorks = useTranslations("HowItWorks");
  const tCourses = useTranslations("Courses");
  const tTeachers = useTranslations("Teachers");
  const tAI = useTranslations("AI");
  const tTestimonials = useTranslations("Testimonials");
  const tPricing = useTranslations("Pricing");
  const tFAQ = useTranslations("FAQ");
  const tCTA = useTranslations("CTA");
  const tNewsletter = useTranslations("Newsletter");

  // 1. Hero Quick Stats & Floating Details (Embedded inside HeroSection)
  const heroQuickStats = [
    { value: "4.8/5", label: tStats("rating"), icon: "star" },
    { value: "+500", label: tStats("teachers"), icon: "teacher" },
    { value: "+2,000", label: tStats("hours"), icon: "clock" },
    { value: "+50K", label: tStats("students"), icon: "students" },
  ];

  // 2. Trust Badges row (directly below Hero)
  const trustBadgesList = [
    { title: tHero("trustTitle1"), subtitle: tHero("trustSub1"), icon: "headphones" },
    { title: tHero("trustTitle2"), subtitle: tHero("trustSub2"), icon: "trending-up" },
    { title: tHero("trustTitle3"), subtitle: tHero("trustSub3"), icon: "cloud" },
    { title: tHero("trustTitle4"), subtitle: tHero("trustSub4"), icon: "award" },
  ];

  // 3. Why Section items (Matches tags in the image)
  const whyItems = [
    { title: tWhy("anytime"), description: tWhy("anytimeDesc"), icon: "clock" as const },
    { title: tWhy("teachers"), description: tWhy("teachersDesc"), icon: "users" as const },
    { title: tWhy("monitoring"), description: tWhy("monitoringDesc"), icon: "trending-up" as const },
    { title: tWhy("ai"), description: tWhy("aiDesc"), icon: "sparkles" as const },
    { title: tWhy("interactive"), description: tWhy("interactiveDesc"), icon: "play" as const },
  ];

  // 4. Platform Highlights / Features
  const featureItems = [
    { title: tFeatures("live"), description: tFeatures("liveDesc"), icon: "video" },
    { title: tFeatures("backup"), description: tFeatures("backupDesc"), icon: "archive" },
    { title: tFeatures("mindmaps"), description: tFeatures("mindmapsDesc"), icon: "file-text" },
    { title: tFeatures("analytics"), description: tFeatures("analyticsDesc"), icon: "trending-up" },
  ];

  // 5. Educational Stages (Matches Arabic grade tags in the image)
  const stageItems = [
    {
      id: "secondary3",
      title: tStages("secondary3"),
      description: tStages("secondary3Desc"),
      btnText: tStages("secondary3Btn"),
      icon: "trophy" as const,
    },
    {
      id: "secondary2",
      title: tStages("secondary2"),
      description: tStages("secondary2Desc"),
      btnText: tStages("secondary2Btn"),
      icon: "cap" as const,
    },
    {
      id: "secondary1",
      title: tStages("secondary1"),
      description: tStages("secondary1Desc"),
      btnText: tStages("secondary1Btn"),
      icon: "target" as const,
    },
    {
      id: "prep",
      title: tStages("prep"),
      description: tStages("prepDesc"),
      btnText: tStages("prepBtn"),
      icon: "book" as const,
    },
    {
      id: "primary",
      title: tStages("primary"),
      description: tStages("primaryDesc"),
      btnText: tStages("primaryBtn"),
      icon: "backpack" as const,
    },
  ];

  // 6. Core Subjects covered
  const subjectItems = [
    { name: tSubjects("math"), icon: "calculator", color: "text-secondary" },
    { name: tSubjects("science"), icon: "flask", color: "text-accent" },
    { name: tSubjects("english"), icon: "book-open", color: "text-primary" },
    { name: tSubjects("arabic"), icon: "pen-tool", color: "text-success" },
    { name: tSubjects("physics"), icon: "activity", color: "text-danger" },
    { name: tSubjects("chemistry"), icon: "droplets", color: "text-warning" },
  ];

  // 7. How it Works steps
  const howItWorksSteps = [
    { step: "01", title: tHowItWorks("step1Title"), description: tHowItWorks("step1Desc") },
    { step: "02", title: tHowItWorks("step2Title"), description: tHowItWorks("step2Desc") },
    { step: "03", title: tHowItWorks("step3Title"), description: tHowItWorks("step3Desc") },
  ];

  // 8. Dynamic Courses Translation Map
  const translatedCourses = mockCourses.map((course) => ({
    ...course,
    title: tCourses(course.titleKey),
    teacherName: tTeachers(course.teacherNameKey),
    stage: tStages(course.stageKey + "Btn"),
  }));

  // 9. Dynamic Teachers Translation Map
  const translatedTeachers = mockTeachers.map((teacher) => ({
    ...teacher,
    name: tTeachers(teacher.nameKey),
    specialization: tTeachers(teacher.specializationKey),
    experience: teacher.experience + " " + tTeachers("years"),
  }));

  // 10. Dynamic Testimonials Translation Map
  const translatedTestimonials = mockTestimonials.map((item) => ({
    ...item,
    name: tTestimonials(`reviews.${item.id}.name`),
    course: tTestimonials(`reviews.${item.id}.course`),
    review: tTestimonials(`reviews.${item.id}.review`),
  }));

  // 11. Dynamic FAQ Accordions Translation Map
  const translatedFAQs = mockFAQs.map((faq) => ({
    ...faq,
    question: tFAQ(`items.${faq.id}.question`),
    answer: tFAQ(`items.${faq.id}.answer`),
  }));

  // 12. Dynamic Pricing Plans Config
  const pricingPlans = [
    {
      name: tPricing("freeName"),
      priceMonthly: 0,
      priceYearly: 0,
      description: tPricing("freeDesc"),
      features: [
        tPricing("fFree1"),
        tPricing("fFree2"),
        tPricing("fFree3"),
        tPricing("fFree4"),
      ],
      buttonText: tPricing("freeBtn"),
      isPopular: false,
    },
    {
      name: tPricing("basicName"),
      priceMonthly: 19,
      priceYearly: 15,
      description: tPricing("basicDesc"),
      features: [
        tPricing("fBasic1"),
        tPricing("fBasic2"),
        tPricing("fBasic3"),
        tPricing("fBasic4"),
      ],
      buttonText: tPricing("basicBtn"),
      isPopular: false,
    },
    {
      name: tPricing("premName"),
      priceMonthly: 39,
      priceYearly: 31,
      description: tPricing("premDesc"),
      features: [
        tPricing("fPrem1"),
        tPricing("fPrem2"),
        tPricing("fPrem3"),
        tPricing("fPrem4"),
      ],
      buttonText: tPricing("premBtn"),
      isPopular: true,
    },
    {
      name: tPricing("entName"),
      priceMonthly: 99,
      priceYearly: 79,
      description: tPricing("entDesc"),
      features: [
        tPricing("fEnt1"),
        tPricing("fEnt2"),
        tPricing("fEnt3"),
        tPricing("fEnt4"),
      ],
      buttonText: tPricing("entBtn"),
      isPopular: false,
    },
  ];

  const billingOptions = {
    monthly: tPricing("monthly"),
    yearly: tPricing("yearly"),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EduSphere",
    url: "http://localhost:3000",
    description: tHero("subtitle"),
    sameAs: ["https://facebook.com/edusphere", "https://twitter.com/edusphere"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* 1. Hero Section (Includes floating visual indicators, trust badges & stats card) */}
        <HeroSection
          badgeText={tHero("badge")}
          title={tHero("title")}
          subtitle={tHero("subtitle")}
          primaryCTA={tHero("primaryCTA")}
          secondaryCTA={tHero("secondaryCTA")}
          cardProgressTitle={tHero("cardProgressTitle")}
          cardProgressVal={tHero("cardProgressVal")}
          cardProgressSub={tHero("cardProgressSub")}
          cardContentTitle={tHero("cardContentTitle")}
          cardContentVal={tHero("cardContentVal")}
          cardAITitle={tHero("cardAITitle")}
          cardAISub={tHero("cardAISub")}
          trustBadges={trustBadgesList}
          quickStats={heroQuickStats}
        />

        {/* 2. Partners logos list */}
        <PartnersSection title="Trusted By Leading Educational Institutions" />

        {/* 4. Why Section */}
        <WhySection
          title={tWhy("title")}
          subtitle={tWhy("subtitle")}
          items={whyItems}
        />

        {/* 5. Features Highlight */}
        <FeaturesSection
          title={tFeatures("title")}
          subtitle={tFeatures("subtitle")}
          items={featureItems}
        />

        {/* 6. Educational Stages panel */}
        <StagesSection
          title={tStages("title")}
          subtitle={tStages("subtitle")}
          items={stageItems}
        />

        {/* 7. Core subjectscovered grid */}
        <SubjectsSection
          title={tSubjects("title")}
          subtitle={tSubjects("subtitle")}
          items={subjectItems}
        />

        {/* 8. 3-step learning guide */}
        <HowItWorks
          title={tHowItWorks("title")}
          subtitle={tHowItWorks("subtitle")}
          steps={howItWorksSteps}
        />

        {/* 9. Popular Courses */}
        <CoursesSection
          title={tCourses("title")}
          subtitle={tCourses("subtitle")}
          courses={translatedCourses}
          viewAllText={tCourses("viewAll")}
          studentsLabel={tCourses("students")}
        />

        {/* 10. Featured Teachers */}
        <TeachersSection
          title={tTeachers("title")}
          subtitle={tTeachers("subtitle")}
          teachers={translatedTeachers}
        />

        {/* 11. AI Assistant Assistant (Matches Split screen image) */}
        <AISection
          badgeText={tAI("badge")}
          title={tAI("title")}
          subtitle={tAI("subtitle")}
          btnText={tAI("btn")}
          q1={tAI("q1")}
          q2={tAI("q2")}
          q3={tAI("q3")}
          q4={tAI("q4")}
        />

        {/* 12. Study experience mock video */}
        <ExperienceSection
          title="A Premium LMS Experience"
          subtitle="Engineered with visual clarity to help secondary students optimize exam preparation."
          bullets={[
            "Ad-free focused player environments.",
            "HD content streams without buffering.",
            "Visual study milestone dashboards.",
            "Progress feedback sharing metrics."
          ]}
        />

        {/* 13. Student academic achievements */}
        <SuccessStories
          title="Student Grade Improvements"
          subtitle="EduSphere users demonstrate active score increases compared to traditional schools."
        />

        {/* 14. Student Testimonials */}
        <TestimonialsSection
          title={tTestimonials("title")}
          subtitle={tTestimonials("subtitle")}
          testimonials={translatedTestimonials}
        />

        {/* 15. Dynamic subscription pricing comparison */}
        <PricingSection
          title={tPricing("title")}
          subtitle={tPricing("subtitle")}
          plans={pricingPlans}
          billingOptions={billingOptions}
        />

        {/* 16. Searchable FAQ */}
        <FAQSection
          title={tFAQ("title")}
          subtitle={tFAQ("subtitle")}
          faqs={translatedFAQs}
        />

        {/* 17. Final marketing promo CTA banner */}
        <CTASection
          title={tCTA("title")}
          subtitle={tCTA("subtitle")}
          primaryButton={tCTA("primary")}
          secondaryButton={tCTA("secondary")}
        />

        {/* 18. Newsletter subscribe banner */}
        <NewsletterSection
          title={tNewsletter("title")}
          subtitle={tNewsletter("subtitle")}
          placeholder={tNewsletter("placeholder")}
          buttonText={tNewsletter("btn")}
          successMsg={tNewsletter("success")}
        />
      </div>
    </>
  );
}
