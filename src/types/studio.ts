export type NavScreen = 'viewport' | 'scenes' | 'materials' | 'renders';

export type SceneId =
  | 'spectral-prism'
  | 'kinetic-gyro'
  | 'obsidian-monolith'
  | 'cobalt-atrium';

export type SceneCategory = 'all' | 'optical-glass' | 'sculptural' | 'architectural';

export type CameraViewPreset = 'perspective' | 'front' | 'top' | 'isometric';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MaterialConfig {
  presetId: string;
  name: string;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
  transmission: number;
  ior: number;
  clearcoat: number;
  opacity: number;
}

export type MeshGeometryType =
  | 'octahedron'
  | 'prism-core'
  | 'basalt-plinth'
  | 'caustic-ring'
  | 'gyro-outer'
  | 'gyro-mid'
  | 'gyro-inner'
  | 'gyro-core'
  | 'monolith-slab'
  | 'monolith-tower'
  | 'monolith-fin'
  | 'atrium-steps'
  | 'atrium-colonnade'
  | 'atrium-skylight';

export interface SceneNode {
  id: string;
  name: string;
  kind: 'mesh' | 'light';
  depth: number;
  visible: boolean;
  geometryType?: MeshGeometryType;
  position: Vec3;
  rotation: Vec3; // degrees
  scale: Vec3;
  material?: MaterialConfig;
  lightConfig?: {
    color: string;
    intensity: number;
    role: 'key' | 'fill' | 'rim';
  };
}

export interface ScenePreset {
  id: SceneId;
  title: string;
  category: Exclude<SceneCategory, 'all'>;
  description: string;
  triCount: string;
  shaderMode: string;
  aspectRatio: string;
  previewImage: string;
  lightingNotes: string;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  nodes: SceneNode[];
}

export interface MaterialPreset {
  id: string;
  name: string;
  subtitle: string;
  category: 'Glass' | 'Metal' | 'Stone';
  config: MaterialConfig;
}

export interface RenderJob {
  id: string;
  title: string;
  sceneId: SceneId;
  sceneTitle: string;
  resolution: '1920×1080' | '2560×1440' | '3840×2160';
  format: 'PNG' | 'WebP';
  samples: number;
  status: 'rendering' | 'completed';
  progress: number;
  createdAt: string;
  imageUrl: string;
  shaderMode: string;
}
