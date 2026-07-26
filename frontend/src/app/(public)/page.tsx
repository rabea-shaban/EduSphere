import * as React from "react";
import type { Metadata } from "next";
import { mockCourses } from "@/constants/mock-data/courses";
import { mockFAQs } from "@/constants/mock-data/faq";
import { mockTeachers } from "@/constants/mock-data/teachers";
import { mockTestimonials } from "@/constants/mock-data/testimonials";
import {
  AISection,
  CTASection,
  ContactSection,
  CoursesSection,
  ExperienceSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  HeroFeatureBar,
  HeroStats,
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
import type { FeatureBarItem } from "@/features/landing/components/hero-feature-bar";
import type { StatCardItem } from "@/features/landing/components/hero-stats";

// ─── Arabic SEO Metadata ──────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "EduSphere | منصة التعليم الذكي المتكاملة",
  description:
    "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي، بمحتوى تفاعلي، معلمين متخصصين، وذكاء اصطناعي لمساعدتك على التفوق.",
  openGraph: {
    title: "EduSphere | منصة التعليم الذكي المتكاملة",
    description:
      "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي.",
    url: "http://localhost:3000",
    siteName: "EduSphere",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSphere | منصة التعليم الذكي المتكاملة",
    description:
      "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي.",
  },
};

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  // 1. Feature Bar items (below Hero)
  const featureBarItems: FeatureBarItem[] = [
    { icon: "award", title: "محتوى معتمد", description: "من خبراء التعليم" },
    { icon: "cloud", title: "تعلم في أي وقت", description: "من أي مكان وأي جهاز" },
    { icon: "trending-up", title: "معلمون متخصصون", description: "خطوة بخطوة معك" },
    { icon: "headphones", title: "متابعة التقدم", description: "على مدار الساعة" },
  ];

  // 2. Statistics section
  const heroStats: StatCardItem[] = [
    { icon: "users", value: "+50K", label: "طالب نشط" },
    { icon: "clock", value: "+2,000", label: "ساعة محتوى" },
    { icon: "user", value: "+500", label: "معلم متخصص" },
    { icon: "star", value: "4.8/5", label: "تقييم الطلاب" },
  ];

  // 3. Why Section
  const whyItems = [
    { title: "متاح في أي وقت", description: "خطط مرنة تناسب جميع الأوقات.", icon: "clock" as const },
    { title: "معلمون متخصصون", description: "أفضل المدرسين ذوي الخبرة الطويلة.", icon: "users" as const },
    { title: "متابعة ذكية", description: "تقارير شهرية مفصلة تشارك مع أولياء الأمور.", icon: "trending-up" as const },
    { title: "ذكاء اصطناعي", description: "مساعد ذكي يجيب على جميع استفساراتك.", icon: "sparkles" as const },
    { title: "محتوى تفاعلي", description: "فيديوهات تدريبية وتمارين عملية شيقة.", icon: "play" as const },
  ];

  // 4. Features
  const featureItems = [
    { title: "حصص مباشرة وتفاعلية", description: "تفاعل بالوقت الحقيقي داخل الصفوف، شارك زملائك، واسأل معلمك مباشرة.", icon: "video" },
    { title: "مكتبة الحصص المسجلة", description: "فاتتك حصة مباشرة؟ شاهد أرشيف الحصص بجودة عالية في أي وقت يناسبك.", icon: "archive" },
    { title: "خرائط ذهنية وملخصات", description: "حمل ملخصات بصرية للفصول وبطاقات القواعد باللغتين.", icon: "file-text" },
    { title: "تحليلات تقدم درجاتك", description: "تابع نتائج اختباراتك وإحصائيات إتمام الدروس مباشرة من لوحة التحكم.", icon: "trending-up" },
  ];

  // 5. Educational Stages
  const stageItems = [
    { id: "cs_track", title: "مسار علوم الحاسب وتكنولوجيا المعلومات", description: "تعلم البرمجة، والذكاء الاصطناعي، والشبكات لجميع المراحل الدراسية.", btnText: "مسار علوم الحاسب", icon: "target" as const },
    { id: "baccalaureate", title: "نظام البكالوريا الجديد (عام وأزهري)", description: "الاستعداد الكامل لنظام البكالوريا الحديث في التعليم العام والأزهري.", btnText: "البكالوريا الجديد", icon: "trophy" as const },
    { id: "secondary3", title: "المرحلة الثانوية (الصف الثالث)", description: "الاستعداد للامتحانات وتحقيق أعلى الدرجات.", btnText: "الصف 3 ثانوي", icon: "cap" as const },
    { id: "prep", title: "المرحلة الإعدادية (الأول - الثالث)", description: "تعلم أعمق للمناهج العامة والأزهرية.", btnText: "الصف 1-3 إعدادي", icon: "book" as const },
    { id: "primary", title: "المرحلة الابتدائية (الصف الرابع - السادس)", description: "بناء أساس قوي في جميع المواد لطلاب العام والأزهر.", btnText: "الصف 4 - 6 ابتدائي", icon: "backpack" as const },
  ];

  // 6. Subjects
  const subjectItems = [
    { name: "علوم الحاسب والذكاء الاصطناعي", icon: "calculator", color: "text-accent" },
    { name: "البرمجة والتفكير الحاسوبي", icon: "activity", color: "text-secondary" },
    { name: "المناهج الأزهرية والشرعية", icon: "book-open", color: "text-[#1E73D8]" },
    { name: "نظام البكالوريا الجديد", icon: "pen-tool", color: "text-[#F58220]" },
    { name: "الرياضيات والفيزياء", icon: "calculator", color: "text-secondary" },
    { name: "الكيمياء والعلوم", icon: "flask", color: "text-warning" },
  ];

  // 7. How it Works
  const howItWorksSteps = [
    { step: "01", title: "أنشئ حسابك", description: "قم بالتسجيل وحدد المرحلة الدراسية وتفضيلاتك." },
    { step: "02", title: "اختر مسارك", description: "اختر المواد أو تصفح الكورسات الخاصة بك." },
    { step: "03", title: "ابدأ التعلم", description: "شاهد الفيديوهات، خض الاختبارات، وتابع تقدمك الدراسي." },
  ];

  // 8. Courses (hardcoded Arabic data from mock)
  const arabicCourses = [
    { title: "كيمياء الصف الثاني الثانوي", teacherName: "أ. أحمد كامل", stage: "الصف 2 ثانوي" },
    { title: "اللغة الإنجليزية للثانوية", teacherName: "أ. سارة أحمد", stage: "الصف 3 ثانوي" },
    { title: "رياضيات الصف الثالث الإعدادي", teacherName: "أ. محمد السيد", stage: "الصف 3 إعدادي" },
    { title: "الفيزياء للثانوية العامة", teacherName: "أ. أحمد كامل", stage: "الصف 3 ثانوي" },
  ];

  const translatedCourses = mockCourses.map((course, i) => ({
    ...course,
    title: arabicCourses[i % arabicCourses.length].title,
    teacherName: arabicCourses[i % arabicCourses.length].teacherName,
    stage: arabicCourses[i % arabicCourses.length].stage,
  }));

  // 9. Teachers
  const arabicTeachers = [
    { name: "أ. أحمد كامل", specialization: "مدرس كيمياء", experience: "8 سنة" },
    { name: "أ. سارة أحمد", specialization: "مدرسة لغة إنجليزية", experience: "6 سنة" },
    { name: "أ. محمد السيد", specialization: "مدرس رياضيات", experience: "10 سنة" },
  ];

  const translatedTeachers = mockTeachers.map((teacher, i) => ({
    ...teacher,
    name: arabicTeachers[i % arabicTeachers.length].name,
    specialization: arabicTeachers[i % arabicTeachers.length].specialization,
    experience: arabicTeachers[i % arabicTeachers.length].experience,
  }));

  // 10. Testimonials
  const arabicTestimonials = [
    { name: "يوسف إبراهيم", course: "رياضيات ثانوية عامة", review: "الاختبارات التفاعلية ومساعد الذكاء الاصطناعي ساعداني في استيعاب دروس التفاضل والتكامل بشكل أسرع بكثير. منصة رائعة!" },
    { name: "مريم محمود", course: "كيمياء الصف الثاني الثانوي", review: "شروحات المعلم تجعل حتى معادلات الكيمياء العضوية المعقدة تبدو سهلة للغاية. واجهة لوحة التحكم ممتازة وبسيطة." },
    { name: "كريم طارق", course: "اللغة الإنجليزية للإعدادية", review: "مراحل التعلم المنظمة سهلت علي متابعة تقدمي وتطوير حصيلتي اللغوية. بلا شك أفضل تطبيق تعليمي ذكي." },
  ];

  const translatedTestimonials = mockTestimonials.map((item, i) => ({
    ...item,
    name: arabicTestimonials[i % arabicTestimonials.length].name,
    course: arabicTestimonials[i % arabicTestimonials.length].course,
    review: arabicTestimonials[i % arabicTestimonials.length].review,
  }));

  // 11. FAQs
  const arabicFAQs = [
    { question: "هل هناك خطة تجريبية مجانية؟", answer: "نعم! تمنحك الخطة المجانية إمكانية تصفح كورسات تمهيدية محددة، واختبارات مبسطة، والمشاركة في مجتمعات الطلاب العامة دون الحاجة لبطاقة ائتمان." },
    { question: "كيف يساعدني مساعد الذكاء الاصطناعي في الدراسة؟", answer: "المساعد الدراسي متاح 24/7 لشرح المسائل المعقدة خطوة بخطوة، تلخيص الفصول الدراسية الطويلة، وإنشاء اختبارات تجريبية مخصصة لاحتياجاتك." },
    { question: "هل يمكنني إلغاء اشتراكي في أي وقت؟", answer: "بالتأكيد. يمكنك ترقية أو تغيير أو إلغاء اشتراكك مباشرة من صفحة الفواتير في حسابك في أي وقت وبكل سهولة." },
    { question: "هل تتطابق الكورسات مع المناهج المدرسية الرسمية؟", answer: "نعم، تم تصميم محتوى الكورسات بعناية بواسطة معلمين متخصصين ليتطابق مع المعايير والمناهج الرسمية للمراحل الابتدائية والإعدادية والثانوية." },
  ];

  const translatedFAQs = mockFAQs.map((faq, i) => ({
    ...faq,
    question: arabicFAQs[i % arabicFAQs.length].question,
    answer: arabicFAQs[i % arabicFAQs.length].answer,
  }));

  // 12. Pricing Plans
  const pricingPlans = [
    {
      name: "الخطة المجانية",
      priceMonthly: 0,
      priceYearly: 0,
      description: "استكشف المنصة وجرب أساسيات التعلم.",
      features: [
        "الوصول لـ 5 كورسات تمهيدية محددة",
        "3 أسئلة يومياً للمساعد الذكي",
        "المشاركة في مجتمعات الطلاب العامة",
        "بطاقات مراجعة سريعة للمصطلحات",
      ],
      buttonText: "ابدأ مجاناً الآن",
      isPopular: false,
    },
    {
      name: "الخطة الأساسية",
      priceMonthly: 19,
      priceYearly: 15,
      description: "ممتازة لمراجعة المناهج الدراسية الشاملة.",
      features: [
        "فتح جميع الفيديوهات المسجلة لمرحلة واحدة",
        "50 سؤالاً يومياً للمساعد الذكي",
        "تحميل ملخصات وخرائط ذهنية",
        "اختبارات ممارسة وتقييم أسبوعية",
      ],
      buttonText: "اشترك في الخطة الأساسية",
      isPopular: false,
    },
    {
      name: "الخطة الممتازة",
      priceMonthly: 39,
      priceYearly: 31,
      description: "تجربة الفصول الدراسية الذكية بالكامل.",
      features: [
        "الوصول لجميع المراحل (4 ابتدائى - 3 ثانوي)",
        "أسئلة غير محدودة للمساعد الذكي",
        "فصول تفاعلية مباشرة ومجموعات نقاش مغلقة",
        "تواصل مباشر مع نخبة من المعلمين المتميزين",
      ],
      buttonText: "اشترك الآن",
      isPopular: true,
    },
    {
      name: "خطة المدارس والمجموعات",
      priceMonthly: 99,
      priceYearly: 79,
      description: "لوحات تحكم مخصصة للمدارس والمدرسين الخصوصيين.",
      features: [
        "لوحات تحكم للإداريين والمدراء والمعلمين",
        "بث حصص دراسية مغلقة ومخصصة للمجموعة",
        "ربط مباشر بنظام درجات ومعدلات الطلاب",
        "مدير حساب تعليمي مخصص للدعم والمتابعة",
      ],
      buttonText: "تواصل مع المبيعات",
      isPopular: false,
    },
  ];

  const billingOptions = {
    monthly: "شهرياً",
    yearly: "سنوياً (وفر 20%)",
  };

  // ─── JSON-LD Schema ────────────────────────────────────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EduSphere",
    url: "http://localhost:3000",
    description: "منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي.",
    inLanguage: "ar",
    sameAs: ["https://facebook.com/edusphere", "https://twitter.com/edusphere"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* 1. Hero Section */}
        <HeroSection
          title1="شكل مستقبلك"
          title2="مع"
          title2Highlight="التعلم الذكي"
          subtitle="منصة تعليمية متكاملة من الصف الرابع الابتدائي إلى الصف الثالث الثانوي، بمحتوى تفاعلي، معلمين متخصصين، وذكاء اصطناعي لمساعدتك على التفوق."
          primaryCTA="ابدأ التعلم الآن"
          secondaryCTA="استكشف الكورسات"
          card1={{ title: "معدل النجاح والتميز", value: "85%", sub: "هذا الأسبوع" }}
          card2={{ title: "المحتوى المتاح", value: "+1,200" }}
          card3={{ title: "الذكاء الاصطناعي", sub: "مساعدك الدراسي" }}
        />

        {/* 2. Feature Bar */}
        <HeroFeatureBar items={featureBarItems} />

        {/* 3. Statistics Section */}
        <HeroStats stats={heroStats} />

        {/* 4. Partners logos list */}
        <PartnersSection title="شركاؤنا من المؤسسات التعليمية الرائدة" />

        {/* 5. Why Section */}
        <WhySection
          title="لماذا EduSphere؟"
          subtitle="نوفر تجربة تعليمية متكاملة باستخدام أحدث التقنيات"
          items={whyItems}
        />

        {/* 6. Features Highlight */}
        <FeaturesSection
          title="مميزات المنصة الفائقة"
          subtitle="اكتشف الأدوات التعليمية المصممة خصيصاً لتسريع استيعابك وتفوقك."
          items={featureItems}
        />

        {/* 7. Educational Stages */}
        <StagesSection
          title="المراحل الدراسية"
          subtitle="من الصف الرابع الابتدائي إلى الصف الثالث الثانوي"
          items={stageItems}
        />

        {/* 8. Subjects Grid */}
        <SubjectsSection
          title="المواد الدراسية المغطاة"
          subtitle="نقدم دروساً خصوصية ومواد مراجعة شاملة في هذه المواد الأساسية"
          items={subjectItems}
        />

        {/* 9. How it Works */}
        <HowItWorks
          title="كيف تعمل المنصة؟"
          subtitle="تفوق في دراستك بثلاث خطوات بسيطة"
          steps={howItWorksSteps}
        />

        {/* 10. Popular Courses */}
        <CoursesSection
          title="كورسات مميزة"
          subtitle="اختر من أفضل الكورسات في جميع المواد"
          courses={translatedCourses}
          viewAllText="عرض جميع الكورسات"
          studentsLabel="طالب"
        />

        {/* 11. Featured Teachers */}
        <TeachersSection
          title="المعلمون المتميزون"
          subtitle="ادرس مع نخبة من أفضل المدرسين المؤهلين لمساعدتك على التفوق"
          teachers={translatedTeachers}
        />

        {/* 12. AI Assistant */}
        <AISection
          badgeText="مساعد التعلم الذكي"
          title="مساعدك الذكي في التعلم"
          subtitle="اسأل أي سؤال واحصل على شرح فوري ومحتوى مخصص لك."
          btnText="جرب المساعد الذكي"
          q1="شرح درس الفيزياء الثالث"
          q2="حل سؤال في الرياضيات"
          q3="تلخيص درس الأحياء"
          q4="إنشاء اختبار سريع"
        />

        {/* 13. Experience Section */}
        <ExperienceSection
          title="تجربة تعليمية متكاملة وعصرية"
          subtitle="صممت بعناية لمساعدة طلاب المرحلة الثانوية على تحقيق أعلى الدرجات والتفوق."
          bullets={[
            "بيئة تعلم خالية من الإعلانات ومصممة للتركيز.",
            "محتوى بجودة عالية وبث سلس بدون توقف.",
            "لوحة تحكم لمتابعة المعالم الدراسية بصرياً.",
            "مشاركة تقارير التقدم مع أولياء الأمور.",
          ]}
        />

        {/* 14. Success Stories */}
        <SuccessStories
          title="تحسين درجات الطلاب"
          subtitle="يسجل طلاب EduSphere ارتفاعاً ملحوظاً في درجاتهم مقارنةً بالمدارس التقليدية."
        />

        {/* 15. Student Testimonials */}
        <TestimonialsSection
          title="ماذا يقول طلابنا؟"
          subtitle="آراء حقيقية من الطلاب وأولياء الأمور المستفيدين من EduSphere يومياً."
          testimonials={translatedTestimonials}
        />

        {/* 16. Subscription Pricing */}
        <PricingSection
          title="خطط اشتراك بسيطة وشفافة"
          subtitle="اختر الخطة المناسبة لك. وفر حتى 20% عند الدفع السنوي."
          plans={pricingPlans}
          billingOptions={billingOptions}
        />

        {/* 17. FAQ */}
        <FAQSection
          title="الأسئلة الشائعة والتحقق"
          subtitle="لديك استفسارات؟ لدينا الإجابات الجاهزة لتوجيهك."
          faqs={translatedFAQs}
        />

        {/* 18. Contact Us & Admin Support Section */}
        <ContactSection />

        {/* 18. CTA Banner */}
        <CTASection
          title="جاهز لتحقيق حلمك؟"
          subtitle="انضم إلى آلاف الطلاب وابدأ رحلتك نحو التفوق الآن."
          primaryButton="ابدأ التعلم الآن"
          secondaryButton="تصفح الكورسات"
        />

        {/* 19. Newsletter */}
        <NewsletterSection
          title="اشترك في نشرتنا البريدية"
          subtitle="احصل على آخر الأخبار، الكورسات، والعروض الحصرية مباشرة في صندوق بريدك."
          placeholder="أدخل بريدك الإلكتروني"
          buttonText="اشترك الآن"
          successMsg="تم الاشتراك بنجاح!"
        />
      </div>
    </>
  );
}
