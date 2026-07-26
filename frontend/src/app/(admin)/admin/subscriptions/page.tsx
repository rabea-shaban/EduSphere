"use client";

import * as React from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إدارة خطط الاشتراكات 📦
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          باقات الاشتراكات الكلية (السنوية والشهرية) لمسارات علوم الحاسب والثانوية العامة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "الباقة الشهرية العادية", price: "350 ج.م / شهر", features: ["دخول لجميع الكورسات", "اختبارات ومراجعات"] },
          { name: "الباقة السنوية الشاملة", price: "2,800 ج.م / سنة", features: ["جميع كورسات الثانوية وCS", "تواصل مباشر مع المحاضر", "شهادات معتمدة"] },
          { name: "باقة البكالوريا الدولية", price: "3,500 ج.م / سنة", features: ["شاملة أوراق البحث والتفكير الناقد", "مراجعة المشاريع بالذكاء الاصطناعي"] },
        ].map((plan, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 text-right">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">{plan.name}</h3>
            <div className="text-xl font-black text-[#F58220]">{plan.price}</div>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
