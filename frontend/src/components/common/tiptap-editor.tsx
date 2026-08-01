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
  UploadCloud,
  FileUp,
  Loader2,
  Cloud,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import uploadService from "@/services/upload.service";

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
  // Modal states
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const [showImageModal, setShowImageModal] = React.useState(false);
  const [imageTab, setImageTab] = React.useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAlt, setImageAlt] = React.useState("");
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const [imageUploadProgress, setImageUploadProgress] = React.useState(0);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const [showVideoModal, setShowVideoModal] = React.useState(false);
  const [videoTab, setVideoTab] = React.useState<"upload" | "url">("upload");
  const [videoUrl, setVideoUrl] = React.useState("");
  const [isUploadingVideo, setIsUploadingVideo] = React.useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = React.useState(0);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

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
        جاري تحميل محرر النصوص الاحترافي TipTap...
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

  // Image File Upload to Cloudflare R2
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setImageUploadProgress(10);
      const res = await uploadService.uploadImage(file, "blog-images", (percent: number) => {
        setImageUploadProgress(Math.max(10, percent));
      });

      if (res?.url) {
        setImageUrl(res.url);
        toast.success("تم رفع الصورة بنجاح على سحابة Cloudflare R2");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء رفع الصورة.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleApplyImage = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || "صورة المقال" }).run();
    }
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
  };

  // Video File Upload to Cloudflare R2
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      setVideoUploadProgress(10);
      const res = await uploadService.uploadVideo(file, "blog-videos", (percent: number) => {
        setVideoUploadProgress(Math.max(10, percent));
      });

      if (res?.url) {
        setVideoUrl(res.url);
        toast.success("تم رفع الفيديو وتخزينه على سحابة Cloudflare R2 بنجاح");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء رفع الفيديو.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

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

      const isDirectVideo = embedUrl.endsWith(".mp4") || embedUrl.endsWith(".webm") || embedUrl.includes("/upload/");
      const videoHtml = isDirectVideo
        ? `<div class="w-full my-4 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-black"><video src="${embedUrl}" controls class="w-full max-h-[450px] mx-auto"></video></div>`
        : `<div class="aspect-video w-full rounded-3xl overflow-hidden my-4 shadow-xl border border-slate-200 dark:border-white/10"><iframe src="${embedUrl}" class="w-full h-full" allowfullscreen></iframe></div>`;

      editor.chain().focus().insertContent(videoHtml).run();
    }
    setShowVideoModal(false);
    setVideoUrl("");
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#071C3B]/50 overflow-hidden shadow-sm transition-all focus-within:border-[#F58220] focus-within:ring-2 focus-within:ring-[#F58220]/20">
      
      {/* Toolbar */}
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

        {/* Media Controls */}
        <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2 ml-1">
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

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-2 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
            title="إدراج صورة (رفع أو رابط)"
          >
            <ImageIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
            title="إدراج فيديو (رفع أو YouTube)"
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

      {/* ─── 1. LINK MODAL ─── */}
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

      {/* ─── 2. IMAGE MODAL WITH CLOUDFLARE R2 FILE UPLOAD ─── */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-[#0B2D5B] dark:text-white">
                <ImageIcon className="h-4 w-4 text-purple-500" />
                <span>إدراج صورة وتخزينها على Cloudflare R2</span>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  imageTab === "upload"
                    ? "bg-[#0B2D5B] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                اختيار ملف من الكومبيوتر (Cloudflare R2)
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  imageTab === "url"
                    ? "bg-[#0B2D5B] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                رابط مباشر (URL)
              </button>
            </div>

            {imageTab === "upload" ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-300 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 rounded-3xl p-6 text-center cursor-pointer hover:bg-purple-100/50 transition-colors space-y-2"
                >
                  {isUploadingImage ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        جاري الرفع للتخزين السحابي Cloudflare R2... ({imageUploadProgress}%)
                      </p>
                      <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 transition-all duration-300"
                          style={{ width: `${imageUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-10 w-10 text-purple-500 mx-auto" />
                      <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">
                        انقر هنا لاختيار صورة من جهازك
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold">
                        يتم الرفع والتخزين آلياً على Cloudflare R2
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
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
            )}

            {/* Alt Description */}
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
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-36 bg-slate-100 dark:bg-white/5 flex items-center justify-center p-2">
                <img src={imageUrl} alt="Preview" className="max-h-32 object-contain rounded-xl" />
              </div>
            )}

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
                disabled={!imageUrl || isUploadingImage}
                onClick={handleApplyImage}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>إدراج الصورة بالنص</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. VIDEO MODAL WITH CLOUDFLARE R2 FILE UPLOAD ─── */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-black text-sm text-[#0B2D5B] dark:text-white">
                <VideoIcon className="h-4 w-4 text-rose-500" />
                <span>إدراج فيديو وتخزينه على Cloudflare R2</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="h-7 w-7 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setVideoTab("upload")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  videoTab === "upload"
                    ? "bg-[#0B2D5B] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                رفع فيديو من الكومبيوتر (Cloudflare R2)
              </button>
              <button
                type="button"
                onClick={() => setVideoTab("url")}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  videoTab === "url"
                    ? "bg-[#0B2D5B] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                رابط YouTube / URL
              </button>
            </div>

            {videoTab === "upload" ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => videoInputRef.current?.click()}
                  className="border-2 border-dashed border-rose-300 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl p-6 text-center cursor-pointer hover:bg-rose-100/50 transition-colors space-y-2"
                >
                  {isUploadingVideo ? (
                    <div className="space-y-2">
                      <Loader2 className="h-8 w-8 text-rose-600 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                        جاري رفع ملف الفيديو وتشفيره على Cloudflare R2... ({videoUploadProgress}%)
                      </p>
                      <div className="w-full h-2 bg-rose-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-600 transition-all duration-300"
                          style={{ width: `${videoUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <FileUp className="h-10 w-10 text-rose-500 mx-auto" />
                      <h4 className="text-xs font-black text-[#0B2D5B] dark:text-white">
                        انقر لاختيار ملف فيديو من جهازك (MP4 / WebM)
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold">
                        تخزين سحابي مباشر على Cloudflare R2
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
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
            )}

            {videoUrl && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-black p-2 text-center text-xs text-white">
                🎥 تم تجهيز الفيديو للإدراج بالنص
              </div>
            )}

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
                disabled={!videoUrl || isUploadingVideo}
                onClick={handleApplyVideo}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>إدراج الفيديو بالنص</span>
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TipTapEditor;
