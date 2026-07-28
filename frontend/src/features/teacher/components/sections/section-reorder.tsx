"use client";

import * as React from "react";
import { useReorderSections } from "@/hooks/useSections";
import type { ApiSection } from "@/features/teacher/types/section";
import { SectionCard } from "./section-card";

interface SectionReorderProps {
  courseId: string;
  sections: ApiSection[];
  onEdit: (section: ApiSection) => void;
  onDelete: (section: ApiSection) => void;
  onArchive: (section: ApiSection) => void;
  onRestore: (section: ApiSection) => void;
  onDuplicate: (section: ApiSection) => void;
}

export function SectionReorder({
  courseId,
  sections,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onDuplicate,
}: SectionReorderProps) {
  const reorderSections = useReorderSections(courseId);
  const [items, setItems] = React.useState<ApiSection[]>(sections);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  // Sync with parent sections when they change (e.g., new section added)
  React.useEffect(() => {
    setItems(sections);
  }, [sections]);

  // ─── Native HTML5 Drag & Drop ─────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggingId) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const newItems = [...items];
    const dragIdx = newItems.findIndex((s) => s._id === draggingId);
    const targetIdx = newItems.findIndex((s) => s._id === targetId);

    if (dragIdx === -1 || targetIdx === -1) return;

    // Swap positions
    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(targetIdx, 0, removed);

    // Reassign order values
    const reordered = newItems.map((s, i) => ({ ...s, order: i + 1 }));
    setItems(reordered);
    setDraggingId(null);
    setDragOverId(null);

    // Persist to backend
    reorderSections.mutate({
      courseId,
      items: reordered.map((s) => ({ id: s._id, order: s.order })),
    });
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-3" role="list" aria-label="قائمة أقسام الكورس">
      {items.map((section, index) => (
        <div
          key={section._id}
          role="listitem"
          draggable
          onDragStart={(e) => handleDragStart(e, section._id)}
          onDragOver={(e) => handleDragOver(e, section._id)}
          onDrop={(e) => handleDrop(e, section._id)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            dragOverId === section._id && draggingId !== section._id
              ? "translate-y-1 opacity-60"
              : ""
          }`}
          aria-label={`قسم: ${section.title}`}
        >
          <SectionCard
            section={section}
            index={index}
            isDragging={draggingId === section._id}
            dragHandleProps={{
              onMouseDown: (e) => e.currentTarget.closest("[draggable]")?.dispatchEvent(
                new MouseEvent("mousedown", { bubbles: true })
              ),
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onRestore={onRestore}
            onDuplicate={onDuplicate}
          />
        </div>
      ))}
    </div>
  );
}

export default SectionReorder;
