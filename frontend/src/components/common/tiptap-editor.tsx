"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color as ColorExtension } from "@tiptap/extension-color";
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
  Image as ImageIcon,
  Video as VideoIcon,
  Palette,
  X,
  Check,
  Sparkles,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const COLOR_PALETTE = [
  { name: "كحلي المنصة", hex: "#0B2D5B" },
  { name: "برتقالي هويتنا", hex: "#F58220" },
  { name: "أخضر زمردي", hex: "#10B981" },
  { name: "أزرق ملكي", hex: "#2563EB" },
  { name: "بنفسجي ياقوتي", hex: "#8B5CF6" },
  { name: "أحمر قاني", hex: "#EF4444" },
  { name: "ذهبي عنبري", hex: "#F59E0B" },
  { name: "رمادي سلايت", hex: "#64748B" },
];

export function TipTapEditor({
  value,
  onChange,
  placeholder = "اكتب المحتوى والتفاصيل بالتنسيق الكامل هنا...",
  minHeight = "250px",
}: TipTapEditorProps) {
  // Modal states (NO browser prompt / alert!)
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");

  const [showImageModal, setShowImageModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");

  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState("");

  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      ColorExtension,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-3xl max-w-full my-4 shadow-lg border border-slate-200 dark:border-white/10 mx-auto block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1E73D8] underline hover:text-[#F58220] font-bold transition-colors",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none p-5 outline-none dir-rtl text-right text-xs sm:text-sm font-semibold leading-relaxed text-[#0B2D5B] dark:text-slate-100 min-h-[${minHeight}]`,
      },
    },
  });

  // Sync external value
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="h-48 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 animate-pulse flex items-center justify-center text-xs text-slate-400 font-bold">
        جاري محرر النصوص احترافي TipTap...
      </div>
    );
  }

  // Handle Link Insertion
  const handleOpenLinkModal = () => {
    const prevUrl = editor.getAttributes("link").href || "";
    setLinkUrl(prevUrl);
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let finalUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const handleUnsetLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkModal(false);
    setLinkUrl("");
  };

  // Handle Image Insertion
  const handleApplyImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || "صورة منوعة" }).run();
    }
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
  };

  // Handle Video Insertion
  const handleApplyVideo = () => {
    if (videoUrl.trim()) {
      let embedUrl = videoUrl.trim();
      if (embedUrl.includes("youtube.com/watch?v=")) {
        const id = embedUrl.split("v=")[1]?.split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${id}`;
      } else if (embedUrl.includes("youtu.be/")) {
        const id = embedUrl.split("youtu.be/")[1]?.split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${id}`;
      }

      const videoHtml = `<div class="aspect-video w-full rounded-3xl overflow-hidden my-4 shadow-xl border border-slate-200 dark:border-white/10"><iframe src="${embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>`;
      editor.chain().focus().insertContent(videoHtml).run();
    }
    setShowVideoModal(false);
    setVideoUrl("");
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#071C3B]/50 overflow-hidden shadow-sm transition-all focus-within:border-[#F58220] focus-within:ring-2 focus-within:ring-[#F58220]/20">
      
      {/* Executive Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-100/90 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-right dir-rtl select-none">
        
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

        {/* Color Palette Popover Button */}
        <div className="relative border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="اختيار لون النص"
          >
            <Palette className="h-4 w-4 text-[#F58220]" />
            <span>الألوان</span>
          </button>

          {showColorPicker && (
            <div className="absolute top-11 right-0 z-30 bg-white dark:bg-[#0F274D] p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl grid grid-cols-4 gap-2 w-48 text-right">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    editor.chain().focus().setColor(c.hex).run();
                    setShowColorPicker(false);
                  }}
                  className="h-8 w-8 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColorPicker(false);
                }}
                className="col-span-4 text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white pt-1 text-center border-t border-slate-100 dark:border-white/10"
              >
                إعادة للون الافتراضي
              </button>
            </div>
          )}
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

        {/* Lists & Blocks Group */}
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
        </div>

        {/* Professional Media Controls (Link, Image, Video Modals) */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
          {/* Link Trigger */}
          <button
            type="button"
            onClick={handleOpenLinkModal}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              editor.isActive("link")
                ? "bg-[#0B2D5B] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
            }`}
            title="إضافة / تعديل رابط"
          >
            <LinkIcon className="h-4 w-4 text-blue-500" />
          </button>

          {/* Image Trigger */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
            title="إدراج صورة احترافية"
          >
            <ImageIcon className="h-4 w-4" />
          </button>

          {/* Video Trigger */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
            title="إدراج فيديو / YouTube"
          >
            <VideoIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 mr-auto">
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

      {/* ─── IN-EDITOR MODALS (NO BROWSER ALERT/PROMPT!) ─── */}

      {/* 1. LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-[#0B2D5B] dark:text-white">
                <LinkIcon className="h-4 w-4 text-blue-500" />
                <span>إدراج رابط تشعبي</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                عنوان URL للرابط *
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono outline-none focus:border-[#F58220] dir-ltr text-right"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {editor.isActive("link") && (
                <Button
                  type="button"
                  onClick={handleUnsetLink}
                  variant="outline"
                  className="rounded-2xl text-xs font-bold text-rose-500 border-rose-200 gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>إزالة الرابط</span>
                </Button>
              )}
              <div className="flex gap-2 mr-auto">
                <Button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  variant="outline"
                  className="rounded-2xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  onClick={handleApplyLink}
                  className="bg-[#0B2D5B] hover:bg-[#1E73D8] text-white rounded-2xl text-xs font-black"
                >
                  تطبيق الرابط
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-[#0B2D5B] dark:text-white">
                <ImageIcon className="h-4 w-4 text-purple-500" />
                <span>إدراج صورة عالية الجودة</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط الصورة (Image URL) *
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono outline-none focus:border-[#F58220] dir-ltr text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  وصف الصورة (Alt text - اختياري)
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="وصف مختصر للصورة..."
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
                />
              </div>

              {imageUrl && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-40 bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="max-h-40 object-contain" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                onClick={() => setShowImageModal(false)}
                variant="outline"
                className="rounded-2xl text-xs font-bold"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleApplyImage}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black"
              >
                إدراج الصورة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIDEO MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-[#0B2D5B] dark:text-white">
                <VideoIcon className="h-4 w-4 text-rose-500" />
                <span>إدراج فيديو أو مقطع YouTube</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  رابط الفيديو / YouTube URL *
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono outline-none focus:border-[#F58220] dir-ltr text-right"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                onClick={() => setShowVideoModal(false)}
                variant="outline"
                className="rounded-2xl text-xs font-bold"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                onClick={handleApplyVideo}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black"
              >
                إدراج الفيديو
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TipTapEditor;
