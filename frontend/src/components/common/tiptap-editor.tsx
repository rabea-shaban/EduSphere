"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function TipTapEditor({
  value,
  onChange,
  placeholder = "اكتب الشرح المنهجي والمحتوى التعليمي هنا...",
  minHeight = "200px",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1E73D8] underline hover:text-[#F58220] transition-colors",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none p-4 outline-none dir-rtl text-right text-xs sm:text-sm font-semibold leading-relaxed text-[#0B2D5B] dark:text-slate-100 min-h-[${minHeight}]`,
      },
    },
  });

  // Sync value if updated externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-48 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">
        جاري تحميل محرر النصوص TipTap...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("أدخل الرابط:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 overflow-hidden transition-all focus-within:border-[#F58220] focus-within:ring-2 focus-within:ring-[#F58220]/20 shadow-xs">
      {/* Executive Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-right dir-rtl">
        {/* Formatting Group */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("bold")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="خط عريض (Bold)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("italic")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="خط مائل (Italic)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("underline")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="خط تحتي (Underline)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("strike")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="يتوسطه خط (Strikethrough)"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        {/* Headings Group */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("heading", { level: 1 })
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="عنوان رئيسي (H1)"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("heading", { level: 2 })
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="عنوان فرعي (H2)"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("heading", { level: 3 })
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="عنوان ثانوي (H3)"
          >
            <Heading3 className="h-4 w-4" />
          </button>
        </div>

        {/* Lists & Quotes Group */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("bulletList")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="قائمة نقطية"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("orderedList")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="قائمة مرقمة"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("blockquote")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="اقتباس"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("codeBlock")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="كود برمجي (Code)"
          >
            <Code className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("link")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="إضافة رابط"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            title="تراجع (Undo)"
          >
            <Undo className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
            title="إعادة (Redo)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="bg-white dark:bg-[#0B2D5B]/30" />
    </div>
  );
}

export default TipTapEditor;
