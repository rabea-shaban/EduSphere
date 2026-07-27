"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  Mail,
  Database,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  ToggleLeft,
  ToggleRight,
  Server,
  Key,
  Globe,
  Sliders,
  DollarSign,
  Cpu,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminSettingsService, { PlatformSettingsData } from "@/services/adminSettings.service";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<"general" | "payments" | "security" | "email" | "backup">("general");

  // Fetch Settings
  const { data: settings, isLoading, isError, refetch } = useQuery<PlatformSettingsData>({
    queryKey: ["admin", "platform-settings"],
    queryFn: () => adminSettingsService.getSettings(),
  });

  // Local Form States
  const [platformName, setPlatformName] = React.useState("");
  const [platformDesc, setPlatformDesc] = React.useState("");
  const [currency, setCurrency] = React.useState("EGP");

  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [registrationEnabled, setRegistrationEnabled] = React.useState(true);
  const [teacherAppsEnabled, setTeacherAppsEnabled] = React.useState(true);
  const [courseApprovalRequired, setCourseApprovalRequired] = React.useState(true);

  // Payments State
  const [instapay, setInstapay] = React.useState(true);
  const [vodafone, setVodafone] = React.useState(true);
  const [fawry, setFawry] = React.useState(true);
  const [bank, setBank] = React.useState(true);
  const [stripe, setStripe] = React.useState(true);

  // Security State
  const [minPassLen, setMinPassLen] = React.useState(8);
  const [requireUpper, setRequireUpper] = React.useState(true);
  const [sessionTimeout, setSessionTimeout] = React.useState(120);

  // Email State
  const [smtpHost, setSmtpHost] = React.useState("");
  const [smtpPort, setSmtpPort] = React.useState(587);
  const [smtpUser, setSmtpUser] = React.useState("");
  const [senderName, setSenderName] = React.useState("");
  const [senderEmail, setSenderEmail] = React.useState("");
  const [testEmailAddress, setTestEmailAddress] = React.useState("");

  // Sync Form State
  React.useEffect(() => {
    if (settings) {
      setPlatformName(settings.general?.platformName || "");
      setPlatformDesc(settings.general?.platformDescription || "");
      setCurrency(settings.general?.currency || "EGP");

      setMaintenanceMode(Boolean(settings.system?.maintenanceMode));
      setRegistrationEnabled(Boolean(settings.system?.registrationEnabled));
      setTeacherAppsEnabled(Boolean(settings.system?.teacherApplicationsEnabled));
      setCourseApprovalRequired(Boolean(settings.system?.courseApprovalRequired));

      setInstapay(Boolean(settings.payments?.instapayEnabled));
      setVodafone(Boolean(settings.payments?.vodafoneCashEnabled));
      setFawry(Boolean(settings.payments?.fawryEnabled));
      setBank(Boolean(settings.payments?.bankTransferEnabled));
      setStripe(Boolean(settings.payments?.stripeEnabled));

      setMinPassLen(settings.security?.minPasswordLength || 8);
      setRequireUpper(Boolean(settings.security?.requireUppercase));
      setSessionTimeout(settings.security?.sessionTimeoutMinutes || 120);

      setSmtpHost(settings.email?.smtpHost || "");
      setSmtpPort(settings.email?.smtpPort || 587);
      setSmtpUser(settings.email?.smtpUser || "");
      setSenderName(settings.email?.senderName || "");
      setSenderEmail(settings.email?.senderEmail || "");
    }
  }, [settings]);

  // Update Section Mutation
  const updateSectionMutation = useMutation({
    mutationFn: ({ section, data }: { section: string; data: any }) =>
      adminSettingsService.updateSection(section, data),
    onSuccess: (_, vars) => {
      toast.success(`تم تحديث إعدادات قسم (${vars.section}) بنجاح`);
      queryClient.invalidateQueries({ queryKey: ["admin", "platform-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ الإعدادات.");
    },
  });

  // Test Email Mutation
  const testEmailMutation = useMutation({
    mutationFn: (emailAddr: string) => adminSettingsService.testEmail(emailAddr),
    onSuccess: (res: any) => {
      toast.success(`تم إرسال بريد الاختبار بنجاح إلى ${res.deliveredTo}`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء اختبار الإرسال.");
    },
  });

  // Trigger Backup Mutation
  const backupMutation = useMutation({
    mutationFn: () => adminSettingsService.triggerBackup(),
    onSuccess: () => {
      toast.success("تم تفعيل وتأكيد النسخة الاحتياطية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin", "platform-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء إنشاء النسخة الاحتياطية.");
    },
  });

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black">
            <Settings className="h-4 w-4" />
            <span>لوحة التهيئة والإعدادات المركزية للمنصة</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            إعدادات وتهيئة المنظومة
          </h1>
          <p className="text-xs text-slate-500">
            التحكم في وضع الصيانة، شروط الأمان، تفعيل طرق السداد، البريد السريع، والنسخ الاحتياطي.
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
          onClick={() => setActiveTab("general")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "general"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          المنظومة والنظام العام
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "payments"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          طرق التحصيل والدفع
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "security"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          شروط الأمان والجلسات
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("email")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "email"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          إعدادات البريد (SMTP)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("backup")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "backup"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          النسخ الاحتياطي وقواعد البيانات
        </button>
      </div>

      {/* TAB 1: GENERAL & SYSTEM */}
      {activeTab === "general" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Cpu className="h-5 w-5 text-[#F58220]" />
            <span>إعدادات النظام وعوامل تشغيل المنصة</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">اسم المنصة الرسمي</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">العملة الافتراضية</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">وصف المنصة والرسالة العامة</label>
              <textarea
                rows={2}
                value={platformDesc}
                onChange={(e) => setPlatformDesc(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
              />
            </div>

            {/* System Switches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
              
              {/* Maintenance Mode */}
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 block text-xs">
                    وضع الصيانة (Maintenance Mode)
                  </span>
                  <span className="text-[10px] text-slate-400">إغلاق الدخول مؤقتاً لأعمال الصيانة</span>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-5 w-5 accent-rose-600 rounded cursor-pointer"
                />
              </div>

              {/* Student Registration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">
                    تفعيل تسجيل الطلاب الجدد
                  </span>
                  <span className="text-[10px] text-slate-400">السماح بإنشاء حسابات طالب جديدة</span>
                </div>
                <input
                  type="checkbox"
                  checked={registrationEnabled}
                  onChange={(e) => setRegistrationEnabled(e.target.checked)}
                  className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Teacher Apps */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">
                    تلقي طلبات المعلمين
                  </span>
                  <span className="text-[10px] text-slate-400">فتح باب الانضمام كمحاضر بالمنصة</span>
                </div>
                <input
                  type="checkbox"
                  checked={teacherAppsEnabled}
                  onChange={(e) => setTeacherAppsEnabled(e.target.checked)}
                  className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Course Approval */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">
                    مراجعة الكورسات قبل النشر
                  </span>
                  <span className="text-[10px] text-slate-400">يتطلب موافقة الإدارة قبل النشر</span>
                </div>
                <input
                  type="checkbox"
                  checked={courseApprovalRequired}
                  onChange={(e) => setCourseApprovalRequired(e.target.checked)}
                  className="h-5 w-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                updateSectionMutation.mutate({
                  section: "general",
                  data: { platformName, platformDescription: platformDesc, currency },
                });
                updateSectionMutation.mutate({
                  section: "system",
                  data: {
                    maintenanceMode,
                    registrationEnabled,
                    teacherApplicationsEnabled: teacherAppsEnabled,
                    courseApprovalRequired,
                  },
                });
              }}
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ إعدادات المنظومة بالنظام</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === "payments" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <CreditCard className="h-5 w-5 text-emerald-500" />
            <span>تفعيل وتعطيل وسائل التحصيل والدفع الإلكتروني</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* InstaPay */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">انستا باي (InstaPay)</span>
              <input
                type="checkbox"
                checked={instapay}
                onChange={(e) => setInstapay(e.target.checked)}
                className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Vodafone Cash */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">فودافون كاش والمحافظ الرقمية</span>
              <input
                type="checkbox"
                checked={vodafone}
                onChange={(e) => setVodafone(e.target.checked)}
                className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Fawry */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">خدمة فوري (Fawry Pay)</span>
              <input
                type="checkbox"
                checked={fawry}
                onChange={(e) => setFawry(e.target.checked)}
                className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Bank Transfer */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">التحويل البنكي المباشر</span>
              <input
                type="checkbox"
                checked={bank}
                onChange={(e) => setBank(e.target.checked)}
                className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() =>
                updateSectionMutation.mutate({
                  section: "payments",
                  data: {
                    instapayEnabled: instapay,
                    vodafoneCashEnabled: vodafone,
                    fawryEnabled: fawry,
                    bankTransferEnabled: bank,
                    stripeEnabled: stripe,
                  },
                })
              }
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ خيارات الدفع</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Lock className="h-5 w-5 text-indigo-500" />
            <span>سياسات الأمان والجلسات وكلمات المرور</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">الحد الأدنى لطول كلمة المرور</label>
                <input
                  type="number"
                  value={minPassLen}
                  onChange={(e) => setMinPassLen(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">مدة صلاحية الجلسة (بالدقائق)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() =>
                updateSectionMutation.mutate({
                  section: "security",
                  data: {
                    minPasswordLength: minPassLen,
                    requireUppercase: requireUpper,
                    sessionTimeoutMinutes: sessionTimeout,
                  },
                })
              }
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ إعدادات الأمان</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: EMAIL */}
      {activeTab === "email" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Mail className="h-5 w-5 text-[#F58220]" />
            <span>تهيئة بريد الخادم (SMTP Configuration)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">مضيف الـ SMTP (Host)</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] dir-ltr text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">منفذ الـ SMTP (Port)</label>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">اسم المرسل الظاهر</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">عنوان بريد المرسل (From Email)</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-[#F58220] dir-ltr text-right"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <Button
              onClick={() =>
                updateSectionMutation.mutate({
                  section: "email",
                  data: {
                    smtpHost,
                    smtpPort,
                    smtpUser,
                    senderName,
                    senderEmail,
                  },
                })
              }
              disabled={updateSectionMutation.isPending}
              className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Save className="h-4 w-4" />
              <span>حفظ إعدادات البريد</span>
            </Button>

            <Button
              onClick={() => {
                const target = prompt("أدخل البريد الإلكتروني لاختبار الإرسال:", senderEmail);
                if (target) testEmailMutation.mutate(target);
              }}
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-white/10 text-xs font-bold gap-2"
            >
              <Send className="h-4 w-4 text-emerald-600" />
              <span>اختبار الإرسال (Test Email)</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP */}
      {activeTab === "backup" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
          <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
            <Database className="h-5 w-5 text-emerald-500" />
            <span>النسخ الاحتياطي وحجم قواعد البيانات</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
              <span className="text-slate-400 text-[11px]">آخر نسخة احتياطية موثقة:</span>
              <div className="text-base text-[#0B2D5B] dark:text-white font-mono">
                {settings?.backup?.lastBackupAt
                  ? new Date(settings.backup.lastBackupAt).toLocaleString("ar-EG")
                  : "لم تنفذ بعد"}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-1">
              <span className="text-slate-400 text-[11px]">حجم قاعدة البيانات الحالية:</span>
              <div className="text-base text-emerald-600 dark:text-emerald-400 font-mono">
                {settings?.backup?.databaseSizeMB || 14.5} ميجابايت (MB)
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => backupMutation.mutate()}
              disabled={backupMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold gap-2"
            >
              <Database className="h-4 w-4" />
              <span>إنشاء نسخة احتياطية فورية</span>
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
