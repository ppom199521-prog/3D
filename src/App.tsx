import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Eye,
  Grid,
  PanelLeft,
  PanelRight,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import {
  INITIAL_RENDERS,
  MATERIAL_PRESETS,
  SCENE_PRESETS,
} from './data/studioPresets';
import {
  CameraViewPreset,
  MaterialConfig,
  MaterialPreset,
  NavScreen,
  RenderJob,
  SceneId,
  SceneNode,
  Vec3,
} from './types/studio';
import { TopBar } from './components/TopBar';
import { ViewportCanvas, ViewportCanvasHandle } from './components/ViewportCanvas';
import { OutlinerDock } from './components/OutlinerDock';
import { InspectorDock } from './components/InspectorDock';
import { ScenesView } from './components/ScenesView';
import { MaterialsView } from './components/MaterialsView';
import { RendersView } from './components/RendersView';
import { ExportRenderModal } from './components/ExportRenderModal';

function cloneNodes(nodes: SceneNode[]): SceneNode[] {
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position },
    rotation: { ...n.rotation },
    scale: { ...n.scale },
    material: n.material ? { ...n.material } : undefined,
    lightConfig: n.lightConfig ? { ...n.lightConfig } : undefined,
  }));
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<NavScreen>('viewport');
  const [activeSceneId, setActiveSceneId] = useState<SceneId>('spectral-prism');

  const activeScene = useMemo(
    () => SCENE_PRESETS.find((s) => s.id === activeSceneId) ?? SCENE_PRESETS[0],
    [activeSceneId]
  );

  const [nodes, setNodes] = useState<SceneNode[]>(() =>
    cloneNodes(SCENE_PRESETS[0].nodes)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    SCENE_PRESETS[0].nodes[0].id
  );
  const [materials, setMaterials] = useState<MaterialPreset[]>(MATERIAL_PRESETS);
  const [renders, setRenders] = useState<RenderJob[]>(INITIAL_RENDERS);

  // Viewport controls
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [autoSpin, setAutoSpin] = useState(true);
  const [cameraPreset, setCameraPreset] =
    useState<CameraViewPreset>('perspective');
  const [cameraTrigger, setCameraTrigger] = useState(0);
  const [showOutliner, setShowOutliner] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const viewportRef = useRef<ViewportCanvasHandle | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const activeMeshNode = useMemo(
    () =>
      selectedNode?.kind === 'mesh'
        ? selectedNode
        : nodes.find((n) => n.kind === 'mesh') ?? nodes[0],
    [nodes, selectedNode]
  );

  const pushNotice = useCallback((msg: string) => {
    setNotice(msg);
    window.setTimeout(() => {
      setNotice((curr) => (curr === msg ? null : curr));
    }, 2600);
  }, []);

  const handleSelectScene = useCallback(
    (sceneId: SceneId) => {
      const nextScene =
        SCENE_PRESETS.find((s) => s.id === sceneId) ?? SCENE_PRESETS[0];
      setActiveSceneId(sceneId);
      setNodes(cloneNodes(nextScene.nodes));
      setSelectedNodeId(nextScene.nodes[0].id);
      setCameraPreset('perspective');
      setCameraTrigger((t) => t + 1);
      setActiveScreen('viewport');
    },
    []
  );

  const handleToggleVisibility = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, visible: !n.visible } : n))
    );
  }, []);

  const handleUpdateTransform = useCallback(
    (nodeId: string, field: 'position' | 'rotation' | 'scale', next: Vec3) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, [field]: next } : n))
      );
    },
    []
  );

  const handleResetTransform = useCallback(
    (nodeId: string) => {
      const original = activeScene.nodes.find((n) => n.id === nodeId);
      if (!original) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                position: { ...original.position },
                rotation: { ...original.rotation },
                scale: { ...original.scale },
              }
            : n
        )
      );
    },
    [activeScene]
  );

  const handleUpdateMaterial = useCallback(
    (nodeId: string, patch: Partial<MaterialConfig>) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId && n.material
            ? { ...n, material: { ...n.material, ...patch } }
            : n
        )
      );
    },
    []
  );

  const handleApplyPresetToNode = useCallback(
    (nodeId: string, preset: MaterialPreset) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, material: { ...preset.config } } : n
        )
      );
    },
    []
  );

  const handleUpdateLight = useCallback(
    (nodeId: string, patch: { color?: string; intensity?: number }) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId && n.lightConfig
            ? { ...n, lightConfig: { ...n.lightConfig, ...patch } }
            : n
        )
      );
    },
    []
  );

  const handleQuickCapture = useCallback(() => {
    const dataUrl =
      viewportRef.current?.captureFrame(1920, 1080, 'PNG') ??
      activeScene.previewImage;
    const now = new Date();
    const stamp = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const newJob: RenderJob = {
      id: `capture-${Date.now()}`,
      title: `${activeScene.title} · Frame`,
      sceneId: activeScene.id,
      sceneTitle: activeScene.title,
      resolution: '1920×1080',
      format: 'PNG',
      samples: 64,
      status: 'completed',
      progress: 100,
      createdAt: `Today ${stamp}`,
      imageUrl: dataUrl,
      shaderMode: activeScene.shaderMode,
    };
    setRenders((prev) => [newJob, ...prev]);
    pushNotice('Viewport frame captured to Renders');
  }, [activeScene, pushNotice]);

  const handleStartExport = useCallback(
    (options: {
      title: string;
      resolution: RenderJob['resolution'];
      format: RenderJob['format'];
      samples: number;
    }) => {
      const dims: Record<RenderJob['resolution'], [number, number]> = {
        '1920×1080': [1920, 1080],
        '2560×1440': [2560, 1440],
        '3840×2160': [3840, 2160],
      };
      const [w, h] = dims[options.resolution];
      const capturedUrl =
        viewportRef.current?.captureFrame(w, h, options.format) ??
        activeScene.previewImage;

      const jobId = `export-${Date.now()}`;
      const now = new Date();
      const stamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const newJob: RenderJob = {
        id: jobId,
        title: options.title,
        sceneId: activeScene.id,
        sceneTitle: activeScene.title,
        resolution: options.resolution,
        format: options.format,
        samples: options.samples,
        status: 'rendering',
        progress: 18,
        createdAt: `Today ${stamp}`,
        imageUrl: capturedUrl,
        shaderMode: activeScene.shaderMode,
      };

      setRenders((prev) => [newJob, ...prev]);
      setActiveScreen('renders');
    },
    [activeScene]
  );

  // Advance any active rendering jobs smoothly
  useEffect(() => {
    const hasRendering = renders.some((r) => r.status === 'rendering');
    if (!hasRendering) return;

    const timer = window.setInterval(() => {
      setRenders((prev) =>
        prev.map((job) => {
          if (job.status !== 'rendering') return job;
          const nextProg = Math.min(100, job.progress + 24);
          return nextProg >= 100
            ? { ...job, progress: 100, status: 'completed' }
            : { ...job, progress: nextProg };
        })
      );
    }, 260);

    return () => window.clearInterval(timer);
  }, [renders]);

  const handleApplyMaterialFromLab = useCallback(
    (preset: MaterialPreset) => {
      if (activeMeshNode) {
        handleApplyPresetToNode(activeMeshNode.id, preset);
        pushNotice(`Applied ${preset.name} to ${activeMeshNode.name}`);
      }
    },
    [activeMeshNode, handleApplyPresetToNode, pushNotice]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#08080C] text-[#E2E8F0]">
      <TopBar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onOpenExport={() => setExportOpen(true)}
      />

      {/* Subtle transient confirmation */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg glass-card-2 text-xs font-medium text-white pointer-events-none"
        >
          {notice}
        </div>
      )}

      <main className="flex-1 flex flex-col">
        {activeScreen === 'viewport' && (
          <div className="relative flex-1 flex flex-col lg:block min-h-[calc(100vh-3.5rem)]">
            {/* 3D WebGL Stage */}
            <div className="relative h-[54vh] min-h-[380px] lg:h-[calc(100vh-3.5rem)] w-full">
              <ViewportCanvas
                ref={viewportRef}
                scenePreset={activeScene}
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                wireframe={wireframe}
                showGrid={showGrid}
                autoSpin={autoSpin}
                cameraPreset={cameraPreset}
                cameraTrigger={cameraTrigger}
                onSelectNode={setSelectedNodeId}
              />

              {/* Subtle unboxed top-center composition readout */}
              <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex items-center gap-2 text-xs text-[#94A3B8] font-mono-tabular">
                <span className="text-[#E2E8F0] font-medium">
                  {activeScene.title}
                </span>
                <span aria-hidden="true" className="text-[#475569]">
                  ·
                </span>
                <span>{activeScene.triCount}</span>
                <span aria-hidden="true" className="text-[#475569]">
                  ·
                </span>
                <span>{activeScene.shaderMode}</span>
              </div>

              {/* Desktop Floating Dock Visibility Toggles */}
              <div className="hidden lg:flex items-center gap-2 absolute top-4 left-4 z-20">
                {!showOutliner && (
                  <button
                    type="button"
                    onClick={() => setShowOutliner(true)}
                    className="glass-panel-1 px-3 py-2 rounded-xl text-xs font-medium text-[#E2E8F0] hover:text-white flex items-center gap-1.5"
                  >
                    <PanelLeft className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Outliner</span>
                  </button>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-2 absolute top-4 right-4 z-20">
                {!showInspector && (
                  <button
                    type="button"
                    onClick={() => setShowInspector(true)}
                    className="glass-panel-1 px-3 py-2 rounded-xl text-xs font-medium text-[#E2E8F0] hover:text-white flex items-center gap-1.5"
                  >
                    <PanelRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Inspector</span>
                  </button>
                )}
              </div>

              {/* Bottom Center Floating Camera & Viewport Toolbar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[95vw] overflow-x-auto">
                <div className="glass-panel-1 rounded-xl p-1.5 flex items-center gap-1 shadow-[0_12px_32px_rgba(0,0,0,0.75)]">
                  {(
                    [
                      { id: 'perspective', label: 'Persp' },
                      { id: 'front', label: 'Front' },
                      { id: 'top', label: 'Top' },
                      { id: 'isometric', label: 'Iso' },
                    ] as { id: CameraViewPreset; label: string }[]
                  ).map((cam) => {
                    const active = cameraPreset === cam.id;
                    return (
                      <button
                        key={cam.id}
                        type="button"
                        onClick={() => {
                          setCameraPreset(cam.id);
                          setCameraTrigger((t) => t + 1);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                          active
                            ? 'bg-[#1E2235] text-white ring-1 ring-[#38BDF8]/40'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {cam.label}
                      </button>
                    );
                  })}

                  <span
                    aria-hidden="true"
                    className="w-px h-4 bg-white/10 mx-1 shrink-0"
                  />

                  <button
                    type="button"
                    onClick={() => setAutoSpin((s) => !s)}
                    title={autoSpin ? 'Pause orbit spin' : 'Resume orbit spin'}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors ${
                      autoSpin
                        ? 'text-[#38BDF8] bg-[#38BDF8]/10'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {autoSpin ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Orbit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWireframe((w) => !w)}
                    title="Toggle wireframe mesh"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors ${
                      wireframe
                        ? 'text-[#8B5CF6] bg-[#8B5CF6]/15'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Wire</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowGrid((g) => !g)}
                    title="Toggle spatial grid"
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors ${
                      showGrid
                        ? 'text-[#E2E8F0] bg-white/[0.06]'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => viewportRef.current?.resetCamera()}
                    title="Reset camera framing"
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <span
                    aria-hidden="true"
                    className="w-px h-4 bg-white/10 mx-1 shrink-0"
                  />

                  <button
                    type="button"
                    onClick={handleQuickCapture}
                    className="btn-primary-glow px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Left Outliner Dock (Floating on Desktop, Stacked on Mobile/Tablet) */}
            {showOutliner && (
              <div className="p-4 lg:p-0 lg:absolute lg:top-5 lg:left-5 lg:z-20">
                <OutlinerDock
                  scenes={SCENE_PRESETS}
                  activeSceneId={activeSceneId}
                  nodes={nodes}
                  selectedNodeId={selectedNodeId}
                  onSelectScene={handleSelectScene}
                  onSelectNode={setSelectedNodeId}
                  onToggleVisibility={handleToggleVisibility}
                  onCollapse={() => setShowOutliner(false)}
                />
              </div>
            )}

            {/* Right Inspector Dock (Floating on Desktop, Stacked on Mobile/Tablet) */}
            {showInspector && (
              <div className="px-4 pb-6 lg:p-0 lg:absolute lg:top-5 lg:right-5 lg:z-20">
                <InspectorDock
                  selectedNode={selectedNode}
                  materialPresets={materials}
                  onUpdateTransform={handleUpdateTransform}
                  onResetTransform={handleResetTransform}
                  onUpdateMaterial={handleUpdateMaterial}
                  onApplyPresetToNode={handleApplyPresetToNode}
                  onUpdateLight={handleUpdateLight}
                  onCollapse={() => setShowInspector(false)}
                />
              </div>
            )}
          </div>
        )}

        {activeScreen === 'scenes' && (
          <ScenesView
            scenes={SCENE_PRESETS}
            activeSceneId={activeSceneId}
            onLoadScene={handleSelectScene}
          />
        )}

        {activeScreen === 'materials' && (
          <MaterialsView
            materials={materials}
            activeMeshName={activeMeshNode?.name ?? 'Active Mesh'}
            onApplyToActiveMesh={handleApplyMaterialFromLab}
            onAddCustomMaterial={(preset) => {
              setMaterials((prev) => [preset, ...prev]);
              pushNotice(`Saved ${preset.name} to library`);
            }}
          />
        )}

        {activeScreen === 'renders' && (
          <RendersView
            renders={renders}
            onDeleteRender={(id) =>
              setRenders((prev) => prev.filter((r) => r.id !== id))
            }
            onOpenExportModal={() => setExportOpen(true)}
          />
        )}
      </main>

      <ExportRenderModal
        open={exportOpen}
        scene={activeScene}
        onClose={() => setExportOpen(false)}
        onStartExport={handleStartExport}
      />
    </div>
  );
}
