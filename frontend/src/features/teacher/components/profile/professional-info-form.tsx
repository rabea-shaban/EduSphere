"use client";

import * as React from "react";
import { Save, Loader2, Award, Briefcase, GraduationCap } from "lucide-react";
import { useUpdateTeacherProfile } from "@/hooks/useTeacherProfile";
import type { ProfessionalInfo } from "@/features/teacher/types/profile";

interface ProfessionalInfoFormProps {
  professionalInfo: ProfessionalInfo;
}

export function ProfessionalInfoForm({ professionalInfo }: ProfessionalInfoFormProps) {
  const updateProfile = useUpdateTeacherProfile();

  const [formData, setFormData] = React.useState({
    specialization: professionalInfo?.specialization || "معلم عام",
    yearsOfExperience: professionalInfo?.yearsOfExperience || 1,
    skills: (professionalInfo?.skills || []).join(", "),
    certifications: (professionalInfo?.certifications || []).join("\n"),
    education: (professionalInfo?.education || []).join("\n"),
    portfolio: professionalInfo?.portfolio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      professionalInfo: {
        specialization: formData.specialization,
        yearsOfExperience: Number(formData.yearsOfExperience),
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        certifications: formData.certifications.split("\n").map((s) => s.trim()).filter(Boolean),
        education: formData.education.split("\n").map((s) => s.trim()).filter(Boolean),
        portfolio: formData.portfolio,
      },
    };
    await updateProfile.mutateAsync(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-5 shadow-sm">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#F58220]" />
          الخبرة والمؤهلات الأكاديمية 🎓
        </h3>
        <p className="text-xs text-slate-400">إدارة التخصص، سنوات الخبرة، المهارات والشهادات التعليمية</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">التخصص التعليمي *</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            placeholder="مثال: فيزياء وكيمياء"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">سنوات الخبرة التدريسية</label>
          <input
            type="number"
            name="yearsOfExperience"
            min={0}
            max={50}
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-bold text-slate-700 dark:text-slate-200">المهارات والقدرات (تفصل بينها بفصلة)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="شرح مبسط، تبسيط الفيزياء، استراتيجيات التعلم السريع"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">الشهادات المعتمدة (سطر لكل شهادة)</label>
          <textarea
            name="certifications"
            rows={3}
            value={formData.certifications}
            onChange={handleChange}
            placeholder="شهادة البكالوريوس التربوي&#10;دبلومة استراتيجيات التدريس الحديثة"
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">المؤهلات الدراسية (سطر لكل مؤهل)</label>
          <textarea
            name="education"
            rows={3}
            value={formData.education}
            onChange={handleChange}
            placeholder="بكالوريوس علوم - جامعة القاهرة&#10;ماجستير المناهج وطرق التدريس"
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold resize-none"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white text-xs font-black flex items-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>حفظ الخبرات والشهادات</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProfessionalInfoForm;
