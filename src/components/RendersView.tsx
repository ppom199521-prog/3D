import React, { useState } from 'react';
import { Download, Maximize2, Trash2, X } from 'lucide-react';
import { RenderJob } from '../types/studio';

interface RendersViewProps {
  renders: RenderJob[];
  onDeleteRender: (id: string) => void;
  onOpenExportModal: () => void;
}

type ResFilter = 'all' | '3840×2160' | '2560×1440' | '1920×1080';

export const RendersView: React.FC<RendersViewProps> = ({
  renders,
  onDeleteRender,
  onOpenExportModal,
}) => {
  const [resFilter, setResFilter] = useState<ResFilter>('all');
  const [lightboxJob, setLightboxJob] = useState<RenderJob | null>(null);

  const filtered =
    resFilter === 'all'
      ? renders
      : renders.filter((r) => r.resolution === resFilter);

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      {/* Header + Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Render Queue &amp; Captures
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#94A3B8] leading-relaxed">
            High-resolution frames captured directly from the WebGL stage alongside studio reference passes.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter renders by resolution"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0E1017] border border-white/[0.08] self-start md:self-auto"
        >
          {(
            [
              { id: 'all', label: 'All Passes' },
              { id: '3840×2160', label: '4K' },
              { id: '2560×1440', label: '2K' },
              { id: '1920×1080', label: '1080p' },
            ] as { id: ResFilter; label: string }[]
          ).map((tab) => {
            const active = resFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setResFilter(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#1E2235] text-white ring-1 ring-[#38BDF8]/30'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-card-2 rounded-2xl p-12 bg-[#0E1017] flex flex-col items-center justify-center text-center gap-4">
          <h2 className="font-display text-xl font-semibold text-white">
            No matching renders in queue
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-md">
            Capture a live frame from the 3D Viewport or launch a new high-resolution export pass.
          </p>
          <button
            type="button"
            onClick={onOpenExportModal}
            className="btn-primary-glow px-5 py-2.5 rounded-lg text-xs font-semibold"
          >
            New Render Pass
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <article
              key={job.id}
              className="glass-card-2 rounded-2xl overflow-hidden bg-[#0E1017] flex flex-col"
            >
              <div className="relative aspect-video w-full bg-[#08080C] overflow-hidden">
                <img
                  src={job.imageUrl}
                  alt={job.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Render Progress Overlay while active */}
                {job.status === 'rendering' && (
                  <div className="absolute inset-0 bg-[#08080C]/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 px-8">
                    <span className="text-xs font-medium text-white">
                      Rendering {job.resolution} · {job.samples} Samples
                    </span>
                    <div className="w-full max-w-xs h-1.5 rounded-full bg-[#1E2235] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] transition-all duration-200"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="font-mono-tabular text-xs text-[#38BDF8]">
                      {job.progress}%
                    </span>
                  </div>
                )}

                {/* Frosted top metadata bar */}
                <div className="absolute inset-x-0 top-0 px-4 py-2.5 bg-[#08080C]/65 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#CBD5E1] truncate">
                    <span>{job.resolution}</span>
                    <span aria-hidden="true" className="text-[#475569]">
                      ·
                    </span>
                    <span>{job.format}</span>
                    <span aria-hidden="true" className="text-[#475569]">
                      ·
                    </span>
                    <span>{job.samples} spp</span>
                  </div>
                  <span className="text-xs text-[#94A3B8] font-mono-tabular shrink-0">
                    {job.createdAt}
                  </span>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold text-white truncate">
                    {job.title}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5 truncate">
                    {job.sceneTitle} · {job.shaderMode}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={`Inspect ${job.title}`}
                    onClick={() => setLightboxJob(job)}
                    className="btn-ghost-glass p-2 rounded-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={job.imageUrl}
                    download={`${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${job.format.toLowerCase()}`}
                    aria-label={`Download ${job.title}`}
                    className="btn-primary-glow px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <button
                    type="button"
                    aria-label={`Remove ${job.title}`}
                    onClick={() => onDeleteRender(job.id)}
                    className="p-2 rounded-lg text-[#94A3B8] hover:text-[#FFB4AB] hover:bg-white/[0.05] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxJob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxJob.title}
          onClick={() => setLightboxJob(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-modal-3 w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {lightboxJob.title}
                </h3>
                <p className="text-xs font-mono-tabular text-[#94A3B8]">
                  {lightboxJob.resolution} · {lightboxJob.format} · {lightboxJob.samples} Samples
                </p>
              </div>
              <button
                type="button"
                aria-label="Close lightbox"
                onClick={() => setLightboxJob(null)}
                className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-[#08080C]">
              <img
                src={lightboxJob.imageUrl}
                alt={lightboxJob.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
