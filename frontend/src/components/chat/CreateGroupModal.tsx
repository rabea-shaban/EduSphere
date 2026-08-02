"use client";

import * as React from "react";
import { Users, X, Plus, Search, Loader2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import chatService, { ChatParticipant } from "@/services/chat.service";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (title: string, participantIds: string[], description?: string) => Promise<any>;
}

export function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupTitle, setGroupTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [searchMember, setSearchMember] = React.useState("");
  const [availableContacts, setAvailableContacts] = React.useState<ChatParticipant[]>([]);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // Fetch enrolled contacts on modal open
  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingContacts(true);
      chatService
        .getEnrolledContacts()
        .then((res) => {
          setAvailableContacts(res.contacts || []);
        })
        .catch((err) => {
          console.error("Failed to load contacts:", err);
        })
        .finally(() => {
          setIsLoadingContacts(false);
        });
    } else {
      setGroupTitle("");
      setDescription("");
      setSearchMember("");
      setSelectedUserIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const filteredContacts = availableContacts.filter((c) => {
    const name = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
    const phone = (c as any).phone || "";
    return name.includes(searchMember.toLowerCase()) || phone.includes(searchMember);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim()) {
      toast.error("يرجى إدخال اسم المجموعة الدراسية");
      return;
    }
    if (selectedUserIds.length === 0) {
      toast.error("يرجى اختيار عضو واحد على الأقل للمجموعة");
      return;
    }

    setIsCreating(true);
    try {
      await onCreateGroup(groupTitle.trim(), selectedUserIds, description.trim());
      toast.success("تم إنشاء المجموعة الدراسية بنجاح 🚀");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || err?.response?.data?.message || "فشل إنشاء المجموعة");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-[#0] z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-[#071C3B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/20">
          <div className="flex items-center gap-2 text-[#0B2D5B] dark:text-white">
            <div className="h-9 w-9 rounded-xl bg-[#F58220]/10 text-[#F58220] flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black">إنشاء مجموعة دراسية جديدة</h3>
              <p className="text-[11px] text-slate-500">قم بدعوة الطلاب والمعلمين للدردشة التفاعلية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 hover:bg-slate-300 flex items-center justify-center transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          <div>
            <label className="block text-xs font-bold text-[#0B2D5B] dark:text-white mb-1">
              اسم المجموعة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: مجموعة الرياضيات - الثانوية العامة"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              className="w-full h-10 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[#0B2D5B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E73D8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2D5B] dark:text-white mb-1">
              وصف المجموعة (اختياري)
            </label>
            <textarea
              rows={2}
              placeholder="اكتب وصف مختصر للمجموعة..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[#0B2D5B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E73D8]"
            />
          </div>

          {/* Member Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#0B2D5B] dark:text-white">
              <span>اختيار الأعضاء ({selectedUserIds.length})</span>
            </div>

            <div className="relative">
              <Search className="absolute top-2.5 right-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="البحث في جهات الاتصال..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full h-9 pr-8 pl-3 text-[11px] rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[#0B2D5B] dark:text-white focus:outline-none"
              />
            </div>

            {/* Members List */}
            <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-thin p-1 border border-slate-200/80 dark:border-white/10 rounded-xl">
              {isLoadingContacts ? (
                <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#1E73D8]" />
                  <span>جاري تحميل الأعضاء...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  لا يوجد أعضاء متاحين
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isSelected = selectedUserIds.includes(contact._id);
                  const name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || contact.username;

                  return (
                    <div
                      key={contact._id}
                      onClick={() => toggleUserSelection(contact._id)}
                      className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 dark:bg-white/10 border border-blue-200 dark:border-white/20"
                          : "hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-7 w-7 rounded-md bg-[#0B2D5B] text-white flex items-center justify-center font-bold text-xs">
                          {(name || "U").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">{name}</p>
                          <span className="text-[10px] text-slate-400">
                            {contact.role === "TEACHER" ? "معلم" : "طالب"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                          isSelected ? "bg-[#1E73D8] border-[#1E73D8] text-white" : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !groupTitle.trim() || selectedUserIds.length === 0}
              className="h-10 px-5 rounded-xl bg-[#F58220] hover:bg-[#e0711a] text-white font-bold text-xs flex items-center gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <>
                  <span>إنشاء المجموعة</span>
                  <Plus className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CreateGroupModal;
