import * as React from "react";
import { Metadata } from "next";
import { landingContent } from "@/constants/content/landing";
import { mockCourses } from "@/constants/mock-data/courses";
import { mockFAQs } from "@/constants/mock-data/faq";
import { mockStatistics } from "@/constants/mock-data/statistics";
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
  StatsSection,
  SubjectsSection,
  SuccessStories,
  TeachersSection,
  TestimonialsSection,
  WhySection,
} from "@/features/landing/components";

export const metadata: Metadata = {
  title: "منصة التعليم الذكي المتكاملة | EduSphere Smart LMS",
  description:
    "EduSphere brings you expert bilingual instructors, school curricula alignment, and 24/7 AI tutor study assistance for optimal grade outcomes.",
};

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "EduSphere",
    "url": "http://localhost:3000",
    "description":
      "EduSphere brings you expert bilingual instructors, school curricula alignment, and 24/7 AI tutor study assistance.",
    "sameAs": ["https://facebook.com/edusphere", "https://twitter.com/edusphere"],
  };

  return (
    <>
      {/* Insert JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* 1. Hero Section */}
        <HeroSection
          badgeText={landingContent.hero.badge}
          title={landingContent.hero.title}
          subtitle={landingContent.hero.subtitle}
          primaryCTA={landingContent.hero.primaryCTA}
          secondaryCTA={landingContent.hero.secondaryCTA}
          quickStats={landingContent.hero.quickStats}
        />

        {/* 2. Partners Logos */}
        <PartnersSection title={landingContent.partners.title} />

        {/* 3. Platform Stats */}
        <StatsSection stats={mockStatistics} />

        {/* 4. Why EduSphere */}
        <WhySection
          title={landingContent.why.title}
          subtitle={landingContent.why.subtitle}
          items={landingContent.why.items}
        />

        {/* 5. Platform Key Features */}
        <FeaturesSection
          title={landingContent.features.title}
          subtitle={landingContent.features.subtitle}
          items={landingContent.features.items}
        />

        {/* 6. Educational Stages */}
        <StagesSection
          title={landingContent.stages.title}
          subtitle={landingContent.stages.subtitle}
          items={landingContent.stages.items}
        />

        {/* 7. Subjects Tags */}
        <SubjectsSection
          title={landingContent.subjects.title}
          subtitle={landingContent.subjects.subtitle}
          items={landingContent.subjects.items}
        />

        {/* 8. How It Works */}
        <HowItWorks
          title={landingContent.howItWorks.title}
          subtitle={landingContent.howItWorks.subtitle}
          steps={landingContent.howItWorks.steps}
        />

        {/* 9. Popular Courses */}
        <CoursesSection
          title={landingContent.courses.title}
          subtitle={landingContent.courses.subtitle}
          courses={mockCourses}
        />

        {/* 10. Featured Teachers */}
        <TeachersSection
          title={landingContent.teachers.title}
          subtitle={landingContent.teachers.subtitle}
          teachers={mockTeachers}
        />

        {/* 11. AI Learning Features */}
        <AISection
          title={landingContent.aiFeatures.title}
          subtitle={landingContent.aiFeatures.subtitle}
          items={landingContent.aiFeatures.items}
        />

        {/* 12. Learning Experience */}
        <ExperienceSection
          title={landingContent.experience.title}
          subtitle={landingContent.experience.subtitle}
          bullets={landingContent.experience.bullets}
        />

        {/* 13. Student Success Metrics */}
        <SuccessStories
          title="Student Academic Achievement"
          subtitle="Our student analytics show continuous score improvements after switching to smart tutoring."
        />

        {/* 14. Student Testimonials */}
        <TestimonialsSection
          title={landingContent.testimonials.title}
          subtitle={landingContent.testimonials.subtitle}
          testimonials={mockTestimonials}
        />

        {/* 15. Pricing comparison cards */}
        <PricingSection
          title={landingContent.pricing.title}
          subtitle={landingContent.pricing.subtitle}
          plans={landingContent.pricing.plans}
          billingOptions={landingContent.pricing.billingOptions}
        />

        {/* 16. FAQ accordion search */}
        <FAQSection
          title={landingContent.faq.title}
          subtitle={landingContent.faq.subtitle}
          faqs={mockFAQs}
        />

        {/* 17. Final CTA Banner */}
        <CTASection
          title={landingContent.cta.title}
          subtitle={landingContent.cta.subtitle}
          primaryButton={landingContent.cta.primaryButton}
          secondaryButton={landingContent.cta.secondaryButton}
        />

        {/* 18. Newsletter Box */}
        <NewsletterSection
          title={landingContent.newsletter.title}
          subtitle={landingContent.newsletter.subtitle}
          placeholder={landingContent.newsletter.placeholder}
          buttonText={landingContent.newsletter.buttonText}
          successMsg={landingContent.newsletter.successMsg}
        />
      </div>
    </>
  );
}
