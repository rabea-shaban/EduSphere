"use client";

import * as React from "react";
import { Settings, Globe, CreditCard, Sparkles, Key, Mail } from "lucide-react";

export default function AdminPlatformSettingsPage() {
  const [siteName, setSiteName] = React.useState("EduSphere منصة التعليم الذكي المتكاملة");
  const [vodafoneNumber, setVodafoneNumber] = React.useState("01012345678");
  const [instapayAddress, setInstapayAddress] = React.useState("edusphere@instapay");
  const [aiApiKey, setAiApiKey] = React.useState("sk-edusphere-ai-production-key");

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إعدادات المنصة الشاملة ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إعدادات الشعار، مفاتيح الذكاء الاصطناعي، بوابات الدفع المصرية، وسيرفرات Cloudinary
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); alert("تم حفظ إعدادات المنصة بنجاح!"); }} className="space-y-6 max-w-2xl">
        {/* General Site Info */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#F58220]" />
            <span>معلومات المنصة العامة وSEO</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">اسم المنصة الرسمي</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>
        </div>

        {/* Payment Gateways Egypt */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-500" />
            <span>بوابات الدفع المصرية (Vodafone Cash & InstaPay)</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">رقم فودافون كاش للمستحقات</label>
              <input
                type="text"
                value={vodafoneNumber}
                onChange={(e) => setVodafoneNumber(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">عنوان InstaPay المعرف</label>
              <input
                type="text"
                value={instapayAddress}
                onChange={(e) => setInstapayAddress(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
          </div>
        </div>

        {/* AI & Cloud Keys */}
        <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-500" />
            <span>مفاتيح المساعد الذكي وسيرفرات الفيديوهات</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">مفتاح API الخاص بالذكاء الاصطناعي</label>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono outline-none focus:border-[#F58220]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-lg"
        >
          حفظ وتطبيق إعدادات المنصة
        </button>
      </form>
    </div>
  );
}
