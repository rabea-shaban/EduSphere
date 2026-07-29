import * as React from "react";
import { Search, X, BookOpen, PlaySquare, HelpCircle, FileCheck2, Folder, Star, Loader2, ArrowLeft, Command, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalSearch, useSearchSuggestions } from "@/hooks/useSearchEngine";
import type { SearchResultItem } from "@/features/teacher/types/search";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: searchResults, isLoading } = useGlobalSearch(query);
  const { data: suggestions } = useSearchSuggestions(query);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getResultIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4 text-[#F58220]" />;
      case "lesson":
        return <PlaySquare className="w-4 h-4 text-blue-500" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-purple-500" />;
      case "assignment":
        return <FileCheck2 className="w-4 h-4 text-emerald-500" />;
      case "student":
        return <User className="w-4 h-4 text-cyan-500" />;
      case "file":
        return <Folder className="w-4 h-4 text-amber-500" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSelectResult = (url: string) => {
    onClose();
    router.push(url);
  };

  const allItems: SearchResultItem[] = searchResults
    ? [
        ...(searchResults.courses || []),
        ...(searchResults.lessons || []),
        ...(searchResults.quizzes || []),
        ...(searchResults.assignments || []),
        ...(searchResults.students || []),
        ...(searchResults.files || []),
        ...(searchResults.reviews || []),
      ]
    : [];

  const filteredItems =
    activeTab === "all" ? allItems : allItems.filter((item) => item.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4" dir="rtl">
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-right">
        {/* Top Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F58220] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="ابحث في الكورسات، الدروس، الطلاب، الاختبارات، الواجبات، الملفات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
          />
          {isLoading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin shrink-0" />}
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Autocomplete Suggestions */}
        {suggestions && suggestions.length > 0 && query.trim().length >= 2 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400">اقترحات سريعة:</span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(sug)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#071C3B] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#F58220] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Categories Tabs */}
        {allItems.length > 0 && (
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "all"
                  ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              الكل ({allItems.length})
            </button>

            {searchResults?.students && searchResults.students.length > 0 && (
              <button
                onClick={() => setActiveTab("student")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "student"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                طلاب ({searchResults.students.length})
              </button>
            )}

            {searchResults?.courses && searchResults.courses.length > 0 && (
              <button
                onClick={() => setActiveTab("course")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "course"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                كورسات ({searchResults.courses.length})
              </button>
            )}

            {searchResults?.lessons && searchResults.lessons.length > 0 && (
              <button
                onClick={() => setActiveTab("lesson")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "lesson"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                دروس ({searchResults.lessons.length})
              </button>
            )}

            {searchResults?.quizzes && searchResults.quizzes.length > 0 && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "quiz"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                اختبارات ({searchResults.quizzes.length})
              </button>
            )}

            {searchResults?.assignments && searchResults.assignments.length > 0 && (
              <button
                onClick={() => setActiveTab("assignment")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "assignment"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                واجبات ({searchResults.assignments.length})
              </button>
            )}

            {searchResults?.files && searchResults.files.length > 0 && (
              <button
                onClick={() => setActiveTab("file")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === "file"
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                ملفات ({searchResults.files.length})
              </button>
            )}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Command className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>اكتب كلمة البحث للبدء في استكشاف محتويات لوحة التحكم</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              لا توجد نتائج مطابقة لـ &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelectResult(item.url)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:border-[#F58220] hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#071C3B] border border-slate-200 dark:border-white/10 shrink-0">
                    {getResultIcon(item.type)}
                  </div>

                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#F58220] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-[#F58220] transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[11px] text-slate-400 flex items-center justify-between">
          <span>اضغط Esc للإغلاق</span>
          <span className="flex items-center gap-1">
            استخدم <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#071C3B] border border-slate-200 dark:border-white/10 text-[10px] font-mono">Ctrl + K</kbd> لفتح البحث في أي وقت
          </span>
        </div>
      </div>
    </div>
  );
}
export default GlobalSearchModal;
