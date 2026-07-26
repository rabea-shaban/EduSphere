"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Headphones,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import {
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionDescription,
} from "@/components/layout/section-layout";
import { Button } from "@/components/ui/button";

const ticketCategories = [
  { id: "technical", label: "🛠️ شكوى فنية / حساب", desc: "مشاكل دخول، فيديوهات، منصة" },
  { id: "admin", label: "📋 استفسار إداري", desc: "اشتراكات، فواتير، ترقية" },
  { id: "academic", label: "🎓 استفسار أكاديمي", desc: "مناهج، كورسات، أسئلة" },
  { id: "general", label: "💬 ملاحظات واقتراحات", desc: "أفكار وتحسينات عامة" },
];

import { toast } from "react-hot-toast";

export function ContactSection() {
  const [category, setCategory] = React.useState("technical");
  const [fullName, setFullName] = React.useState("");
  const [contactInfo, setContactInfo] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !contactInfo || !message) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("تم إرسال بلاغك للإدارة بنجاح! سيتم التواصل معك في أقرب وقت. 🚀");

    setTimeout(() => {
      setFullName("");
      setContactInfo("");
      setMessage("");
      setIsSuccess(false);
    }, 4000);
  };

  return (
    <SectionWrapper id="contact" className="bg-slate-50/70 dark:bg-slate-950/80 transition-colors duration-300">
      <SectionContainer className="space-y-12">
        {/* Section Header */}
        <SectionHeader>
          <div className="inline-flex items-center gap-2 bg-[#1E73D8]/10 text-[#1E73D8] dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold mb-2">
            <Headphones className="h-4 w-4" />
            <span>الدعم والمساندة الفنية 24/7</span>
          </div>
          <SectionTitle>تواصل مع الإدارة والدعم الفني</SectionTitle>
          <SectionDescription>
            لديك استفسار إداري، شكوى فنية، أو اقتراح؟ فريق الدعم متاح لمساعدتك فوراً
          </SectionDescription>
        </SectionHeader>

        {/* 2-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE (in RTL = Visual Left): Admin Contact Cards & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] p-6 sm:p-8 text-white shadow-xl shadow-[#0B2D5B]/20 relative overflow-hidden select-none">
              {/* Background Ambient Blur */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#F58220]/20 rounded-full filter blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Headphones className="h-5 w-5 text-[#F58220]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold">إدارة الدعم والمتابعة</h3>
                      <p className="text-xs text-blue-200">رد فوري على جميع البلاغات</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> متصل الآن
                  </span>
                </div>

                {/* Phone Numbers */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-blue-200">أرقام الدعم والإدارة المباشرة:</div>
                  <div className="space-y-2">
                    <a
                      href="tel:+201001234567"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs font-bold dir-ltr"
                    >
                      <span className="text-blue-100">+20 100 123 4567</span>
                      <span className="text-[11px] text-blue-300 font-semibold dir-rtl">خط الإدارة الرئيسي</span>
                    </a>
                    <a
                      href="tel:+201109876543"
                      className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs font-bold dir-ltr"
                    >
                      <span className="text-blue-100">+20 110 987 6543</span>
                      <span className="text-[11px] text-blue-300 font-semibold dir-rtl">الدعم الفني والاشتراكات</span>
                    </a>
                  </div>
                </div>

                {/* Emails */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-bold text-blue-200">البريد الإلكتروني للشكاوى والاستفسارات:</div>
                  <div className="space-y-2">
                    <a
                      href="mailto:support@edusphere.edu.eg"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs font-bold"
                    >
                      <Mail className="h-4 w-4 text-[#F58220] shrink-0" />
                      <span>support@edusphere.edu.eg</span>
                    </a>
                    <a
                      href="mailto:admin@edusphere.edu.eg"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-xs font-bold"
                    >
                      <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>admin@edusphere.edu.eg</span>
                    </a>
                  </div>
                </div>

                {/* WhatsApp Direct */}
                <a
                  href="https://wa.me/201001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>تواصل فوري عبر الواتساب (WhatsApp)</span>
                </a>
              </div>
            </div>

            {/* Response Time & Working Hours Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Clock className="h-4.5 w-4.5 text-[#1E73D8]" />
                <span>مواعيد عمل الدعم الفني:</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                يومياً من الساعة <span className="font-bold text-[#0B2D5B] dark:text-white">9:00 صباحاً</span> حتى{" "}
                <span className="font-bold text-[#0B2D5B] dark:text-white">11:00 مساءً</span> (بتوقيت القاهرة).
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">متوسط زمن الرد:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  خلال 15 دقيقة ⚡
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (in RTL = Visual Right): Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg shadow-slate-200/50 dark:shadow-none text-right">
              <h3 className="text-xl font-bold text-[#0B2D5B] dark:text-white mb-2">
                إرسال بلاغ أو استفسار جديد 📝
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                يرجى اختيار نوع الطلب وتعبئة البيانات ليصل مباشرةً للمسؤول المختص.
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>تم إرسال رسالتك إلى الإدارة بنجاح! سيتم التواصل معك في أقرب وقت.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    نوع الاستفسار أو الشكوى:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ticketCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          category === cat.id
                            ? "border-[#1E73D8] bg-[#1E73D8]/10 text-[#0B2D5B] dark:text-white font-bold ring-2 ring-[#1E73D8]/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <div className="text-xs font-bold mb-0.5">{cat.label}</div>
                        <div className="text-[10px] text-slate-400">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name & Phone/Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      الاسم بالكامل:
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full h-11 px-4 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1E73D8] focus:ring-2 focus:ring-[#1E73D8]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      البريد الإلكتروني أو رقم الهاتف:
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="01012345678 أو email@example.com"
                      className="w-full h-11 px-4 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1E73D8] focus:ring-2 focus:ring-[#1E73D8]/20"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    تفاصيل الشكوى أو الرسالة:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب هنا تفاصيل طلبك أو المشكلة الفنية التي تواجهك..."
                    className="w-full p-4 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1E73D8] focus:ring-2 focus:ring-[#1E73D8]/20 leading-relaxed resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e0711a] hover:to-[#f58b19] text-white font-bold text-sm shadow-lg shadow-[#F58220]/25 transition-all hover:scale-[1.01] active:scale-[0.99] gap-2"
                >
                  {isSubmitting ? (
                    <span>جاري إرسال الرسالة...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>إرسال الرسالة للإدارة</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </SectionContainer>
    </SectionWrapper>
  );
}

export default ContactSection;
