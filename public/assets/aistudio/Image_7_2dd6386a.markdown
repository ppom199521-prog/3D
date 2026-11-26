---
name: Obsidian Prism
colors:
  surface: '#11131a'
  surface-dim: '#11131a'
  surface-bright: '#373941'
  surface-container-lowest: '#0c0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e2ec'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#e2e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#bccbff'
  on-tertiary: '#002a78'
  tertiary-container: '#94aeff'
  on-tertiary-container: '#003ba1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#11131a'
  on-background: '#e2e2ec'
  surface-variant: '#33343c'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 4rem
    fontWeight: '700'
    lineHeight: 4.5rem
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.5rem
    fontWeight: '600'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 0.75rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets spatial computing artists, architectural visualizers, creative directors, and high-end interactive studios. It communicates technical mastery, cutting-edge precision, and cinematic luxury.

### Aesthetic Paradigm: Obsidian Glass & Spectral Neon
The visual tone merges architectural minimalism with dark-mode glassmorphic depth. Key visual tenets:
- **Obsidian Abyssal Canvas:** Surfaces use deep black-violet and charcoal tones rather than flat greys, creating an infinite backdrop for 3D viewports and render artifacts.
- **Spectral Energy Accents:** Controlled linear and radial glow bleeds in electric cyan, cobalt, and ultraviolet puncture the dark field to denote dynamic state, processing power, and viewport activity.
- **Precision Optical Borders:** Translucent hairline edges (1px with gradient alphas) emulate anti-aliased viewport edges and coated lens glass.
- **Futuristic Editorial Typography:** Geometric technical headlines contrasted with high-clarity utilitarian labels evoke viewport HUDs and luxury design monographs.

## Colors

The palette is engineered around dark light-absorption surfaces and high-luminance chromatic emission points.

### Palette Architecture
- **Canvas Base (`#08080C`):** The master underlying canvas representing an unlit 3D viewport.
- **Surface Elevation 1 (`#0E1017`):** Primary panel container, viewport sidebars, and structural chrome.
- **Surface Elevation 2 (`#151824`):** Secondary cards, active dialogs, inspectors, and floating docks.
- **Surface Elevation 3 (`#1E2235`):** High-density inputs, hover planes, and active interactive regions.
- **Primary Energy (`#38BDF8`):** Electric Cyan. Reserved for active cursor focal points, active gizmos, primary calls to action, and core confirmation indicators.
- **Secondary Luminescence (`#8B5CF6`):** Ultraviolet / Electric Purple. Drives render progress indicators, node graphs, shader attributes, and dimensional depth accents.
- **Deep Cobalt Anchor (`#2563EB`):** Foundation blue providing structural saturation across deep button fills, focused borders, and gradient ramps.
- **Text & Foreground:**
  - Crisp Master: `#FFFFFF` (100% white for hero headlines and active state data).
  - High Emphasis: `#E2E8F0` (90% tint for primary interface labels and values).
  - Muted Technical: `#94A3B8` (60% tint for non-active HUD counters, inactive parameters).
  - Ghost / Inactive: `#475569` (for grid guides and disabled metadata).

## Typography

The typographic hierarchy marries structural engineering precision with architectural high-fashion.

### Pairing Strategy
- **Headings & HUD Overlays (`Space Grotesk`):** Technical geometry, square proportions, and stylized alternate glyphs project computation, render-engine statistics, and luxury editorial weight. All caps styling is applied to `label-md` and `label-sm` levels for HUD telemetry.
- **Interactive Controls & Prose (`Inter`):** Neutral legibility engineered for complex numeric manipulation, tree structures, timeline keyframes, and tool parameter lists.
- **Tabular Numerics:** Enable `font-variant-numeric: tabular-nums` globally on parameters, frame markers, transformation coordinates, and technical metadata.

## Layout & Spacing

The layout operates on a compact 4px baseline sub-grid tied to a responsive 12-column layout for web showcases, or an elastic split-panel dock system for studio visualizers.

### Layout Mechanics
- **Desktop/Studio Display (1200px+):** 12-column fluid grid with `gutter` (1.5rem) and `margin` (2rem). Supports persistent floating HUD docks pinned 1.5rem from viewport perimeters.
- **Tablet Layout (768px - 1199px):** 8-column layout with `gutter` (1rem) and `margin` (1.5rem). Toolbars collapse into floating context pills.
- **Mobile Handheld (<768px):** 4-column layout with `gutter-sm` (0.75rem) and `margin-sm` (1rem). Render parameter viewports prioritize single-axis scrolling with full-width preview stages.
- **Structural Density:** Spacing between tool attributes and inspector fields defaults to `space-xs` and `space-sm` to maintain high screen information utility without sacrificing clean aesthetic margins.

## Elevation & Depth

Spatial layering relies on glassmorphic absorption, refractive hairline edges, and localized dynamic emissive illumination.

### Depth Archetypes
- **Level 0 (Canvas Base):** Solid `#08080C`. The infinite backdrop.
- **Level 1 (Panels & Docks):** Solid `#0E1017` at 85% opacity with `backdrop-filter: blur(16px)`. Border is a 1px solid stroke with `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Floating Cards & Hover Targets):** `#151824` at 90% opacity with `backdrop-filter: blur(24px)`. Border is a 1px stroke using a linear top-down gradient (`rgba(56, 189, 248, 0.25)` to `rgba(139, 92, 246, 0.05)`). Shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.7)`.
- **Level 3 (Modal Dialogs & Active Popovers):** `#1E2235` at 95% opacity. Shadow: dual-spread `0 0 0 1px rgba(56, 189, 248, 0.3)`, `0 20px 48px -8px rgba(0, 0, 0, 0.9)`, and a diffused ambient aura `0 0 40px -10px rgba(139, 92, 246, 0.2)`.

### Chromatic Glow Physics
Glows are never monochromatic. Focused interactive inputs project a 12px radial aura blending Electric Cyan (`rgba(56, 189, 248, 0.35)`) and Ultraviolet (`rgba(139, 92, 246, 0.2)`) along the bottom-right vector.

## Shapes

The form language is calculated, ergonomic, and refined:
- **Base Components (0.5rem / 8px):** Buttons, inputs, parameter boxes, and chip elements utilize standard rounded curvature.
- **Containers & Glass Panels (`rounded-lg` - 1rem / 16px):** Inspector windows, 3D viewport canvas frames, and model showcase cards.
- **Hero Windows & Dialogs (`rounded-xl` - 1.5rem / 24px):** Studio showreel modals and master workspace overlays.
- **Continuous Curvature:** All outlines maintain precise geometric concentricity; child elements within containers reduce their corner radii by equivalent interior margins.

## Components

### Buttons
- **Primary Glow CTA:** Electric blue-to-cyan gradient background (`linear-gradient(135deg, #2563EB, #38BDF8)`), crisp `#FFFFFF` label (`label-lg`), subtle inner border highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.4)`), and an external glow drop shadow (`0 0 20px rgba(56, 189, 248, 0.35)`). Active transform `scale(0.98)`.
- **Secondary Ghost Glass:** Semi-transparent background (`rgba(255, 255, 255, 0.04)`), 1px border (`rgba(255, 255, 255, 0.12)`), `#E2E8F0` text. On hover, background shifts to `rgba(255, 255, 255, 0.08)` and border illuminates to `rgba(139, 92, 246, 0.5)`.

### Chips & Badges
- **Glow Status Badges:** Capsule form factor with uppercase `label-sm`. Background `rgba(14, 16, 23, 0.7)` with a 1px border colored by status. Contains a pulsing 6px circular indicator: Cyan for "Rendering", Ultraviolet for "GPU Compute Active", White for "Mesh Ready".

### Input Fields & Parameter Steppers
- **Technical Inputs:** Height 36px, background `#0E1017`, border 1px `rgba(255, 255, 255, 0.1)`. Typography is `Inter` 0.8125rem with tabular digits. Focus ring is a 1px crisp outline of `#38BDF8` paired with a soft `0 0 12px rgba(56, 189, 248, 0.25)` ambient emission.
- **Scrubbable Numeric Fields:** Accent line at the bottom in `#8B5CF6` indicating drag-to-adjust capability for 3D coordinates (X, Y, Z coordinates marked with subtle Cyan, Purple, and Amber markers).

### Checkboxes & Radio Selectors
- **Selection Controls:** 16px boxes with 4px corner radii (`roundedness: 1` equivalent). Unselected: solid dark surface `#151824` with 1px border `#475569`. Selected: filled with `#38BDF8`, inner check glyph in deep obsidian `#08080C`, casting a subtle cyan aura onto adjacent surfaces.

### Cards & Model Showcase Modules
- **Viewport Frame Card:** Obsidian surface `#0E1017` with an internal 16:9 3D scene preview area. Top navigation header with frosted glass blur, displaying asset polygon count, shader mode, and frame render latency in uppercase `label-sm`. Border uses top-edge specular highlighting.

### Lists & Tree Views
- **Asset / Outliner List:** Compact 28px row height. Alternating depth lines indicated by translucent vertical tracks (`rgba(255, 255, 255, 0.06)`). Active row receives an obsidian-elevated highlight (`#1E2235`) and an electric cyan left-edge border (2px).