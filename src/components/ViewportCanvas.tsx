import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  CameraViewPreset,
  MaterialConfig,
  MeshGeometryType,
  SceneNode,
  ScenePreset,
} from '../types/studio';

export interface ViewportCanvasHandle {
  captureFrame: (
    width?: number,
    height?: number,
    format?: 'PNG' | 'WebP'
  ) => string | null;
  resetCamera: () => void;
}

interface ViewportCanvasProps {
  scenePreset: ScenePreset;
  nodes: SceneNode[];
  selectedNodeId: string;
  wireframe: boolean;
  showGrid: boolean;
  autoSpin: boolean;
  cameraPreset: CameraViewPreset;
  cameraTrigger: number;
  onSelectNode: (nodeId: string) => void;
}

function buildGeometry(type: MeshGeometryType): THREE.BufferGeometry {
  switch (type) {
    case 'octahedron':
      return new THREE.OctahedronGeometry(1, 0);
    case 'prism-core':
      return new THREE.IcosahedronGeometry(0.95, 0);
    case 'basalt-plinth':
      return new THREE.BoxGeometry(1, 1, 1);
    case 'caustic-ring':
      return new THREE.TorusGeometry(1, 0.025, 24, 96);
    case 'gyro-outer':
      return new THREE.TorusGeometry(2.1, 0.14, 32, 96);
    case 'gyro-mid':
      return new THREE.TorusGeometry(1.58, 0.12, 32, 96);
    case 'gyro-inner':
      return new THREE.TorusGeometry(1.06, 0.1, 28, 84);
    case 'gyro-core':
      return new THREE.SphereGeometry(0.55, 48, 48);
    case 'monolith-slab':
      return new THREE.BoxGeometry(3.6, 0.65, 1.45);
    case 'monolith-tower':
      return new THREE.BoxGeometry(1.1, 2.5, 1.3);
    case 'monolith-fin':
      return new THREE.BoxGeometry(2.6, 0.08, 0.9);
    case 'atrium-steps': {
      // Stepped architectural plinth via merged buffer or extruded stair silhouette
      const shape = new THREE.Shape();
      shape.moveTo(-1.8, -0.4);
      shape.lineTo(1.8, -0.4);
      shape.lineTo(1.8, 0.8);
      shape.lineTo(1.2, 0.8);
      shape.lineTo(1.2, 0.5);
      shape.lineTo(0.6, 0.5);
      shape.lineTo(0.6, 0.2);
      shape.lineTo(0, 0.2);
      shape.lineTo(0, -0.1);
      shape.lineTo(-1.8, -0.1);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 2.2,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
      });
      geo.center();
      return geo;
    }
    case 'atrium-colonnade': {
      const fins: THREE.BufferGeometry[] = [];
      const finCount = 6;
      const spacing = 0.62;
      for (let i = 0; i < finCount; i++) {
        const fin = new THREE.BoxGeometry(0.1, 2.2, 0.45);
        fin.translate((i - (finCount - 1) / 2) * spacing, 0, 0);
        fins.push(fin);
      }
      return mergeGeometries(fins) ?? new THREE.BoxGeometry(3.2, 2.2, 0.24);
    }
    case 'atrium-skylight':
      return new THREE.BoxGeometry(2.6, 0.1, 0.55);
    default:
      return new THREE.OctahedronGeometry(1, 0);
  }
}

function applyMaterialProps(
  mat: THREE.MeshPhysicalMaterial,
  cfg: MaterialConfig,
  wireframe: boolean
) {
  mat.color.set(cfg.color);
  mat.emissive.set(cfg.emissive);
  mat.emissiveIntensity = cfg.emissiveIntensity;
  mat.metalness = cfg.metalness;
  mat.roughness = cfg.roughness;
  mat.transmission = cfg.transmission;
  mat.ior = cfg.ior;
  mat.clearcoat = cfg.clearcoat;
  mat.clearcoatRoughness = 0.08;
  mat.thickness = cfg.transmission > 0 ? 1.25 : 0;
  mat.transparent = cfg.transmission > 0 || cfg.opacity < 1;
  mat.opacity = cfg.opacity;
  mat.wireframe = wireframe;
  mat.envMapIntensity = 1.35;
  mat.needsUpdate = true;
}

export const ViewportCanvas = forwardRef<ViewportCanvasHandle, ViewportCanvasProps>(
  (
    {
      scenePreset,
      nodes,
      selectedNodeId,
      wireframe,
      showGrid,
      autoSpin,
      cameraPreset,
      cameraTrigger,
      onSelectNode,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [contextLost, setContextLost] = useState(false);
    const [webglUnavailable, setWebglUnavailable] = useState(false);

    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const gridRef = useRef<THREE.GridHelper | null>(null);
    const meshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());
    const lightMapRef = useRef<Map<string, THREE.DirectionalLight | THREE.PointLight>>(
      new Map()
    );
    const stageGroupRef = useRef<THREE.Group | null>(null);
    const autoSpinRef = useRef(autoSpin);
    const nodesRef = useRef(nodes);
    const onSelectNodeRef = useRef(onSelectNode);

    const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
    const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

    autoSpinRef.current = autoSpin;
    nodesRef.current = nodes;
    onSelectNodeRef.current = onSelectNode;

    useImperativeHandle(ref, () => ({
      captureFrame: (width = 1920, height = 1080, format = 'PNG') => {
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        if (!renderer || !scene || !camera) return null;

        const prevSize = new THREE.Vector2();
        renderer.getSize(prevSize);
        const prevPixelRatio = renderer.getPixelRatio();
        const prevAspect = camera.aspect;

        try {
          renderer.setPixelRatio(1);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);

          const mime = format === 'WebP' ? 'image/webp' : 'image/png';
          return renderer.domElement.toDataURL(mime, 0.94);
        } finally {
          renderer.setPixelRatio(prevPixelRatio);
          renderer.setSize(prevSize.x, prevSize.y, false);
          camera.aspect = prevAspect;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        }
      },
      resetCamera: () => {
        targetCamPosRef.current = new THREE.Vector3(
          scenePreset.cameraPosition.x,
          scenePreset.cameraPosition.y,
          scenePreset.cameraPosition.z
        );
        targetLookAtRef.current = new THREE.Vector3(
          scenePreset.cameraTarget.x,
          scenePreset.cameraTarget.y,
          scenePreset.cameraTarget.z
        );
      },
    }));

    // Initialize WebGL Renderer, Scene, Camera, OrbitControls
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        });
      } catch {
        setWebglUnavailable(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setContextLost(true);
      };
      const handleContextRestored = () => {
        setContextLost(false);
      };
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#08080C');
      scene.fog = new THREE.FogExp2('#08080C', 0.042);
      sceneRef.current = scene;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        100
      );
      camera.position.set(4.2, 2.6, 5.2);
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.minDistance = 2.2;
      controls.maxDistance = 16;
      controls.maxPolarAngle = Math.PI * 0.54;
      controlsRef.current = controls;

      // Cancel camera preset glide on user interaction
      const stopGlide = () => {
        targetCamPosRef.current = null;
        targetLookAtRef.current = null;
      };
      controls.addEventListener('start', stopGlide);

      // Fill ambient light + reflective dark studio floor
      const fillLight = new THREE.HemisphereLight('#38bdf8', '#08080c', 0.45);
      scene.add(fillLight);

      const floorGeo = new THREE.CircleGeometry(14, 64);
      const floorMat = new THREE.MeshStandardMaterial({
        color: '#0b0d14',
        roughness: 0.48,
        metalness: 0.25,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.62;
      floor.receiveShadow = true;
      scene.add(floor);

      const grid = new THREE.GridHelper(18, 24, '#2563eb', '#1e2235');
      grid.position.y = -0.61;
      const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material];
      gridMats.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.35;
      });
      scene.add(grid);
      gridRef.current = grid;

      const stageGroup = new THREE.Group();
      scene.add(stageGroup);
      stageGroupRef.current = stageGroup;

      // Pointer raycasting for clicking meshes directly in viewport
      const raycaster = new THREE.Raycaster();
      const pointerDownPos = new THREE.Vector2();
      const onPointerDown = (e: PointerEvent) => {
        pointerDownPos.set(e.clientX, e.clientY);
      };
      const onPointerUp = (e: PointerEvent) => {
        const dist = Math.hypot(
          e.clientX - pointerDownPos.x,
          e.clientY - pointerDownPos.y
        );
        if (dist > 5) return; // ignore orbit drags
        const rect = canvas.getBoundingClientRect();
        const ndc = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(ndc, camera);
        const meshes = Array.from(meshMapRef.current.values()).filter(
          (m) => m.visible
        );
        const hits = raycaster.intersectObjects(meshes, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData.nodeId as string | undefined;
          if (hitId) onSelectNodeRef.current(hitId);
        }
      };
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointerup', onPointerUp);

      // Resize Observer
      const resizeObserver = new ResizeObserver(() => {
        if (!container || !rendererRef.current || !cameraRef.current) return;
        const w = container.clientWidth;
        const h = Math.max(container.clientHeight, 1);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      });
      resizeObserver.observe(container);

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      let animId = 0;
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const dt = Math.min(clock.getDelta(), 0.05);

        if (targetCamPosRef.current && targetLookAtRef.current) {
          camera.position.lerp(targetCamPosRef.current, 0.09);
          controls.target.lerp(targetLookAtRef.current, 0.09);
          if (
            camera.position.distanceTo(targetCamPosRef.current) < 0.03 &&
            controls.target.distanceTo(targetLookAtRef.current) < 0.03
          ) {
            targetCamPosRef.current = null;
            targetLookAtRef.current = null;
          }
        }

        if (autoSpinRef.current && !prefersReducedMotion) {
          stageGroup.rotation.y += dt * 0.24;
          // Subtle kinetic articulation for gyroscope inner rings
          const mid = meshMapRef.current.get('gyro-mid');
          const inner = meshMapRef.current.get('gyro-inner');
          if (mid) mid.rotation.x += dt * 0.45;
          if (inner) inner.rotation.z += dt * 0.65;
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        resizeObserver.disconnect();
        controls.removeEventListener('start', stopGlide);
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        controls.dispose();
        pmrem.dispose();
        envTex.dispose();
        floorGeo.dispose();
        floorMat.dispose();
        renderer.dispose();
        if (canvas.parentElement === container) {
          container.removeChild(canvas);
        }
      };
    }, []);

    // Rebuild meshes & lights when active scene changes
    useEffect(() => {
      const stageGroup = stageGroupRef.current;
      const scene = sceneRef.current;
      if (!stageGroup || !scene) return;

      // Clear previous stage children
      stageGroup.rotation.set(0, 0, 0);
      meshMapRef.current.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
        stageGroup.remove(mesh);
      });
      meshMapRef.current.clear();

      lightMapRef.current.forEach((light) => {
        scene.remove(light);
      });
      lightMapRef.current.clear();

      // Build nodes for current scene
      nodesRef.current.forEach((node) => {
        if (node.kind === 'mesh' && node.geometryType && node.material) {
          const geo = buildGeometry(node.geometryType);
          const mat = new THREE.MeshPhysicalMaterial();
          applyMaterialProps(mat, node.material, wireframe);
          const mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData.nodeId = node.id;
          stageGroup.add(mesh);
          meshMapRef.current.set(node.id, mesh);
        } else if (node.kind === 'light' && node.lightConfig) {
          const light =
            node.lightConfig.role === 'key'
              ? new THREE.DirectionalLight(
                  node.lightConfig.color,
                  node.lightConfig.intensity
                )
              : new THREE.PointLight(
                  node.lightConfig.color,
                  node.lightConfig.intensity * 8,
                  24
                );
          light.position.set(node.position.x, node.position.y, node.position.z);
          if (light instanceof THREE.DirectionalLight) {
            light.castShadow = true;
            light.shadow.mapSize.set(1024, 1024);
          }
          scene.add(light);
          lightMapRef.current.set(node.id, light);
        }
      });

      targetCamPosRef.current = new THREE.Vector3(
        scenePreset.cameraPosition.x,
        scenePreset.cameraPosition.y,
        scenePreset.cameraPosition.z
      );
      targetLookAtRef.current = new THREE.Vector3(
        scenePreset.cameraTarget.x,
        scenePreset.cameraTarget.y,
        scenePreset.cameraTarget.z
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scenePreset.id]);

    // Sync transforms, visibility, wireframe, materials, and lights in real time
    useEffect(() => {
      nodes.forEach((node) => {
        if (node.kind === 'mesh') {
          const mesh = meshMapRef.current.get(node.id);
          if (!mesh) return;
          mesh.visible = node.visible;
          mesh.position.set(node.position.x, node.position.y, node.position.z);
          mesh.rotation.set(
            THREE.MathUtils.degToRad(node.rotation.x),
            THREE.MathUtils.degToRad(node.rotation.y),
            THREE.MathUtils.degToRad(node.rotation.z)
          );
          mesh.scale.set(node.scale.x, node.scale.y, node.scale.z);
          if (node.material && mesh.material instanceof THREE.MeshPhysicalMaterial) {
            applyMaterialProps(mesh.material, node.material, wireframe);
            // Subtle selection rim emphasis without distorting true color
            if (node.id === selectedNodeId && node.material.emissiveIntensity < 0.08) {
              mesh.material.emissiveIntensity = 0.08;
            }
          }
        } else if (node.kind === 'light' && node.lightConfig) {
          const light = lightMapRef.current.get(node.id);
          if (!light) return;
          light.visible = node.visible;
          light.position.set(node.position.x, node.position.y, node.position.z);
          light.color.set(node.lightConfig.color);
          light.intensity =
            light instanceof THREE.PointLight
              ? node.lightConfig.intensity * 8
              : node.lightConfig.intensity;
        }
      });
    }, [nodes, wireframe, selectedNodeId]);

    // Toggle studio grid visibility
    useEffect(() => {
      if (gridRef.current) {
        gridRef.current.visible = showGrid;
      }
    }, [showGrid]);

    // Respond to camera view preset changes
    useEffect(() => {
      if (cameraTrigger === 0) return;
      const target = new THREE.Vector3(
        scenePreset.cameraTarget.x,
        scenePreset.cameraTarget.y,
        scenePreset.cameraTarget.z
      );
      targetLookAtRef.current = target;

      switch (cameraPreset) {
        case 'front':
          targetCamPosRef.current = new THREE.Vector3(0, 1.4, 6.4);
          break;
        case 'top':
          targetCamPosRef.current = new THREE.Vector3(0.01, 7.6, 0.4);
          break;
        case 'isometric':
          targetCamPosRef.current = new THREE.Vector3(5.2, 4.4, 5.2);
          break;
        case 'perspective':
        default:
          targetCamPosRef.current = new THREE.Vector3(
            scenePreset.cameraPosition.x,
            scenePreset.cameraPosition.y,
            scenePreset.cameraPosition.z
          );
          break;
      }
    }, [cameraPreset, cameraTrigger, scenePreset]);

    if (webglUnavailable || contextLost) {
      return (
        <div className="relative w-full h-full bg-[#08080C] flex items-center justify-center overflow-hidden">
          <img
            src={scenePreset.previewImage}
            alt={scenePreset.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-[#08080C]/60" />
          <div className="absolute bottom-24 px-4 py-2 rounded-lg glass-panel-1 text-xs text-[#E2E8F0]">
            {contextLost
              ? 'WebGL context paused — showing studio preview render.'
              : 'Interactive preview fallback active.'}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        aria-label={`Interactive 3D viewport for ${scenePreset.title}`}
        className="w-full h-full bg-[#08080C] cursor-grab active:cursor-grabbing"
      />
    );
  }
);

ViewportCanvas.displayName = 'ViewportCanvas';
