import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RenderJob, ScenePreset } from '../types/studio';

interface ExportRenderModalProps {
  open: boolean;
  scene: ScenePreset;
  onClose: () => void;
  onStartExport: (options: {
    title: string;
    resolution: RenderJob['resolution'];
    format: RenderJob['format'];
    samples: number;
  }) => void;
}

export const ExportRenderModal: React.FC<ExportRenderModalProps> = ({
  open,
  scene,
  onClose,
  onStartExport,
}) => {
  const [title, setTitle] = useState(`${scene.title} · Studio Pass`);
  const [resolution, setResolution] =
    useState<RenderJob['resolution']>('2560×1440');
  const [format, setFormat] = useState<RenderJob['format']>('PNG');
  const [samples, setSamples] = useState<number>(128);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartExport({
      title: title.trim() || `${scene.title} Render`,
      resolution,
      format,
      samples,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Scene Render"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="glass-modal-3 w-full max-w-md rounded-3xl p-6 flex flex-col gap-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Export Scene Frame
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Captures the active 3D viewport camera and optical shader state.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close export dialog"
            onClick={onClose}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="export-title" className="text-xs text-[#CBD5E1]">
            Render Title
          </label>
          <input
            id="export-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="technical-input h-9 px-3 rounded-lg text-sm text-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-[#CBD5E1]">Output Resolution</span>
          <div className="grid grid-cols-3 gap-2">
            {(['1920×1080', '2560×1440', '3840×2160'] as RenderJob['resolution'][]).map(
              (res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-2 px-2 rounded-lg text-xs font-mono-tabular border transition-colors ${
                    resolution === res
                      ? 'bg-[#151824] border-[#38BDF8] text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                      : 'bg-[#0E1017] border-white/10 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {res}
                </button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[#CBD5E1]">Format</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(['PNG', 'WebP'] as RenderJob['format'][]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                    format === fmt
                      ? 'bg-[#151824] border-[#38BDF8] text-white'
                      : 'bg-[#0E1017] border-white/10 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[#CBD5E1]">Sample Passes</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[64, 128, 256].map((spp) => (
                <button
                  key={spp}
                  type="button"
                  onClick={() => setSamples(spp)}
                  className={`py-2 rounded-lg text-xs font-mono-tabular border transition-colors ${
                    samples === spp
                      ? 'bg-[#151824] border-[#8B5CF6] text-white'
                      : 'bg-[#0E1017] border-white/10 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {spp}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-glass px-4 py-2 rounded-lg text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary-glow px-5 py-2 rounded-lg text-xs font-semibold"
          >
            Render &amp; Queue
          </button>
        </div>
      </form>
    </div>
  );
};
