import * as React from "react";
import { Download, UserX, Trash2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

interface AccountManagementCardProps {
  onExportData: () => void;
  onDeactivateAccount: (password: string) => void;
  onDeleteAccount: (password: string) => void;
  isExporting?: boolean;
  isDeactivating?: boolean;
  isDeleting?: boolean;
}

export function AccountManagementCard({
  onExportData,
  onDeactivateAccount,
  onDeleteAccount,
  isExporting,
  isDeactivating,
  isDeleting,
}: AccountManagementCardProps) {
  const [activeModal, setActiveModal] = React.useState<"deactivate" | "delete" | null>(null);
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleConfirmAction = () => {
    if (!confirmPassword) return;
    if (activeModal === "deactivate") {
      onDeactivateAccount(confirmPassword);
    } else if (activeModal === "delete") {
      onDeleteAccount(confirmPassword);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          إدارة الحساب والدورة الحياتية (Account Lifecycle)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تصدير ملفات البيانات الشخصية (GDPR)، تعطيل الحساب مؤقتاً، أو تقديم طلب حذف الحساب
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GDPR Export Data */}
        <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تصدير البيانات الشخصية (GDPR Data Export)</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              تنزيل نسخة شفرة JSON تضم كافة بياناتك الشخصية، الدورات، والسجلات
            </p>
          </div>
          <button
            type="button"
            onClick={onExportData}
            disabled={isExporting}
            className="w-full h-10 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] hover:bg-[#071f3f] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            تنزيل كافة البيانات
          </button>
        </div>

        {/* Deactivate Account */}
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تعطيل الحساب مؤقتاً</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              إيقاف ظهور دوراتك وملفك الشخصي مؤقتاً مع إمكانية استعادته لاحقاً
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmPassword("");
              setActiveModal("deactivate");
            }}
            className="w-full h-10 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserX className="w-4 h-4" />
            تعطيل الحساب
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-3">
          <div className="p-2.5 w-fit rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">طلب حذف الحساب نهائياً</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              إزالة الحساب وكافة البيانات المرتبطة بشكل دائم وفق سياسة الحفظ
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmPassword("");
              setActiveModal("delete");
            }}
            className="w-full h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            حذف الحساب
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${activeModal === "delete" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeModal === "delete" ? "تأكيد طلب حذف الحساب" : "تأكيد تعطيل الحساب"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يرجى إدخال كلمة المرور الحالية لتأكيد الإجراء
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={!confirmPassword || isDeactivating || isDeleting}
                className={`h-10 px-6 rounded-xl text-white text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50 ${
                  activeModal === "delete" ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {(isDeactivating || isDeleting) && <Loader2 className="w-4 h-4 animate-spin" />}
                تأكيد وتنفيذ الإجراء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AccountManagementCard;
