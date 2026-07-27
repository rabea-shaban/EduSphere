"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, Clock, ArrowRight, ShieldCheck, Mail, FileText, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import teacherService, { ApiTeacherApplication } from "@/services/teacher.service";

export default function TeacherCheckStatusPage() {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ApiTeacherApplication | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("يرجى أدخال البريد الإلكتروني أو الرقم القومي للاستعلام");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      setResult(null);
      const app = await teacherService.checkStatusByQuery(query.trim());
      setResult(app);
      toast.success("تم العثور على حالة الطلب بنجاح 🔍");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "لم يتم العثور على أي طلب انضمام بهذا البريد الإلكتروني أو الرقم القومي.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-right" dir="rtl">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center mx-auto shadow-md">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
              الاستعلام عن حالة طلب الانضمام كمعلم 🔍
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              أدخل البريد الإلكتروني أو الرقم القومي للاستعلام المباشر عن حالة مراجعة واعتماد طلبك
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">البريد الإلكتروني / الرقم القومي *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني أو الرقم القومي..."
                  className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
                <Mail className="absolute right-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-black shadow-lg shadow-[#F58220]/25 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري الاستعلام...</span>
                </>
              ) : (
                <>
                  <span>استعلام عن حالة الطلب</span>
                  <Search className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Results Box */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl border space-y-4 text-right transition-all bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-3">
                <span className="text-xs font-black text-[#0B2D5B] dark:text-white">
                  {result.fullName}
                </span>
                <span
                  className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                    result.status === "Approved"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : result.status === "Rejected"
                      ? "bg-red-500/10 text-red-500 border-red-500/30"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  }`}
                >
                  {result.status === "Approved"
                    ? "تم قبول الطلب واكتمال الاعتماد 🟢"
                    : result.status === "Rejected"
                    ? "لم يتم القبول 🔴"
                    : "قيد المراجعة الأكاديمية ⏳"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div>المادة التخصصية: <strong className="text-[#F58220]">{result.subject}</strong> ({result.stage})</div>
                <div>تاريخ التقديم: <strong className="text-slate-800 dark:text-slate-100">{new Date(result.createdAt).toLocaleDateString("ar-EG")}</strong></div>
              </div>

              {result.status === "Approved" && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-bold space-y-2">
                  <div>🎉 تهانينا! تم قبول طلب انضمامك كمعلم في منصة EduSphere وتفعيل حسابه بالكامل.</div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[#0B2D5B] dark:text-white underline font-black"
                  >
                    سجل الدخول الآن للوصول إلى لوحة تحكم المعلم 🚀
                  </Link>
                </div>
              )}

              {result.status === "Pending" && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                  ⏳ طلبك قيد المراجعة حالياً من قبل اللجنة التعليمية. سيتم التواصل معك عبر الواتساب أو البريد الإلكتروني خلال 2-5 أيام عمل.
                </div>
              )}

              {result.status === "Rejected" && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-300 space-y-1 font-semibold">
                  <div>نعتذر، لم يتم قبول الطلب في الوقت الحالي.</div>
                  {result.rejectionReason && <div>السبب: <strong>{result.rejectionReason}</strong></div>}
                </div>
              )}
            </motion.div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-600 font-bold text-center space-y-2">
              <div>{errorMsg}</div>
              <Link href="/teacher/apply" className="inline-block text-[#F58220] underline font-black">
                اضغط هنا لتقديم طلب انضمام جديد 📝
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-[#0B2D5B] flex items-center justify-center gap-1">
              <span>العودة للصفحة الرئيسية</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
