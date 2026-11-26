import React, { useState } from 'react';
import { Check, Plus, Sparkles } from 'lucide-react';
import { MaterialConfig, MaterialPreset } from '../types/studio';

interface MaterialsViewProps {
  materials: MaterialPreset[];
  activeMeshName: string;
  onApplyToActiveMesh: (preset: MaterialPreset) => void;
  onAddCustomMaterial: (preset: MaterialPreset) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  activeMeshName,
  onApplyToActiveMesh,
  onAddCustomMaterial,
}) => {
  const [selectedId, setSelectedId] = useState<string>(materials[0]?.id ?? 'obsidian-prism');
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('Custom Refractive Coat');
  const [draft, setDraft] = useState<MaterialConfig>({ ...materials[0].config });

  const handleSelectCard = (preset: MaterialPreset) => {
    setSelectedId(preset.id);
    setDraft({ ...preset.config });
  };

  const handleApply = (preset: MaterialPreset) => {
    onApplyToActiveMesh(preset);
    setAppliedId(preset.id);
    window.setTimeout(() => setAppliedId(null), 1800);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = customName.trim() || 'Custom Shader';
    const newId = `custom-${Date.now()}`;
    const newPreset: MaterialPreset = {
      id: newId,
      name: cleanName,
      subtitle: 'User-calibrated PBR optical shader',
      category: draft.transmission > 0.3 ? 'Glass' : draft.metalness > 0.5 ? 'Metal' : 'Stone',
      config: {
        ...draft,
        presetId: newId,
        name: cleanName,
      },
    };
    onAddCustomMaterial(newPreset);
    setSelectedId(newId);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col gap-8">
      <div className="max-w-2xl">
        <h1
          className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white"
          style={{ textWrap: 'balance' }}
        >
          Optical Shader Library
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#94A3B8] leading-relaxed">
          Physically calibrated glass, anodized metal, and architectural stone presets. Apply any material directly to{' '}
          <span className="text-[#38BDF8] font-medium">{activeMeshName}</span> or author a custom optical shader.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Material Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {materials.map((preset) => {
            const isSelected = preset.id === selectedId;
            const isApplied = preset.id === appliedId;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectCard(preset)}
                className={`glass-card-2 rounded-2xl p-5 cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 flex flex-col gap-4 ${
                  isSelected ? 'ring-1 ring-[#38BDF8]/60 bg-[#151824]' : 'bg-[#0E1017]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Procedural Optical Sphere Preview */}
                  <div
                    aria-hidden="true"
                    className="w-14 h-14 rounded-xl shrink-0 relative overflow-hidden border border-white/15"
                    style={{
                      background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,${
                        0.45 * preset.config.clearcoat + 0.15
                      }), ${preset.config.color} 52%, #08080C 92%)`,
                      boxShadow: `inset 0 0 16px ${preset.config.emissive}55, 0 0 20px -6px ${preset.config.emissive}66`,
                    }}
                  >
                    <div
                      className="absolute inset-1 rounded-lg opacity-60"
                      style={{
                        background: `linear-gradient(135deg, ${preset.config.emissive}33, transparent 60%)`,
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-display text-base font-semibold text-white truncate">
                        {preset.name}
                      </h2>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-2">
                      {preset.subtitle}
                    </p>
                  </div>
                </div>

                {/* Unboxed tabular optical metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Metal</span>
                    <span className="font-mono-tabular text-white">
                      {preset.config.metalness.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">Rough</span>
                    <span className="font-mono-tabular text-white">
                      {preset.config.roughness.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">IOR</span>
                    <span className="font-mono-tabular text-white">
                      {preset.config.ior.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(preset);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isApplied
                      ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/50'
                      : 'btn-ghost-glass'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied to {activeMeshName}</span>
                    </>
                  ) : (
                    <span>Apply to Active Mesh</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Shader Authoring Panel */}
        <form
          onSubmit={handleSaveCustom}
          className="lg:col-span-5 glass-card-2 rounded-2xl p-6 bg-[#0E1017] flex flex-col gap-5 sticky top-20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <h2 className="font-display text-lg font-semibold text-white">
                Shader Authoring Lab
              </h2>
            </div>
            <span className="text-xs font-mono-tabular text-[#94A3B8]">
              IOR {draft.ior.toFixed(2)}
            </span>
          </div>

          {/* Large Live CSS Optical Orb Stage */}
          <div className="h-40 rounded-xl bg-[#08080C] border border-white/[0.08] flex items-center justify-center relative overflow-hidden">
            <div
              className="w-24 h-24 rounded-full transition-all duration-200"
              style={{
                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,${
                  0.15 + draft.clearcoat * 0.55
                }), ${draft.color} 48%, #08080C 94%)`,
                boxShadow: `0 0 ${18 + draft.emissiveIntensity * 28}px ${
                  draft.emissive
                }66, inset -8px -10px 24px rgba(0,0,0,0.85)`,
                filter: `saturate(${1 + draft.metalness * 0.3})`,
              }}
            />
            <span className="absolute bottom-2.5 right-3 text-[11px] font-mono-tabular text-[#94A3B8]">
              {draft.color.toUpperCase()} · {draft.emissive.toUpperCase()}
            </span>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="shader-name" className="text-xs text-[#94A3B8]">
              Preset Name
            </label>
            <input
              id="shader-name"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="technical-input h-9 px-3 rounded-lg text-sm text-white"
            />
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between px-3 h-9 rounded-lg bg-[#151824] border border-white/10 text-xs text-[#E2E8F0] cursor-pointer">
              <span>Base Color</span>
              <input
                type="color"
                value={draft.color}
                onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                className="w-5 h-5 bg-transparent border-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between px-3 h-9 rounded-lg bg-[#151824] border border-white/10 text-xs text-[#E2E8F0] cursor-pointer">
              <span>Emission</span>
              <input
                type="color"
                value={draft.emissive}
                onChange={(e) => setDraft({ ...draft, emissive: e.target.value })}
                className="w-5 h-5 bg-transparent border-0 cursor-pointer"
              />
            </label>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-3">
            <LabSlider
              label="Metalness"
              value={draft.metalness}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, metalness: v })}
            />
            <LabSlider
              label="Roughness"
              value={draft.roughness}
              min={0.02}
              max={1}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, roughness: v })}
            />
            <LabSlider
              label="Transmission"
              value={draft.transmission}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, transmission: v })}
            />
            <LabSlider
              label="Index of Refraction (IOR)"
              value={draft.ior}
              min={1.0}
              max={2.4}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, ior: v })}
            />
            <LabSlider
              label="Clearcoat"
              value={draft.clearcoat}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setDraft({ ...draft, clearcoat: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                onApplyToActiveMesh({
                  id: 'draft-live',
                  name: customName.trim() || 'Live Shader',
                  subtitle: 'Live custom shader',
                  category: 'Glass',
                  config: { ...draft, name: customName.trim() || 'Live Shader' },
                })
              }
              className="btn-ghost-glass py-2.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Test on Active Mesh
            </button>
            <button
              type="submit"
              className="btn-primary-glow py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Preset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface LabSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

const LabSlider: React.FC<LabSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#CBD5E1]">{label}</span>
      <span className="font-mono-tabular text-[#94A3B8]">{value.toFixed(2)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="prism-slider w-full"
    />
  </div>
);
