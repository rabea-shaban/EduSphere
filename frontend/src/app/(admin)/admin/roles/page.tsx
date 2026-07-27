"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Key,
  ShieldAlert,
  Layers,
  Sparkles,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminRoleService, {
  AdminRoleItem,
  SystemPermissionsSchema,
  PermissionItem,
} from "@/services/adminRole.service";
import { Button } from "@/components/ui/button";

export default function AdminRolesPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = React.useState<"roles" | "matrix">("roles");

  // Create Role Modal
  const [createRoleModalOpen, setCreateRoleModalOpen] = React.useState(false);
  const [roleCodeKey, setRoleCodeKey] = React.useState("");
  const [roleNameAr, setRoleNameAr] = React.useState("");
  const [roleDesc, setRoleDesc] = React.useState("");

  // Edit Permissions Matrix Modal
  const [matrixModalRole, setMatrixModalRole] = React.useState<AdminRoleItem | null>(null);
  const [selectedPermissions, setSelectedPermissions] = React.useState<Record<string, string[]>>({});

  // Queries
  const { data: roles = [], isLoading: loadingRoles, refetch: refetchRoles } = useQuery({
    queryKey: ["admin", "roles-list"],
    queryFn: () => adminRoleService.getRoles(),
  });

  const { data: schema } = useQuery<SystemPermissionsSchema>({
    queryKey: ["admin", "permissions-schema"],
    queryFn: () => adminRoleService.getPermissionsSchema(),
  });

  const modules = schema?.modules || [];
  const actions = schema?.actions || [];

  // Create Role Mutation
  const createRoleMutation = useMutation({
    mutationFn: (data: any) => adminRoleService.createRole(data),
    onSuccess: () => {
      toast.success("تم إنشاء الدور الوظيفي بنجاح");
      setCreateRoleModalOpen(false);
      setRoleCodeKey("");
      setRoleNameAr("");
      setRoleDesc("");
      refetchRoles();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء عملية الإنشاء.");
    },
  });

  // Update Role Permissions Matrix Mutation
  const updateMatrixMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: PermissionItem[] }) =>
      adminRoleService.updateRole(id, { permissions }),
    onSuccess: () => {
      toast.success("تم تحديث مصفوفة صلاحيات الدور بنجاح");
      setMatrixModalRole(null);
      refetchRoles();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء تحديث الصلاحيات.");
    },
  });

  // Delete Role Mutation
  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => adminRoleService.deleteRole(id),
    onSuccess: () => {
      toast.success("تم حذف الدور المخصص بنجاح");
      refetchRoles();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر الحذف لارتباطه بمستخدمين أو أداور النظام.");
    },
  });

  // Open Matrix Modal & Initialize Permissions
  const handleOpenMatrixModal = (role: AdminRoleItem) => {
    const permMap: Record<string, string[]> = {};
    (role.permissions || []).forEach((p) => {
      permMap[p.module] = p.actions || [];
    });
    setSelectedPermissions(permMap);
    setMatrixModalRole(role);
  };

  // Toggle Action Checkbox
  const togglePermissionAction = (moduleKey: string, actionKey: string) => {
    setSelectedPermissions((prev) => {
      const current = prev[moduleKey] || [];
      const updated = current.includes(actionKey)
        ? current.filter((a) => a !== actionKey)
        : [...current, actionKey];
      return { ...prev, [moduleKey]: updated };
    });
  };

  // Convert Selected Permissions Map to Payload Array
  const saveMatrixChanges = () => {
    if (!matrixModalRole) return;
    const permissionsPayload: PermissionItem[] = Object.keys(selectedPermissions).map((modKey) => ({
      module: modKey,
      actions: selectedPermissions[modKey],
    }));

    updateMatrixMutation.mutate({
      id: matrixModalRole._id,
      permissions: permissionsPayload,
    });
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black">
            <ShieldCheck className="h-4 w-4" />
            <span>نظام الصلاحيات والتحكم الوظيفي (RBAC Architecture)</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            إدارة الأدوار ومصفوفة الصلاحيات
          </h1>
          <p className="text-xs text-slate-500">
            تحديد أدوار النظام، تخصيص الصلاحيات حسب الأقسام، والتحكم المطلق في حدود الوصول.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateRoleModalOpen(true)}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-bold gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>إنشاء دور مخصص جديد</span>
          </Button>

          <Button
            onClick={() => refetchRoles()}
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
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs font-black gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "roles"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          أدوار النظام والحسابات ({roles.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === "matrix"
              ? "border-[#F58220] text-[#F58220]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          مصفوفة الصلاحيات الشاملة (Permission Matrix)
        </button>
      </div>

      {/* TAB 1: ROLES LIST */}
      {activeTab === "roles" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          {loadingRoles ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <Lock className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-400">لا توجد أدوار مسجلة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((r) => (
                <div
                  key={r._id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[#0B2D5B] dark:text-white text-base">
                        {r.displayNameAr}
                      </h3>
                      {r.isSystem ? (
                        <span className="text-[10px] font-black text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          نظام أساسي
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          دور مخصص
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {r.description || "دور وظيفي معتمد ضمن مصفوفة الوصول بالمنصة."}
                    </p>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/5">
                      <span>المستخدمين: {r.usersCount}</span>
                      <span>الصلاحيات: {r.permissionsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => handleOpenMatrixModal(r)}
                      className="px-3 py-1.5 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold hover:bg-[#1E73D8] transition-colors flex items-center gap-1.5"
                    >
                      <Key className="h-3.5 w-3.5" />
                      <span>تحديث الصلاحيات</span>
                    </button>

                    {!r.isSystem && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`هل أنت متاكد من حذف هذا الدور المخصص (${r.displayNameAr})؟`)) {
                            deleteRoleMutation.mutate(r._id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                        title="حذف الدور"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERMISSION MATRIX VIEW */}
      {activeTab === "matrix" && (
        <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-[#F58220]" />
            <span>استعراض مصفوفة الأقسام والصلاحيات المتاحة</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((m) => (
              <div
                key={m.key}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-2"
              >
                <span className="font-extrabold text-[#0B2D5B] dark:text-white text-xs block">
                  {m.nameAr} ({m.key})
                </span>
                <div className="flex flex-wrap gap-1">
                  {actions.map((a) => (
                    <span
                      key={a.key}
                      className="px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                    >
                      {a.nameAr}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ROLE MODAL */}
      <AnimatePresence>
        {createRoleModalOpen && (
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
                إنشاء دور مخصص جديد
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">رمز الدور (Key) *</label>
                  <input
                    type="text"
                    value={roleCodeKey}
                    onChange={(e) => setRoleCodeKey(e.target.value.toUpperCase())}
                    placeholder="مثال: EXAM_MODERATOR..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الاسم باللغة العربية *</label>
                  <input
                    type="text"
                    value={roleNameAr}
                    onChange={(e) => setRoleNameAr(e.target.value)}
                    placeholder="مثال: مشرف الاختيارات والاختبارات..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الوصف الوظيفي</label>
                  <textarea
                    rows={2}
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                    placeholder="تحديد نطاق مسؤوليات وصلاحيات هذا الدور..."
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setCreateRoleModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (!roleCodeKey.trim() || !roleNameAr.trim()) {
                      toast.error("يرجى إدخال البيانات المطلوبة");
                      return;
                    }
                    createRoleMutation.mutate({
                      name: roleCodeKey.trim(),
                      displayNameAr: roleNameAr.trim(),
                      description: roleDesc.trim(),
                    });
                  }}
                  disabled={createRoleMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>إنشاء الدور</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERMISSIONS MATRIX MODAL FOR SPECIFIC ROLE */}
      <AnimatePresence>
        {matrixModalRole && (
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
              className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right max-h-[85vh] overflow-y-auto"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
                    تعديل مصفوفة الصلاحيات — {matrixModalRole.displayNameAr}
                  </h3>
                  <p className="text-xs text-slate-500">{matrixModalRole.name}</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-3 py-1 rounded-full">
                  RBAC Permission Matrix
                </span>
              </div>

              {/* Permissions Matrix Table */}
              <div className="overflow-x-auto border border-slate-200/80 dark:border-white/10 rounded-2xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 font-bold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="py-3 px-4">قسم النظام</th>
                      {actions.map((act) => (
                        <th key={act.key} className="py-3 px-2 text-center">
                          {act.nameAr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                    {modules.map((mod) => {
                      const activeActions = selectedPermissions[mod.key] || [];

                      return (
                        <tr key={mod.key} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                          <td className="py-3 px-4 font-bold text-[#0B2D5B] dark:text-white">
                            {mod.nameAr}
                          </td>
                          {actions.map((act) => {
                            const checked = activeActions.includes(act.key);
                            return (
                              <td key={act.key} className="py-3 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => togglePermissionAction(mod.key, act.key)}
                                  className="h-4 w-4 accent-[#0B2D5B] rounded cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setMatrixModalRole(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={saveMatrixChanges}
                  disabled={updateMatrixMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5"
                >
                  <ShieldCheck className="h-4 w-4 text-[#F58220]" />
                  <span>حفظ الصلاحيات</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
