"use client";

import * as React from "react";
import { FileText, Plus } from "lucide-react";

import { toast } from "react-hot-toast";

export default function AdminBlogCMSPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إدارة المدونة والمقالات (CMS) 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            كتابة ونشر النصائح التعليمية، مقالات الثانوية العامة ونظام البكالوريا
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast("جاري كتابة مقال تعليمي جديد... 📝")}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>كتابة مقال جديد</span>
        </button>
      </div>

      <div className="space-y-3">
        {[
          { title: "دليلك الشامل للتفكير الخوارزمي والتفوق في علوم الحاسب", author: "د. طارق محمود", date: "20 يوليو 2026" },
          { title: "أسرار الحصول على الدرجة النهائية في الفيزياء والرياضيات", author: "أ. خالد عبدالكريم", date: "18 يوليو 2026" },
        ].map((post, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#F58220]" />
              <div>
                <div className="font-bold text-[#0B2D5B] dark:text-white">{post.title}</div>
                <div className="text-slate-400">الكاتب: {post.author} • {post.date}</div>
              </div>
            </div>
            <span className="font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">منشور 🟢</span>
          </div>
        ))}
      </div>
    </div>
  );
}
