"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Check,
  Star,
  Zap,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Download,
  AlertCircle,
  XCircle,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminSubscriptionService, { SubscriptionPlanItem } from "@/services/adminSubscription.service";
import { Button } from "@/components/ui/button";

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("");

  // Modals State
  const [planModalOpen, setPlanModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlanItem | null>(null);

  // Form Fields
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState<number>(350);
  const [currency, setCurrency] = React.useState("EGP");
  const [subscriptionType, setSubscriptionType] = React.useState<"Free" | "Monthly" | "Yearly" | "Lifetime">("Monthly");
  const [featuresInput, setFeaturesInput] = React.useState("دخول لجميع الكورسات\nاختبارات ومراجعات ثانوية\nشهادات معتمدة");
  const [isPopular, setIsPopular] = React.useState(false);
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Subscriptions
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "subscription-plans", debouncedSearch, selectedType],
    queryFn: () => adminSubscriptionService.getPlans({ search: debouncedSearch, type: selectedType || undefined }),
  });

  // Default plans if DB is empty for demo/initial view
  const defaultDemoPlans: SubscriptionPlanItem[] = [
    {
      _id: "demo_1",
      name: "الباقة الشهرية العادية",
      description: "اشتراك شهري مرن يتيح الوصول لجميع الدورات والاختبارات",
      price: 350,
      currency: "ج.م",
      subscriptionType: "Monthly",
      features: ["دخول لجميع الكورسات", "اختبارات ومراجعات دورية", "دعم فني وتواصل"],
      isPopular: false,
      status: "Active",
      createdAt: new Date().toISOString(),
      subscribersCount: 142,
    },
    {
      _id: "demo_2",
      name: "الباقة السنوية الشاملة",
      description: "الخيار الأفضل للطلاب للحصول على ميزات غير محدودة بخصم سنوي",
      price: 2800,
      currency: "ج.م",
      subscriptionType: "Yearly",
      features: ["جميع كورسات الثانوية وCS", "تواصل مباشر مع المحاضر", "شهادات إتمام معتمدة", "مراجعة المشاريع بالذكاء الاصطناعي"],
      isPopular: true,
      status: "Active",
      createdAt: new Date().toISOString(),
      subscribersCount: 389,
    },
    {
      _id: "demo_3",
      name: "باقة البكالوريا الدولية",
      description: "مخصصة لطلاب الشهادات الدولية وبحوث التفكير الناقد",
      price: 3500,
      currency: "ج.م",
      subscriptionType: "Yearly",
      features: ["شاملة أوراق البحث والتفكير الناقد", "جلسات استشارية فردية", "شهادات دولية معتمدة"],
      isPopular: false,
      status: "Active",
      createdAt: new Date().toISOString(),
      subscribersCount: 95,
    },
  ];

  const plans = (data?.plans && data.plans.length > 0) ? data.plans : defaultDemoPlans;

  // Filter local items if needed
  const filteredPlans = plans.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || (p.description && p.description.includes(debouncedSearch));
    const matchesType = !selectedType || p.subscriptionType === selectedType;
    return matchesSearch && matchesType;
  });

  // Reset Modal Form
  const resetForm = () => {
    setEditingPlan(null);
    setName("");
    setDescription("");
    setPrice(350);
    setCurrency("EGP");
    setSubscriptionType("Monthly");
    setFeaturesInput("دخول لجميع الكورسات\nاختبارات ومراجعات ثانوية\nشهادات معتمدة");
    setIsPopular(false);
    setStatus("Active");
  };

  // Open Edit Modal
  const handleOpenEdit = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || "");
    setPrice(plan.price);
    setCurrency(plan.currency || "EGP");
    setSubscriptionType(plan.subscriptionType);
    setFeaturesInput((plan.features || []).join("\n"));
    setIsPopular(Boolean(plan.isPopular));
    setStatus(plan.status);
    setPlanModalOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => adminSubscriptionService.createPlan(payload),
    onSuccess: () => {
      toast.success("تم إضافة باقة الاشتراك بنجاح");
      setPlanModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ الباقة.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminSubscriptionService.updatePlan(id, payload),
    onSuccess: () => {
      toast.success("تم تحديث بيانات الباقة بنجاح");
      setPlanModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تعديل الباقة.");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: "Active" | "Inactive" }) =>
      currentStatus === "Active" ? adminSubscriptionService.deactivatePlan(id) : adminSubscriptionService.activatePlan(id),
    onSuccess: () => {
      toast.success("تم تغيير حالة الباقة بنجاح");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تغيير حالة الباقة.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminSubscriptionService.deletePlan(id),
    onSuccess: () => {
      toast.success("تم حذف الباقة بنجاح");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر حذف الباقة.");
    },
  });

  // Handle Save Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) {
      toast.error("يرجى إدخال اسم الباقة والسعر بشكل صحيح");
      return;
    }

    const featuresArr = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      currency: currency.trim() || "EGP",
      subscriptionType,
      features: featuresArr,
      isPopular,
      status,
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
            <CreditCard className="h-4 w-4" />
            <span>نظام إدارة خطط الباقات والاشتراكات المباشرة</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            إدارة خطط وباقات الاشتراكات
          </h1>
          <p className="text-xs text-slate-500">
            باقات الاشتراكات الكلية (السنوية والشهرية والسنوية المتقدمة) لمسارات التعليم واختبارات الثانوية العامة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setPlanModalOpen(true);
            }}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة باقة جديدة</span>
          </Button>

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">إجمالي الباقات المتاحة</span>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white">{plans.length} باقات</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">الباقة الأكثر إقبالاً</span>
          <div className="text-lg font-black text-[#F58220]">
            {plans.find((p) => p.isPopular)?.name || "الباقة السنوية الشاملة"}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400">إجمالي المشتركين بالباقات</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {plans.reduce((acc, p) => acc + (p.subscribersCount || 100), 0)} مشترك
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم الباقة أو المميزات..."
            className="w-full h-10 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="flex items-center gap-1.5 font-bold">
          <button
            type="button"
            onClick={() => setSelectedType("")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedType === ""
                ? "bg-[#0B2D5B] text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            جميع الأنواع
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("Monthly")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedType === "Monthly"
                ? "bg-[#0B2D5B] text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            شهرية (Monthly)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("Yearly")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedType === "Yearly"
                ? "bg-[#0B2D5B] text-white shadow-sm"
                : "bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            سنوية (Yearly)
          </button>
        </div>

      </div>

      {/* Subscription Cards Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div
            key={plan._id}
            className={`p-6 rounded-3xl bg-white dark:bg-[#0F274D] border shadow-sm space-y-5 text-right relative flex flex-col justify-between transition-all hover:shadow-md ${
              plan.isPopular
                ? "border-[#F58220] ring-2 ring-[#F58220]/20"
                : "border-slate-200/80 dark:border-white/10"
            }`}
          >
            {/* Badges */}
            <div className="flex items-center justify-between gap-2">
              {plan.isPopular ? (
                <span className="text-[10px] font-black bg-[#F58220] text-white px-3 py-1 rounded-full shadow-sm">
                  الباقة الأكثر مبيعاً
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                  {plan.subscriptionType === "Monthly" ? "اشتراك شهري" : "اشتراك سنوي"}
                </span>
              )}

              {plan.status === "Active" ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  مفعلة
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">
                  معطلة
                </span>
              )}
            </div>

            {/* Title & Pricing */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                {plan.name}
              </h3>
              {plan.description && (
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {plan.description}
                </p>
              )}

              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#F58220]">
                  {plan.price.toLocaleString("ar-EG")} {plan.currency || "ج.م"}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  / {plan.subscriptionType === "Monthly" ? "شهر" : "سنة"}
                </span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10 flex-1">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block">
                المميزات والتسهيلات المشمولة:
              </span>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {(plan.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10 gap-2">
              
              <div className="flex items-center gap-1.5">
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(plan)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-[#0B2D5B] hover:text-white transition-colors"
                  title="تعديل الباقة"
                >
                  <Edit className="h-4 w-4" />
                </button>

                {/* Toggle Status */}
                <button
                  type="button"
                  onClick={() =>
                    toggleStatusMutation.mutate({
                      id: plan._id,
                      currentStatus: plan.status,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold hover:bg-slate-200 transition-colors"
                  title="تغيير الحالة"
                >
                  {plan.status === "Active" ? "تعطيل" : "تفعيل"}
                </button>
              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`هل أنت متاكد من حذف باقة "${plan.name}"؟`)) {
                    deleteMutation.mutate(plan._id);
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

      {/* CREATE / EDIT SUBSCRIPTION PLAN MODAL */}
      <AnimatePresence>
        {planModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
                {editingPlan ? "تعديل باقة الاشتراك" : "إنشاء باقة اشتراك جديدة"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">اسم الباقة *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: الباقة السنوية المتقدمة..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-bold text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">السعر *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-bold text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">نوع الاشتراك *</label>
                    <select
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none font-bold text-xs"
                    >
                      <option value="Monthly">شهري (Monthly)</option>
                      <option value="Yearly">سنوي (Yearly)</option>
                      <option value="Lifetime">مدى الحياة (Lifetime)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">وصف قصير الباقة</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="توضيح موجز للباقة والجمهور المستهدف..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-medium text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">المميزات (كل ميزة في سطر منفصل) *</label>
                  <textarea
                    rows={4}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="دخول لجميع الكورسات&#10;اختبارات ومراجعات ثانوية&#10;شهادات معتمدة"
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-medium text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 pt-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      تمييز الباقة كـ "الأكثر مبيعاً"
                    </span>
                    <span className="text-[10px] text-slate-400">إضافة إطار بارز وشعار الباقة الأكثر إقبالاً</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="h-5 w-5 accent-[#F58220] rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    type="button"
                    onClick={() => setPlanModalOpen(false)}
                    variant="outline"
                    className="rounded-xl text-xs font-bold"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5"
                  >
                    <Send className="h-4 w-4" />
                    <span>{editingPlan ? "حفظ التعديلات" : "إنشاء الباقة"}</span>
                  </Button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
