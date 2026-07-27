"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  Layout,
  HelpCircle,
  MessageSquareQuote,
  PhoneCall,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Share2,
  FileText,
  AlertCircle,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminCmsService, { CmsContentData } from "@/services/adminCms.service";
import { Button } from "@/components/ui/button";

export default function AdminCmsPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<"hero" | "faqs" | "testimonials" | "contact" | "legal">("hero");

  // Fetch CMS data
  const { data: cms, isLoading, isError, refetch } = useQuery<CmsContentData>({
    queryKey: ["admin", "cms-content"],
    queryFn: () => adminCmsService.getCmsContent(),
  });

  // Local Form States
  const [heroTitle, setHeroTitle] = React.useState("");
  const [heroSubtitle, setHeroSubtitle] = React.useState("");
  const [heroDesc, setHeroDesc] = React.useState("");
  const [heroCta, setHeroCta] = React.useState("");

  const [contactPhone, setContactPhone] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactWhatsapp, setContactWhatsapp] = React.useState("");
  const [contactAddress, setContactAddress] = React.useState("");

  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDesc, setSeoDesc] = React.useState("");

  const [privacyPolicy, setPrivacyPolicy] = React.useState("");
  const [terms, setTerms] = React.useState("");

  // FAQ Modal
  const [faqModalOpen, setFaqModalOpen] = React.useState(false);
  const [faqQuestion, setFaqQuestion] = React.useState("");
  const [faqAnswer, setFaqAnswer] = React.useState("");

  // Testimonial Modal
  const [testModalOpen, setTestModalOpen] = React.useState(false);
  const [testName, setTestName] = React.useState("");
  const [testRole, setTestRole] = React.useState("");
  const [testReview, setTestReview] = React.useState("");
  const [testRating, setTestRating] = React.useState(5);

  // Sync state when CMS is fetched
  React.useEffect(() => {
    if (cms) {
      setHeroTitle(cms.hero?.title || "");
      setHeroSubtitle(cms.hero?.subtitle || "");
      setHeroDesc(cms.hero?.description || "");
      setHeroCta(cms.hero?.ctaText || "");

      setContactPhone(cms.contact?.phone || "");
      setContactEmail(cms.contact?.email || "");
      setContactWhatsapp(cms.contact?.whatsapp || "");
      setContactAddress(cms.contact?.address || "");

      setSeoTitle(cms.seo?.metaTitle || "");
      setSeoDesc(cms.seo?.metaDescription || "");

      setPrivacyPolicy(cms.legal?.privacyPolicy || "");
      setTerms(cms.legal?.termsAndConditions || "");
    }
  }, [cms]);

  // Section Save Mutation
  const updateSectionMutation = useMutation({
    mutationFn: ({ section, data }: { section: string; data: any }) =>
      adminCmsService.updateCmsSection(section, data),
    onSuccess: (_, vars) => {
      toast.success(`تم حفظ تحديثات قسم (${vars.section}) بنجاح`);
      queryClient.invalidateQueries({ queryKey: ["admin", "cms-content"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء عملية الحفظ.");
    },
  });

  // FAQ Mutations
  const addFaqMutation = useMutation({
    mutationFn: (data: any) => adminCmsService.addFaq(data),
    onSuccess: () => {
      toast.success("تم إضافة السؤال الشائع بنجاح");
      setFaqModalOpen(false);
      setFaqQuestion("");
      setFaqAnswer("");
      refetch();
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: (id: string) => adminCmsService.deleteFaq(id),
    onSuccess: () => {
      toast.success("تم حذف السؤال بنجاح");
      refetch();
    },
  });

  // Testimonial Mutations
  const addTestMutation = useMutation({
    mutationFn: (data: any) => adminCmsService.addTestimonial(data),
    onSuccess: () => {
      toast.success("تم إضافة التقييم بنجاح");
      setTestModalOpen(false);
      setTestName("");
      setTestReview("");
      refetch();
    },
  });

  const deleteTestMutation = useMutation({
    mutationFn: (id: string) => adminCmsService.deleteTestimonial(id),
    onSuccess: () => {
      toast.success("تم حذف التوصية بنجاح");
      refetch();
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <Layout className="h-4 w-4" />
            <span>نظام إدارة محتوى الموقع العام (CMS)</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            محتوى الصفحة الرئيسية والواجهة العامة
          </h1>
          <p className="text-xs text-slate-500">
            تحديث بنود الواجهة، الأسئلة الشائعة، التقييمات، بيانات التواصل والـ SEO دون تعديل كود البرمجة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث البيانات"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "hero"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الرئيسية واجهة Hero
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "faqs"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الأسئلة الشائعة ({cms?.faqs?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "testimonials"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          توصيات وتقييمات الطلاب ({cms?.testimonials?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "contact"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          التواصل والسوشيال ميديا
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("legal")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "legal"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          الصفحات القانونية والـ SEO
        </button>
      </div>

      {/* TAB 1: HERO & LANDING */}
      {activeTab === "hero" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Sparkles className="h-5 w-5 text-[#F58220]" />
            <span>تحديث واجهة Hero بالصفحة الرئيسية</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">العنوان الرئيسي (Hero Title) *</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">العنوان الفرعي (Subtitle)</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">نص الوصف والتعريف بالمؤسسة</label>
              <textarea
                rows={3}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">نص زر الدعوة لاتخاذ إجراء (CTA Button)</label>
              <input
                type="text"
                value={heroCta}
                onChange={(e) => setHeroCta(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() =>
                updateSectionMutation.mutate({
                  section: "hero",
                  data: {
                    title: heroTitle,
                    subtitle: heroSubtitle,
                    description: heroDesc,
                    ctaText: heroCta,
                  },
                })
              }
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ تعديلات قسم Hero</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === "faqs" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              <span>قائمة الأسئلة الشائعة والإجابات (FAQ)</span>
            </h3>

            <Button
              onClick={() => setFaqModalOpen(true)}
              className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة سؤال شائع جديد</span>
            </Button>
          </div>

          <div className="space-y-3">
            {(cms?.faqs || []).map((f: any, idx: number) => (
              <div
                key={f._id || idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <h4 className="font-extrabold text-[#0B2D5B] dark:text-white text-sm">
                    س: {f.question}
                  </h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    ج: {f.answer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("هل أنت متاكد من حذف هذا السؤال؟")) {
                      deleteFaqMutation.mutate(f._id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shrink-0"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TESTIMONIALS */}
      {activeTab === "testimonials" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5 text-[#F58220]" />
              <span>آراء وتوصيات الطلاب والأولياء</span>
            </h3>

            <Button
              onClick={() => setTestModalOpen(true)}
              className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة تقييم جديد</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(cms?.testimonials || []).map((t: any, idx: number) => (
              <div
                key={t._id || idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3 flex flex-col justify-between text-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-[#0B2D5B] dark:text-white text-sm">
                        {t.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold">{t.role}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span className="font-bold text-xs">{t.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200/40 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("هل أنت متاكد من حذف هذا التقييم؟")) {
                        deleteTestMutation.mutate(t._id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT */}
      {activeTab === "contact" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <PhoneCall className="h-5 w-5 text-emerald-500" />
            <span>تعديل بيانات التواصل وقنوات الدعم</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">الهاتف الرسمي</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني للدعم</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] dir-ltr text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">رقم الواتساب (WhatsApp)</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">عنوان مقر المؤسسة</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() =>
                updateSectionMutation.mutate({
                  section: "contact",
                  data: {
                    phone: contactPhone,
                    email: contactEmail,
                    whatsapp: contactWhatsapp,
                    address: contactAddress,
                  },
                })
              }
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ بيانات التواصل</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 5: LEGAL & SEO */}
      {activeTab === "legal" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Globe className="h-5 w-5 text-purple-500" />
            <span>إعدادات محركات البحث (SEO) والسياسات القانونية</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">عنوان محركات البحث (Meta Title)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">وصف محركات البحث (Meta Description)</label>
              <textarea
                rows={2}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">سياسة الخصوصية (Privacy Policy)</label>
              <textarea
                rows={4}
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">الشروط والأحكام (Terms & Conditions)</label>
              <textarea
                rows={4}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                updateSectionMutation.mutate({
                  section: "seo",
                  data: { metaTitle: seoTitle, metaDescription: seoDesc },
                });
                updateSectionMutation.mutate({
                  section: "legal",
                  data: { privacyPolicy, termsAndConditions: terms },
                });
              }}
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ إعدادات SEO والسياسات</span>
            </Button>
          </div>
        </div>
      )}

      {/* ADD FAQ MODAL */}
      <AnimatePresence>
        {faqModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
                إضافة سؤال شائع جديد
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">السؤال *</label>
                  <input
                    type="text"
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    placeholder="أدخل نص السؤال..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الإجابة التفصيلية *</label>
                  <textarea
                    rows={3}
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="أدخل الإجابة الخاصة بالسؤال..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setFaqModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!faqQuestion.trim() || !faqAnswer.trim()) {
                      toast.error("يرجى كتابة السؤال والإجابة");
                      return;
                    }
                    addFaqMutation.mutate({
                      question: faqQuestion.trim(),
                      answer: faqAnswer.trim(),
                    });
                  }}
                  disabled={addFaqMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>إضافة السؤال</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD TESTIMONIAL MODAL */}
      <AnimatePresence>
        {testModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
                إضافة تقييم وتوصية جديدة
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">اسم صاحب التقييم *</label>
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="الاسم..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الصف الدراسي أو المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value)}
                    placeholder="مثال: طالب بالصف الثالث الثانوي..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">نص التوصية *</label>
                  <textarea
                    rows={3}
                    value={testReview}
                    onChange={(e) => setTestReview(e.target.value)}
                    placeholder="أدخل نص التوصية..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setTestModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!testName.trim() || !testReview.trim()) {
                      toast.error("يرجى كتابة الاسم والتقييم");
                      return;
                    }
                    addTestMutation.mutate({
                      name: testName.trim(),
                      role: testRole.trim(),
                      review: testReview.trim(),
                      rating: testRating,
                    });
                  }}
                  disabled={addTestMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>إضافة التقييم</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
