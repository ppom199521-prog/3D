import React, { useEffect, useRef, useState } from 'react';

interface ScrubbableNumberInputProps {
  axis: 'X' | 'Y' | 'Z';
  value: number;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  onChange: (nextValue: number) => void;
}

const AXIS_ACCENT: Record<'X' | 'Y' | 'Z', string> = {
  X: '#38BDF8', // Electric Cyan
  Y: '#8B5CF6', // Ultraviolet
  Z: '#F59E0B', // Amber
};

export const ScrubbableNumberInput: React.FC<ScrubbableNumberInputProps> = ({
  axis,
  value,
  step = 0.05,
  min,
  max,
  precision = 2,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value.toFixed(precision));
  const dragState = useRef<{ startX: number; startVal: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(value.toFixed(precision));
    }
  }, [value, precision, editing]);

  const clampValue = (num: number) => {
    let next = num;
    if (typeof min === 'number') next = Math.max(min, next);
    if (typeof max === 'number') next = Math.min(max, next);
    return Number(next.toFixed(precision));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startVal: value,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 2) {
      dragState.current.moved = true;
    }
    if (dragState.current.moved) {
      const sensitivity = e.shiftKey ? step * 0.25 : step;
      const next = clampValue(dragState.current.startVal + dx * sensitivity * 0.35);
      onChange(next);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const wasMoved = dragState.current.moved;
    dragState.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
    if (!wasMoved) {
      setEditing(true);
    }
  };

  const commitDraft = () => {
    const parsed = parseFloat(draft);
    if (!Number.isNaN(parsed)) {
      onChange(clampValue(parsed));
    } else {
      setDraft(value.toFixed(precision));
    }
    setEditing(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title={`Drag horizontally to scrub ${axis}, or click to enter value`}
      className="relative h-9 rounded-lg bg-[#0E1017] border border-white/10 hover:border-white/20 focus-within:border-[#38BDF8] flex items-center px-2 gap-1.5 select-none cursor-ew-resize overflow-hidden transition-colors"
    >
      <span
        className="text-[11px] font-display font-semibold shrink-0"
        style={{ color: AXIS_ACCENT[axis] }}
      >
        {axis}
      </span>

      {editing ? (
        <input
          type="text"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitDraft();
            if (e.key === 'Escape') {
              setDraft(value.toFixed(precision));
              setEditing(false);
            }
          }}
          className="w-full bg-transparent text-[13px] font-mono-tabular text-white focus:outline-none text-right"
        />
      ) : (
        <span className="w-full text-[13px] font-mono-tabular text-[#E2E8F0] text-right truncate">
          {value.toFixed(precision)}
        </span>
      )}

      {/* Bottom scrubbable ultraviolet accent line */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#8B5CF6]/70 rounded-full pointer-events-none"
      />
    </div>
  );
};
