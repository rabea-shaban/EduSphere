"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  UserCheck,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  Edit,
  Mail,
  Phone,
  ShieldAlert,
  UserX,
  UserPlus,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import adminUserService, { SystemUserItem } from "@/services/adminUser.service";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedBlockedStatus, setSelectedBlockedStatus] = React.useState<"" | "blocked" | "active">("");

  // Modals State
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [roleModalUser, setRoleModalUser] = React.useState<SystemUserItem | null>(null);
  const [newRole, setNewRole] = React.useState<string>("STUDENT");

  // Create User Form State
  const [newFirstName, setNewFirstName] = React.useState("");
  const [newLastName, setNewLastName] = React.useState("");
  const [newUsername, setNewUsername] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState<string>("STUDENT");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Users
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "users", page, debouncedSearch, selectedRole, selectedBlockedStatus],
    queryFn: () =>
      adminUserService.getUsers({
        page,
        limit: 12,
        search: debouncedSearch,
        role: selectedRole || undefined,
        isBlocked: selectedBlockedStatus === "blocked" ? true : selectedBlockedStatus === "active" ? false : undefined,
      }),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  // Toggle Block/Freeze Mutation
  const toggleBlockMutation = useMutation({
    mutationFn: ({ userId, targetBlocked }: { userId: string; targetBlocked: boolean }) =>
      adminUserService.toggleUserBlockStatus(userId, targetBlocked),
    onSuccess: (_, vars) => {
      toast.success(vars.targetBlocked ? "تم تجميد حساب المستخدم بنجاح" : "تم إلغاء تجميد وتفعيل حساب المستخدم بنجاح");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر إجراء العملية على الحساب.");
    },
  });

  // Change Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      adminUserService.updateUserRole(userId, roleName),
    onSuccess: () => {
      toast.success("تم تحديث الدور الوظيفي للمستخدم بنجاح");
      setRoleModalUser(null);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر تغيير دور المستخدم.");
    },
  });

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => adminUserService.createUser(userData),
    onSuccess: () => {
      toast.success("تم إنشاء الحساب الجديد بنجاح");
      setCreateModalOpen(false);
      setNewFirstName("");
      setNewLastName("");
      setNewUsername("");
      setNewEmail("");
      setNewPhone("");
      setNewPassword("");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب.");
    },
  });

  // Permanent Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminUserService.deleteUserPermanent(userId),
    onSuccess: () => {
      toast.success("تم حذف المستخدم من النظام نهائياً");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "تعذر حذف الحساب.");
    },
  });

  // Arabic Labels Mapping for Roles
  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "مدير عام النظام",
    ADMIN: "مشرف النظام",
    TEACHER: "معلم ومحاضر",
    STUDENT: "طالب دراسي",
    PARENT: "ولي أمر",
  };

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black">
            <Users className="h-4 w-4" />
            <span>إدارة وتوزيع حسابات مستخدمي المنظومة</span>
          </div>
          <h1 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
            دليل مستخدمي وحسابات المنصة
          </h1>
          <p className="text-xs text-slate-500">
            متابعة وإدارة حسابات الطلاب والمعلمين والمدراء وتحديث أدوارهم وتجميد الحسابات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold gap-1.5 shadow-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span>إضافة مستخدم جديد</span>
          </Button>

          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 dark:border-white/10"
            title="تحديث القائمة"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white dark:bg-[#0F274D] p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم المستخدم، البريد، أو الهاتف..."
            className="w-full h-10 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium outline-none focus:border-[#F58220]"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="">جميع الأدوار والمسؤوليات</option>
          <option value="STUDENT">الطلاب (STUDENT)</option>
          <option value="TEACHER">المعلمين (TEACHER)</option>
          <option value="ADMIN">المشرفين (ADMIN)</option>
          <option value="SUPER_ADMIN">المدراء العموم (SUPER_ADMIN)</option>
          <option value="PARENT">أولياء الأمور (PARENT)</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedBlockedStatus}
          onChange={(e) => {
            setSelectedBlockedStatus(e.target.value as any);
            setPage(1);
          }}
          className="h-10 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
        >
          <option value="">جميع حالات الحسابات</option>
          <option value="active">الحسابات النشطة</option>
          <option value="blocked">الحسابات المجمدة</option>
        </select>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 w-full bg-slate-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">
              لا يوجد مستخدمين مطابقين لمعايير البحث
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 font-bold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-4 px-4">اسم المستخدم والبيانات</th>
                  <th className="py-4 px-4">اسم الحساب (Username)</th>
                  <th className="py-4 px-4">الدور الوظيفي</th>
                  <th className="py-4 px-4">حالة الحساب</th>
                  <th className="py-4 px-4">تاريخ الانضمام</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                {users.map((u) => {
                  const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                      
                      {/* Name & Contacts */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-[#0B2D5B] dark:text-white block">
                            {fullName}
                          </span>
                          <span className="text-[11px] text-slate-400 block dir-ltr text-right">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                        @{u.username}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          onClick={() => {
                            setRoleModalUser(u);
                            setNewRole(u.role);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center gap-1 ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              : u.role === "ADMIN"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : u.role === "TEACHER"
                              ? "bg-[#F58220]/10 text-[#F58220] border border-[#F58220]/20"
                              : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {roleLabels[u.role] || u.role}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-4 px-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                            <Lock className="h-3 w-3" />
                            <span>مجمد</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>نشط</span>
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Toggle Block/Freeze */}
                          <button
                            type="button"
                            onClick={() =>
                              toggleBlockMutation.mutate({
                                userId: u._id,
                                targetBlocked: !u.isBlocked,
                              })
                            }
                            className={`p-2 rounded-xl transition-colors ${
                              u.isBlocked
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white"
                            }`}
                            title={u.isBlocked ? "إلغاء التجميد والتفعيل" : "تجميد الحساب"}
                          >
                            {u.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </button>

                          {/* Change Role */}
                          <button
                            type="button"
                            onClick={() => {
                              setRoleModalUser(u);
                              setNewRole(u.role);
                            }}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            title="تغيير الدور الوظيفي"
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متاكد من حذف حساب (${fullName}) نهائياً؟`)) {
                                deleteMutation.mutate(u._id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                            title="حذف نهائي"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              صفحة {pagination.page} من {pagination.totalPages} (إجمالي {pagination.total} مستخدم)
            </span>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="rounded-xl text-xs"
              >
                السابق
              </Button>

              <Button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                variant="outline"
                className="rounded-xl text-xs"
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE NEW USER */}
      <AnimatePresence>
        {createModalOpen && (
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
                إنشاء حساب مستخدم جديد
              </h3>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">الاسم الأول *</label>
                    <input
                      type="text"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="الاسم الأول..."
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">اسم العائلة *</label>
                    <input
                      type="text"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="اسم العائلة..."
                      className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">اسم المستخدم (Username) *</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="مثال: ahmed_2026..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="example@domain.com..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">رقم الهاتف *</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="010XXXXXXXX..."
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] dir-ltr text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">كلمة المرور *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="******"
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الدور الوظيفي *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none font-bold"
                  >
                    <option value="STUDENT">طالب دراسي (STUDENT)</option>
                    <option value="TEACHER">معلم ومحاضر (TEACHER)</option>
                    <option value="ADMIN">مشرف نظام (ADMIN)</option>
                    <option value="SUPER_ADMIN">مدير عام (SUPER_ADMIN)</option>
                    <option value="PARENT">ولي أمر (PARENT)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  onClick={() => setCreateModalOpen(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    if (
                      !newFirstName.trim() ||
                      !newLastName.trim() ||
                      !newUsername.trim() ||
                      !newEmail.trim() ||
                      !newPhone.trim() ||
                      !newPassword.trim()
                    ) {
                      toast.error("يرجى ملء كافة البيانات المطلوبة");
                      return;
                    }
                    createUserMutation.mutate({
                      firstName: newFirstName.trim(),
                      lastName: newLastName.trim(),
                      username: newUsername.trim(),
                      email: newEmail.trim(),
                      phone: newPhone.trim(),
                      password: newPassword,
                      role: newUserRole,
                    });
                  }}
                  disabled={createUserMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>إنشاء الحساب</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CHANGE ROLE */}
      <AnimatePresence>
        {roleModalUser && (
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
                تحديث الدور الوظيفي للمستخدم
              </h3>

              <div className="space-y-3 text-xs">
                <p className="text-slate-500">
                  المستخدم: <strong className="text-slate-800 dark:text-white">{roleModalUser.firstName} {roleModalUser.lastName}</strong>
                </p>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">الدور الجديد</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none font-bold"
                  >
                    <option value="STUDENT">طالب دراسي (STUDENT)</option>
                    <option value="TEACHER">معلم ومحاضر (TEACHER)</option>
                    <option value="ADMIN">مشرف نظام (ADMIN)</option>
                    <option value="SUPER_ADMIN">مدير عام (SUPER_ADMIN)</option>
                    <option value="PARENT">ولي أمر (PARENT)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setRoleModalUser(null)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    updateRoleMutation.mutate({
                      userId: roleModalUser._id,
                      roleName: newRole,
                    });
                  }}
                  disabled={updateRoleMutation.isPending}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-xl text-xs font-extrabold"
                >
                  <span>تحديث الدور</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
