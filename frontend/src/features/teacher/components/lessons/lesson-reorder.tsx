"use client";

import * as React from "react";
import { useReorderLessons } from "@/hooks/useLessons";
import type { ApiLesson } from "@/features/teacher/types/lesson";
import { LessonCard } from "./lesson-card";

interface LessonReorderProps {
  sectionId: string;
  lessons: ApiLesson[];
  onEdit: (lesson: ApiLesson) => void;
  onDelete: (lesson: ApiLesson) => void;
  onArchive: (lesson: ApiLesson) => void;
  onRestore: (lesson: ApiLesson) => void;
  onDuplicate: (lesson: ApiLesson) => void;
  onMove: (lesson: ApiLesson) => void;
}

export function LessonReorder({
  sectionId,
  lessons,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onDuplicate,
  onMove,
}: LessonReorderProps) {
  const reorderLessons = useReorderLessons(sectionId);
  const [items, setItems] = React.useState<ApiLesson[]>(lessons);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItems(lessons);
  }, [lessons]);

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
    const dragIdx = newItems.findIndex((l) => l._id === draggingId);
    const targetIdx = newItems.findIndex((l) => l._id === targetId);

    if (dragIdx === -1 || targetIdx === -1) return;

    const [removed] = newItems.splice(dragIdx, 1);
    newItems.splice(targetIdx, 0, removed);

    const reordered = newItems.map((l, i) => ({ ...l, order: i + 1 }));
    setItems(reordered);
    setDraggingId(null);
    setDragOverId(null);

    reorderLessons.mutate({
      sectionId,
      items: reordered.map((l) => ({ id: l._id, order: l.order })),
    });
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-2" role="list" aria-label="قائمة دروس القسم">
      {items.map((lesson, index) => (
        <div
          key={lesson._id}
          role="listitem"
          draggable
          onDragStart={(e) => handleDragStart(e, lesson._id)}
          onDragOver={(e) => handleDragOver(e, lesson._id)}
          onDrop={(e) => handleDrop(e, lesson._id)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            dragOverId === lesson._id && draggingId !== lesson._id
              ? "translate-y-1 opacity-60"
              : ""
          }`}
          aria-label={`درس: ${lesson.title}`}
        >
          <LessonCard
            lesson={lesson}
            index={index}
            isDragging={draggingId === lesson._id}
            dragHandleProps={{
              onMouseDown: (e) =>
                e.currentTarget
                  .closest("[draggable]")
                  ?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })),
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onRestore={onRestore}
            onDuplicate={onDuplicate}
            onMove={onMove}
          />
        </div>
      ))}
    </div>
  );
}

export default LessonReorder;
