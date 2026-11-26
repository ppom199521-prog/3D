import React, { useState } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';
import { SceneCategory, SceneId, ScenePreset } from '../types/studio';

interface ScenesViewProps {
  scenes: ScenePreset[];
  activeSceneId: SceneId;
  onLoadScene: (sceneId: SceneId) => void;
}

const FILTER_TABS: { id: SceneCategory; label: string }[] = [
  { id: 'all', label: 'All Scenes' },
  { id: 'optical-glass', label: 'Optical Glass' },
  { id: 'sculptural', label: 'Sculptural' },
  { id: 'architectural', label: 'Architectural' },
];

export const ScenesView: React.FC<ScenesViewProps> = ({
  scenes,
  activeSceneId,
  onLoadScene,
}) => {
  const [category, setCategory] = useState<SceneCategory>('all');
  const [inspectScene, setInspectScene] = useState<ScenePreset | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filtered =
    category === 'all'
      ? scenes
      : scenes.filter((s) => s.category === category);

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      {/* Header + Segmented Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1
            className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Spatial Scene Library
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#94A3B8] leading-relaxed">
            Curated architectural pavilions, optical glass studies, and kinetic assemblies ready to inspect or customize in the real-time viewport.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter scenes by category"
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0E1017] border border-white/[0.08] self-start md:self-auto"
        >
          {FILTER_TABS.map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'bg-[#1E2235] text-white shadow-sm ring-1 ring-[#38BDF8]/30'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewport Frame Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((scene) => {
          const isCurrent = scene.id === activeSceneId;
          const isBroken = brokenImages[scene.id];
          return (
            <article
              key={scene.id}
              className="glass-card-2 rounded-2xl overflow-hidden flex flex-col bg-[#0E1017]"
            >
              {/* 16:9 Scene Preview Stage with Frosted Header */}
              <div className="relative aspect-video w-full bg-[#08080C] overflow-hidden group">
                {!isBroken ? (
                  <img
                    src={scene.previewImage}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [scene.id]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0E1017] via-[#151824] to-[#1E2235] flex items-center justify-center">
                    <span className="font-display text-sm text-[#94A3B8]">
                      {scene.title}
                    </span>
                  </div>
                )}

                {/* Scrim + Top Frosted Specular Header */}
                <div className="absolute inset-x-0 top-0 px-4 py-2.5 bg-[#08080C]/65 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#CBD5E1] truncate">
                    <span>{scene.triCount}</span>
                    <span aria-hidden="true" className="text-[#475569]">
                      ·
                    </span>
                    <span>{scene.shaderMode}</span>
                    <span aria-hidden="true" className="text-[#475569]">
                      ·
                    </span>
                    <span>{scene.aspectRatio}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-xs font-medium text-[#38BDF8] whitespace-nowrap shrink-0">
                      Loaded in Viewport
                    </span>
                  )}
                </div>

                {/* Subtle bottom gradient for polish */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0E1017] to-transparent pointer-events-none"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {scene.title}
                  </h2>
                  <p className="mt-1.5 text-sm text-[#94A3B8] leading-relaxed">
                    {scene.description}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setInspectScene(scene)}
                    className="btn-ghost-glass px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Inspect Render</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onLoadScene(scene.id)}
                    className="btn-primary-glow px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Open in Viewport</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Showreel Inspection Modal (Level 3) */}
      {inspectScene && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Inspect ${inspectScene.title}`}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setInspectScene(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-modal-3 w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {inspectScene.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono-tabular mt-0.5">
                  {inspectScene.triCount} · {inspectScene.shaderMode} ·{' '}
                  {inspectScene.nodes.length} scene nodes
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setInspectScene(null)}
                className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.08]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full bg-[#08080C] overflow-hidden">
              <img
                src={inspectScene.previewImage}
                alt={inspectScene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151824]/90">
              <div className="max-w-xl">
                <p className="text-sm text-[#E2E8F0]">{inspectScene.description}</p>
                <p className="text-xs text-[#94A3B8] mt-1.5">
                  Lighting Rig: {inspectScene.lightingNotes}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLoadScene(inspectScene.id);
                  setInspectScene(null);
                }}
                className="btn-primary-glow px-5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 self-start md:self-center"
              >
                Load into 3D Viewport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
