import React from 'react';
import { PanelRightClose, RotateCcw, Sliders, Sparkles, Sun } from 'lucide-react';
import { MaterialConfig, MaterialPreset, SceneNode, Vec3 } from '../types/studio';
import { ScrubbableNumberInput } from './ScrubbableNumberInput';

interface InspectorDockProps {
  selectedNode: SceneNode | undefined;
  materialPresets: MaterialPreset[];
  onUpdateTransform: (
    nodeId: string,
    field: 'position' | 'rotation' | 'scale',
    next: Vec3
  ) => void;
  onResetTransform: (nodeId: string) => void;
  onUpdateMaterial: (nodeId: string, patch: Partial<MaterialConfig>) => void;
  onApplyPresetToNode: (nodeId: string, preset: MaterialPreset) => void;
  onUpdateLight: (
    nodeId: string,
    patch: { color?: string; intensity?: number }
  ) => void;
  onCollapse?: () => void;
}

const COLOR_SWATCHES = [
  { label: 'Obsidian Slate', hex: '#162438' },
  { label: 'Electric Cyan', hex: '#38BDF8' },
  { label: 'Ultraviolet', hex: '#8B5CF6' },
  { label: 'Deep Cobalt', hex: '#2563EB' },
  { label: 'Platinum', hex: '#CBD5E1' },
];

export const InspectorDock: React.FC<InspectorDockProps> = ({
  selectedNode,
  materialPresets,
  onUpdateTransform,
  onResetTransform,
  onUpdateMaterial,
  onApplyPresetToNode,
  onUpdateLight,
  onCollapse,
}) => {
  if (!selectedNode) {
    return (
      <aside className="glass-panel-1 w-full lg:w-[308px] rounded-2xl p-4">
        <p className="text-xs text-[#94A3B8]">
          Select an object or light in the outliner to inspect its spatial properties.
        </p>
      </aside>
    );
  }

  const updateAxis = (
    field: 'position' | 'rotation' | 'scale',
    axis: keyof Vec3,
    val: number
  ) => {
    onUpdateTransform(selectedNode.id, field, {
      ...selectedNode[field],
      [axis]: val,
    });
  };

  return (
    <aside
      aria-label="Object Inspector"
      className="glass-panel-1 w-full lg:w-[308px] rounded-2xl p-4 flex flex-col gap-4 max-h-[calc(100vh-7.5rem)] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {selectedNode.kind === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            ) : (
              <Sliders className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            )}
            <h2 className="font-display text-sm font-semibold text-white truncate">
              {selectedNode.name}
            </h2>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            {selectedNode.kind === 'light' ? 'Studio Light Source' : 'Spatial Mesh Node'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onResetTransform(selectedNode.id)}
            title="Reset Transform"
            className="btn-ghost-glass px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onCollapse && (
            <button
              type="button"
              aria-label="Collapse inspector"
              onClick={onCollapse}
              className="hidden lg:inline-flex p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Transform XYZ */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
          Transform
        </h3>

        {/* Position */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[#94A3B8]">Position (m)</span>
          <div className="grid grid-cols-3 gap-1.5">
            <ScrubbableNumberInput
              axis="X"
              value={selectedNode.position.x}
              step={0.08}
              min={-8}
              max={8}
              onChange={(v) => updateAxis('position', 'x', v)}
            />
            <ScrubbableNumberInput
              axis="Y"
              value={selectedNode.position.y}
              step={0.08}
              min={-5}
              max={8}
              onChange={(v) => updateAxis('position', 'y', v)}
            />
            <ScrubbableNumberInput
              axis="Z"
              value={selectedNode.position.z}
              step={0.08}
              min={-8}
              max={8}
              onChange={(v) => updateAxis('position', 'z', v)}
            />
          </div>
        </div>

        {/* Rotation */}
        {selectedNode.kind === 'mesh' && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#94A3B8]">Rotation (deg)</span>
            <div className="grid grid-cols-3 gap-1.5">
              <ScrubbableNumberInput
                axis="X"
                value={selectedNode.rotation.x}
                step={2}
                min={-180}
                max={180}
                precision={0}
                onChange={(v) => updateAxis('rotation', 'x', v)}
              />
              <ScrubbableNumberInput
                axis="Y"
                value={selectedNode.rotation.y}
                step={2}
                min={-180}
                max={180}
                precision={0}
                onChange={(v) => updateAxis('rotation', 'y', v)}
              />
              <ScrubbableNumberInput
                axis="Z"
                value={selectedNode.rotation.z}
                step={2}
                min={-180}
                max={180}
                precision={0}
                onChange={(v) => updateAxis('rotation', 'z', v)}
              />
            </div>
          </div>
        )}

        {/* Scale */}
        {selectedNode.kind === 'mesh' && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-[#94A3B8]">Scale</span>
            <div className="grid grid-cols-3 gap-1.5">
              <ScrubbableNumberInput
                axis="X"
                value={selectedNode.scale.x}
                step={0.04}
                min={0.2}
                max={6}
                onChange={(v) => updateAxis('scale', 'x', v)}
              />
              <ScrubbableNumberInput
                axis="Y"
                value={selectedNode.scale.y}
                step={0.04}
                min={0.2}
                max={6}
                onChange={(v) => updateAxis('scale', 'y', v)}
              />
              <ScrubbableNumberInput
                axis="Z"
                value={selectedNode.scale.z}
                step={0.04}
                min={0.2}
                max={6}
                onChange={(v) => updateAxis('scale', 'z', v)}
              />
            </div>
          </div>
        )}
      </section>

      {/* Material Shader Controls */}
      {selectedNode.kind === 'mesh' && selectedNode.material && (
        <>
          <div className="h-px bg-white/[0.06]" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                Optical Shader
              </h3>
              <span className="text-[11px] text-[#38BDF8] font-medium truncate max-w-[140px]">
                {selectedNode.material.name}
              </span>
            </div>

            {/* Preset Switcher */}
            <select
              aria-label="Material Preset"
              value={selectedNode.material.presetId}
              onChange={(e) => {
                const found = materialPresets.find((m) => m.id === e.target.value);
                if (found) onApplyPresetToNode(selectedNode.id, found);
              }}
              className="technical-input h-9 px-2.5 rounded-lg text-xs font-medium text-white cursor-pointer"
            >
              {materialPresets.map((preset) => (
                <option
                  key={preset.id}
                  value={preset.id}
                  className="bg-[#151824] text-white"
                >
                  {preset.name}
                </option>
              ))}
            </select>

            {/* Surface Tint Swatches */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Base Tint</span>
              <div className="flex items-center gap-1.5">
                {COLOR_SWATCHES.map((swatch) => {
                  const active =
                    selectedNode.material?.color.toLowerCase() ===
                    swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      title={swatch.label}
                      aria-label={`Set tint to ${swatch.label}`}
                      onClick={() =>
                        onUpdateMaterial(selectedNode.id, { color: swatch.hex })
                      }
                      className={`w-5 h-5 rounded-md border transition-transform ${
                        active
                          ? 'border-[#38BDF8] scale-110 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Parameter Sliders */}
            <SliderRow
              label="Metalness"
              value={selectedNode.material.metalness}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateMaterial(selectedNode.id, { metalness: v })}
            />
            <SliderRow
              label="Roughness"
              value={selectedNode.material.roughness}
              min={0.02}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateMaterial(selectedNode.id, { roughness: v })}
            />
            <SliderRow
              label="Transmission"
              value={selectedNode.material.transmission}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateMaterial(selectedNode.id, { transmission: v })}
            />
            <SliderRow
              label="Clearcoat"
              value={selectedNode.material.clearcoat}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => onUpdateMaterial(selectedNode.id, { clearcoat: v })}
            />
            <SliderRow
              label="Emission Glow"
              value={selectedNode.material.emissiveIntensity}
              min={0}
              max={1.5}
              step={0.02}
              onChange={(v) =>
                onUpdateMaterial(selectedNode.id, { emissiveIntensity: v })
              }
            />
          </section>
        </>
      )}

      {/* Light Rig Controls */}
      {selectedNode.kind === 'light' && selectedNode.lightConfig && (
        <>
          <div className="h-px bg-white/[0.06]" />
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <h3 className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                Light Emission
              </h3>
            </div>

            <SliderRow
              label="Intensity"
              value={selectedNode.lightConfig.intensity}
              min={0}
              max={8}
              step={0.1}
              onChange={(v) => onUpdateLight(selectedNode.id, { intensity: v })}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Spectrum</span>
              <div className="flex items-center gap-1.5">
                {['#7BD0FF', '#38BDF8', '#8B5CF6', '#2563EB', '#F8FAFC'].map(
                  (hex) => {
                    const active =
                      selectedNode.lightConfig?.color.toLowerCase() ===
                      hex.toLowerCase();
                    return (
                      <button
                        key={hex}
                        type="button"
                        aria-label={`Set light spectrum ${hex}`}
                        onClick={() => onUpdateLight(selectedNode.id, { color: hex })}
                        className={`w-5 h-5 rounded-md border ${
                          active
                            ? 'border-white scale-110 shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  }
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </aside>
  );
};

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#CBD5E1]">{label}</span>
        <span className="font-mono-tabular text-[#94A3B8]">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="prism-slider w-full"
      />
    </div>
  );
};
