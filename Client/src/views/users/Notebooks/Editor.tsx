"use client";

import { useRef, useState } from "react";

type Block = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  z: number;
};

const PAGE_W = 793;
const PAGE_H = 1122;

function uid() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

export default function Editor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const [zCounter, setZCounter] = useState(1);
  const pageRef = useRef<HTMLDivElement>(null);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBlocks(prev => [...prev, {
      id: uid(),
      x: clamp(x - 100, 0, PAGE_W - 200),
      y: clamp(y - 60, 0, PAGE_H - 120),
      width: 200,
      height: 120,
      content: "",
      z: zCounter + 1,
    }]);
    setZCounter(z => z + 1);
  };

  const bringToFront = (id: string) => {
    setZCounter(z => z + 1);
    setBlocks(prev => prev.map(b => b.id === id ? ({ ...b, z: zCounter + 1 }) : b));
  };

  const deleteBlock = (id: string) => setBlocks(prev => prev.filter(b => b.id !== id));
  const updateContent = (id: string, html: string) => setBlocks(prev => prev.map(b => b.id === id ? ({ ...b, content: html }) : b));

  // drag
  const startDrag = (e: React.PointerEvent, id: string, left: number, top: number) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    bringToFront(id);
    const rect = pageRef.current!.getBoundingClientRect();
    setDragging({ id, dx: e.clientX - (rect.left + left), dy: e.clientY - (rect.top + top) });
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragging || !pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    setBlocks(prev => prev.map(b => {
      if (b.id !== dragging.id) return b;
      let nx = e.clientX - rect.left - dragging.dx;
      let ny = e.clientY - rect.top - dragging.dy;
      nx = clamp(nx, 0, PAGE_W - b.width);
      ny = clamp(ny, 0, PAGE_H - b.height);
      return { ...b, x: nx, y: ny };
    }));
  };
  const endDrag = (e: React.PointerEvent) => {
    if (!dragging) return;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    setDragging(null);
  };

  // resize
  const startResize = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const blk = blocks.find(b => b.id === id);
    if (!blk) return;
    bringToFront(id);
    setResizing({ id, startX: e.clientX, startY: e.clientY, startW: blk.width, startH: blk.height });
  };
  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizing || !pageRef.current) return;
    setBlocks(prev => prev.map(b => {
      if (b.id !== resizing.id) return b;
      let newW = resizing.startW + (e.clientX - resizing.startX);
      let newH = resizing.startH + (e.clientY - resizing.startY);
      newW = Math.max(100, Math.min(newW, PAGE_W - b.x)); // min + clamp
      newH = Math.max(60, Math.min(newH, PAGE_H - b.y));
      return { ...b, width: newW, height: newH };
    }));
  };
  const endResize = (e: React.PointerEvent) => {
    if (!resizing) return;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    setResizing(null);
  };

  return (
    <div className="w-full h-full flex justify-center py-10 bg-background text-foreground overflow-auto">
      <div
        ref={pageRef}
        onClick={handlePageClick}
        className="relative bg-card border border-border shadow-sm"
        style={{ width: PAGE_W, height: PAGE_H, cursor: "crosshair", userSelect: dragging || resizing ? "none" : "auto" }}
        onPointerMove={(e) => { onDragMove(e); onResizeMove(e); }}
        onPointerUp={(e) => { endDrag(e); endResize(e); }}
      >
        {blocks.map(b => (
          <div
            key={b.id}
            className="absolute border border-border shadow-sm rounded-sm flex flex-col bg-background"
            style={{ left: b.x, top: b.y, width: b.width, height: b.height, zIndex: b.z }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER (drag handle) */}
            <div
              onPointerDown={(e) => startDrag(e, b.id, b.x, b.y)}
              className="h-6 w-full bg-accent/40 border-b border-border rounded-t-sm flex items-center justify-between px-2 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <span className="text-[10px] text-muted-foreground">drag</span>
              <button
                onPointerDown={(e) => e.stopPropagation()}       // prevent drag start
                onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}
                className="h-4 w-4 flex items-center justify-center bg-destructive text-white rounded text-[10px] leading-none"
                title="Delete"
              >
                –
              </button>
            </div>

            {/* CONTENT (constrained) */}
            <div
              contentEditable
              suppressContentEditableWarning
              className="flex-1 p-2 text-sm outline-none cursor-text overflow-auto whitespace-pre-wrap break-words"
              onInput={(e) => updateContent(b.id, (e.target as HTMLDivElement).innerHTML)}
              onPointerDown={(e) => e.stopPropagation()} // allow text selection; no drag
            />

            {/* RESIZE HANDLE */}
            <div
              onPointerDown={(e) => startResize(e, b.id)}
              className="absolute bottom-0 right-0 h-3 w-3 border-l border-t border-border bg-accent/70 cursor-nwse-resize"
              style={{ touchAction: "none" }}
              title="Resize"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
