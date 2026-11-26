import React from 'react';
import { Box, Eye, EyeOff, Layers, PanelLeftClose, Sun } from 'lucide-react';
import { SceneId, SceneNode, ScenePreset } from '../types/studio';

interface OutlinerDockProps {
  scenes: ScenePreset[];
  activeSceneId: SceneId;
  nodes: SceneNode[];
  selectedNodeId: string;
  onSelectScene: (sceneId: SceneId) => void;
  onSelectNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string) => void;
  onCollapse?: () => void;
}

export const OutlinerDock: React.FC<OutlinerDockProps> = ({
  scenes,
  activeSceneId,
  nodes,
  selectedNodeId,
  onSelectScene,
  onSelectNode,
  onToggleVisibility,
  onCollapse,
}) => {
  return (
    <aside
      aria-label="Scene Outliner"
      className="glass-panel-1 w-full lg:w-[264px] rounded-2xl p-4 flex flex-col gap-3 max-h-[calc(100vh-7.5rem)] overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-[#E2E8F0]">
            Scene Outliner
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-tabular text-[#94A3B8]">
            {nodes.length}
          </span>
          {onCollapse && (
            <button
              type="button"
              aria-label="Collapse outliner"
              onClick={onCollapse}
              className="hidden lg:inline-flex p-1 rounded text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scene Switcher */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="viewport-scene-select"
          className="text-[11px] font-medium text-[#94A3B8]"
        >
          Active Composition
        </label>
        <select
          id="viewport-scene-select"
          value={activeSceneId}
          onChange={(e) => onSelectScene(e.target.value as SceneId)}
          className="technical-input h-9 px-2.5 rounded-lg text-xs font-medium text-white cursor-pointer"
        >
          {scenes.map((scene) => (
            <option key={scene.id} value={scene.id} className="bg-[#151824] text-white">
              {scene.title}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Hierarchical Outliner List */}
      <div className="flex flex-col gap-0.5" role="tree" aria-label="Hierarchy nodes">
        <div className="h-7 px-2 flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]/70" />
          <span className="truncate">World Stage Root</span>
        </div>

        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const indentPx = node.depth * 14;
          return (
            <div
              key={node.id}
              role="treeitem"
              aria-selected={isSelected}
              className={`group relative h-8 rounded-lg flex items-center justify-between pr-1.5 transition-colors duration-150 ${
                isSelected
                  ? 'bg-[#1E2235] text-white ring-1 ring-[#38BDF8]/40'
                  : 'text-[#CBD5E1] hover:bg-white/[0.04]'
              }`}
              style={{ paddingLeft: `${indentPx + 8}px` }}
            >
              {/* Translucent vertical hierarchy guide track */}
              {node.depth > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px bg-white/[0.06]"
                  style={{ left: `${indentPx - 2}px` }}
                />
              )}

              <button
                type="button"
                onClick={() => onSelectNode(node.id)}
                className="flex-1 min-w-0 h-full flex items-center gap-2 text-left focus-visible:outline-none"
              >
                {node.kind === 'light' ? (
                  <Sun
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-[#8B5CF6]' : 'text-[#94A3B8]'
                    }`}
                  />
                ) : (
                  <Box
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isSelected ? 'text-[#38BDF8]' : 'text-[#94A3B8]'
                    }`}
                  />
                )}
                <span
                  className={`text-[13px] truncate ${
                    !node.visible ? 'opacity-45 line-through' : ''
                  }`}
                >
                  {node.name}
                </span>
              </button>

              <button
                type="button"
                aria-label={`${node.visible ? 'Hide' : 'Show'} ${node.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(node.id);
                }}
                className="p-1.5 rounded text-[#94A3B8] hover:text-white hover:bg-white/[0.06] shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
              >
                {node.visible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#475569]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
