"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/common";

const testimonials = [
  {
    quote: "المنصة غيرت مفهومي عن الدراسة للثانوية العامة. المساعد الذكي يشرح المسائل الصعبة في ثوانٍ!",
    author: "أحمد حسام",
    role: "طالب بالصف الثالث الثانوي - 98.5%",
    badge: "الأول على المحافظة",
  },
  {
    quote: "أفضل استثمار في تعليم أولادي. الشروحات تفاعلية والتقرير الأسبوعي يتيح لي متابعة مستواهم باستمرار.",
    author: "م. طارق العوضي",
    role: "ولي أمر طالبين في EduSphere",
    badge: "ولي أمر متميز",
  },
  {
    quote: "المحتوى منظّم والمدرسين قمة في الاحترافية. خريطة المذاكرة التفاعلية وفرت عليّ مئات الساعات.",
    author: "نورهان محمد",
    role: "طالبة بالصف الثاني الثانوي",
    badge: "درجة كاملة في الفيزياء",
  },
];

export function IllustrationSide() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#002266] via-[#0052CC] to-[#071C3B] text-white select-none">
      {/* Dynamic Glowing Orange & Globe Blue Ambient Blobs (Matching EduSphere Logo) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.65, 0.4],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[#FF5500]/30 filter blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.55, 0.3],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -left-20 w-[550px] h-[550px] rounded-full bg-[#0066FF]/35 filter blur-[110px] pointer-events-none"
      />

      {/* Center Logo Orange Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FF5500]/20 rounded-full filter blur-[90px] pointer-events-none" />
      
      {/* Decorative Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" 
      />

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo className="text-white brightness-200" showText={true} />
        <div className="flex items-center gap-2 bg-[#FF5500]/15 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-[#FF5500]/35 text-amber-200 shadow-lg shadow-[#FF5500]/10">
          <Sparkles className="h-4 w-4 text-[#FF5500] animate-pulse" />
          <span>الجيل الجديد للتعليم الذكي</span>
        </div>
      </div>

      {/* Central Visual Composition - Education & AI Illustration Mockup */}
      <div className="relative z-10 my-auto py-8">
        <div className="relative max-w-md mx-auto">
          {/* Main Hero Card Glass Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 p-6 shadow-2xl shadow-black/50 relative overflow-hidden"
          >
            {/* Ambient inner orange glow */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#FF5500]/30 rounded-full filter blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FF8800] flex items-center justify-center shadow-lg shadow-[#FF5500]/40 shrink-0">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-snug">رحلتك نحو التميز الأكاديمي</h3>
                <p className="text-xs text-blue-200/90 font-medium">مناهج تفاعلية ومعلمون متميزون 24/7</p>
              </div>
            </div>

            {/* Interactive Stats Mini Preview inside Illustration */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-blue-200">نسبة الاستيعاب</span>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-white">96.8%</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full w-[96.8%] rounded-full" />
                </div>
              </div>

              <div className="rounded-xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-blue-200">مساعد AI النشط</span>
                  <Sparkles className="h-3.5 w-3.5 text-[#FF5500]" />
                </div>
                <div className="text-xl font-extrabold text-white">+50,000</div>
                <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle className="h-3 w-3" /> إجابة فورية
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 1 - Books / Stage Badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-[#002266]/95 backdrop-blur-xl border border-[#FF5500]/35 px-4 py-2.5 rounded-2xl shadow-xl shadow-black/40 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">مكتبة رقمية</div>
              <div className="text-[10px] text-amber-200/90">+1,200 كورس ودرس</div>
            </div>
          </motion.div>

          {/* Floating Element 2 - AI Badge */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 bg-gradient-to-r from-[#FF5500] to-[#FF8800] text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-[#FF5500]/30 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold">ذكاء اصطناعي مخصص</div>
              <div className="text-[10px] text-white/90">شرح فوري وتوليد اختيارات</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Animated Testimonials Carousel */}
      <div className="relative z-10 max-w-lg">
        <motion.div
          key={currentTestimonial}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 relative shadow-lg"
        >
          <p className="text-sm font-medium leading-relaxed text-blue-50 mb-3">
            "{testimonials[currentTestimonial].quote}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">
                {testimonials[currentTestimonial].author}
              </div>
              <div className="text-xs text-blue-200/80">
                {testimonials[currentTestimonial].role}
              </div>
            </div>
            <span className="text-[11px] font-extrabold bg-[#FF5500]/25 border border-[#FF5500]/50 text-[#FF8800] px-3 py-1 rounded-full shadow-sm">
              {testimonials[currentTestimonial].badge}
            </span>
          </div>
        </motion.div>

        {/* Carousel indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTestimonial(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentTestimonial
                  ? "w-6 bg-[#FF5500] shadow-sm shadow-[#FF5500]"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`انتقل إلى الرأي رقم ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default IllustrationSide;
