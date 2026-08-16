# Porsche 911 Showcase Web Application

A premium, interactive digital showcase for the iconic **Porsche 911** lineup. Inspired by modern high-end editorial and brutalist cyber-aesthetics, this application utilizes advanced CSS, hardware-accelerated animations, and canvas-based shaders to deliver a visually stunning, luxury-tier user experience.

---

## 🚀 Tech Stack & Project Framework

The application is built on a modern, high-performance web development stack:

*   **Frontend Library:** [React 19](https://react.dev/) (leveraging latest hook APIs and concurrent rendering).
*   **Build Tooling & Bundler:** [Vite 6](https://vite.dev/) (providing near-instant hot module replacement and lightning-fast builds).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) (for robust typing across components, models, and endpoints).
*   **Styling (CSS):** [Tailwind CSS v4.0](https://tailwindcss.com/) (using the brand new `@tailwindcss/vite` compiler plugin for rapid utility styling and custom design tokens).
*   **Animations:** [Motion](https://motion.dev/) (`motion/react` v12) (for spring physics, scroll-linked updates, and entry/exit transitions).
*   **Icons:** [Lucide React](https://lucide.dev/) (for clean, developer-friendly vector icons).
*   **Backend Server:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) (serving a REST API to query and configure model data).
*   **Database:** Local JSON-based datastore (`db.json`) for configuration changes.

---

## ✨ Aesthetic UI/UX (AUIUX) Components

The signature visual identity of this project relies on a collection of highly-optimized, custom-made visual components designed to push web-browser graphics to their limit.

### 1. `CustomCursor.tsx`
An adaptive, hardware-accelerated pointer that replaces the default system cursor with a smooth, physics-based outer ring and pinpoint inner dot.
*   **Implementation Details:**
    *   Uses Framer Motion's `useMotionValue` and `useSpring` to capture and smooth client mouse positions with very low latency.
    *   Listens to global `mouseover` events to dynamically evaluate target element tag names, classes, or roles.
    *   **States:**
        *   *Default:* Subtle circle and dot.
        *   *Button/Link:* Outer ring expands to `64px`, border color shifts to yellow (`#fbbf24`), and the inner dot glows and bounces.
        *   *Image/Media:* Outer ring expands to `96px`, transforms into a dashed circular line, starts rotating, and reveals a retro-tech grid coordinate container with "VIEW" text.
        *   *Heading:* Dot scales up by `3x` with a CSS difference mix-blend mode to invert text colors underneath.
    *   **Performance:** Uses hardware-accelerated translation matrices (`translate3d`) to prevent browser layout reflow.

### 2. `ElectricBorder.tsx`
A canvas-rendered decorative card frame that simulates a chaotic, glowing "electric arc" running around rounded elements.
*   **Implementation Details:**
    *   Instead of standard CSS borders, it renders a custom HTML `<canvas>` overlay.
    *   Employs a custom mathematical **2D Fractal/Octaved Noise Algorithm** (similar to Simplex or Perlin noise) built directly into the React component.
    *   Generates noise coordinates iteratively based on the border's perimeter. It maps a rounded rectangle's perimeter to a 1D path, computes offsets via multiple octaves of interpolated noise, and projects those back into canvas-space coordinates.
    *   **Customization:** Supports dynamic color overrides, speed multipliers, chaos/amplitude values, and border-radius matching.
    *   Multi-layered CSS shadow layers (`eb-glow-1`, `eb-glow-2`, and `eb-background-glow`) are blended underneath the canvas to produce a highly realistic neon aura.

### 3. `LiquidGlass.tsx` *(Aesthetic Backdrop Refraction Shader)*
A high-end glassmorphism panel that uses custom SVG filters to distort and refract content behind it, mimicking the physics of curved glass lenses.
*   **Implementation Details:**
    *   **Refraction:** Defines an SVG filter with `<feTurbulence>` (fractal noise) and `<feDisplacementMap>`. It feeds the turbulence noise into the displacement map to displace the pixels of the underlying background video/media dynamically.
    *   **Chromatic Aberration:** Splices the displaced visual into distinct color channel matrices (Red, Green, Blue) using `<feColorMatrix>` and merges them back with horizontal offsets (`<feOffset>` + `<feBlend mode="screen">`) to simulate physical lens fringing.
    *   **Interactive Hooks:** Binds displacement frequency, scale, and blur parameters to scroll metrics (`scrollYProgress`) to make the glass ripple and distort more dramatically as the user scrolls.

### 4. `BlurText.tsx`
A typographic intro effect that reveals words or individual characters with a staggered blur fade-in.
*   **Implementation Details:**
    *   Parses raw text strings into arrays of characters or words, wrapping each in an independent inline-block `motion.span`.
    *   Calculates a staggered animation offset depending on index positions and custom stagger-easing profiles.
    *   Utilizes a local `IntersectionObserver` to trigger the reveal animation only when the text crosses into the viewport threshold.
    *   Animates keyframes of `filter: blur()`, `opacity`, and `translateY` concurrently.

### 5. `RotatingText.tsx`
An interactive text-swapping module that rotates headline phrases with continuous letter-by-letter staggering transitions.
*   **Implementation Details:**
    *   Uses a timer or ref-based controller to loop through strings in a looping array.
    *   Framer Motion `AnimatePresence` manages the unmounting and mounting transitions of letters simultaneously.
    *   Stagger configurations can be set to transition letters from the `first`, `last`, `center`, or randomly.

### 6. `ShinyText.tsx`
Adds a metallic, sweeping light-reflection effect to typography, commonly used in premium luxury branding.
*   **Implementation Details:**
    *   Applies a CSS linear-gradient background matching the text length, clipping the background to the text boundary (`background-clip: text`).
    *   Updates the `background-position` value over time using a high-fidelity `useAnimationFrame` timer, ensuring 60fps render rates.
    *   Allows configuration of shine colors, speeds, reflective spread, hover-to-pause interactions, and yoyo direction sweeps.

---

## 🛠️ How the Project Works

### System Architecture Overview

```
┌─────────────────────────────────┐
│     React 19 Single Page App    │
│  (Frontend Dev Server: Port 3000)│
└────────────────┬────────────────┘
                 │
                 │ Asynchronous Requests
                 ▼ (Fetch API calls)
┌─────────────────────────────────┐
│       Express API Server        │
│          (Port 3001)            │
└────────────────┬────────────────┘
                 │
                 │ Read/Write
                 ▼
┌─────────────────────────────────┐
│            db.json              │
│       (Local Data Store)        │
└─────────────────────────────────┘
```

### 1. Viewport & Scroll Filters
As the user scrolls, the page triggers real-time visual modifications on the fixed background video using Framer Motion's `useScroll` Hook. 
*   **Blur & Brightness:** The CSS filter applied to the background video transitions dynamically:
    *   *Scroll Position 0:* `brightness(30%) blur(0px)`
    *   *Scroll Position 0.5:* `brightness(60%) blur(8px)`
    *   *Scroll Position 1.0:* `brightness(100%) blur(0px)`

### 2. Collapsible Navigation Sidebar
The left navigation panel manages active page views. Clicking on model titles (e.g. Targa, GT3 RS, Dakar) scrolls the browser to the corresponding HTML section. It tracks which section is in view to toggle the active highlight item, fetching the list of models dynamically from the backend database server.

### 3. API Integration & Fallbacks
When the app boots:
1. It sends an asynchronous HTTP request (`GET http://localhost:3001/api/models`) to fetch model details from the backend.
2. If the backend is running, the lineup data loads dynamically into the navigation and model list states.
3. If the backend is offline or fails, the application automatically catches the error and falls back gracefully to a hardcoded local array of models.

---

## 📂 Project Structure

```
porsche 911/
├── .env.example              # Template for environmental variables
├── .gitignore                # Ignored directories (node_modules, dist)
├── db.json                   # Mock database for Express API
├── package.json              # Project dependencies and script runner configurations
├── server.js                 # Express API server entry-point
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler, alias maps, and Tailwind plugin config
│
├── public/                   # Static asset folders
│   └── asset/
│       ├── VID_20260220_150236.mp4  # Cinematic backdrop video
│       └── *.png                    # Porsche high-res silhouette images
│
└── src/                      # Source React application
    ├── main.tsx              # App bootstrapper
    ├── App.tsx               # Main layout container and showcase logic
    ├── index.css             # Main styling, Tailwind imports, custom font variables
    │
    └── components/           # Custom visual interface components
        ├── BlurText.tsx
        ├── CustomCursor.tsx
        ├── ElectricBorder.tsx
        ├── ElectricBorder.css
        ├── LiquidGlass.tsx
        ├── RotatingText.tsx
        ├── RotatingText.css
        ├── ShinyText.tsx
        └── ShinyText.css
```

---

## ⚙️ Setup & Installation Instructions

Follow these steps to run the complete Porsche 911 Showcase locally:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18.0+ recommended) along with `npm`.

### 1. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template environmental file:
```bash
cp .env.example .env
```
*(Open `.env` to configure custom API keys if needed; defaults are preconfigured for local execution).*

### 3. Start the Backend API Server
Launch the Express server to read/write model specifications to `db.json`:
```bash
npm run server
```
This runs the API server on: **`http://localhost:3001`**

### 4. Start the Frontend Application
In a separate terminal panel, start the Vite development server:
```bash
npm run dev
```
This runs the client UI on: **`http://localhost:3000`**

### 5. Build for Production
To generate a fully compiled, optimized static distribution bundle in the `dist` directory:
```bash
npm run build
```
To test the built files locally, use:
```bash
npm run preview
```

---

## 🎨 CSS Customizations & Fonts

Custom theme tokens are imported in `src/index.css`. 

*   **Google Fonts Integrated:**
    *   `sans`: *Inter* (Clean, legible utility body text)
    *   `serif`: *Playfair Display* (Luxurious italic labels)
    *   `mono`: *JetBrains Mono* (Industrial telemetry gauges)
    *   `heading`: *Syne* (Brutalist, wide-profile uppercase headings)
*   **Custom Scanline Animation:** A visual scanner overlay scrolling continuously vertically to simulate a retro CRT monitor telemetry display.
*   **Porsche Grid Overlay:** Radial dot grid background layout for structural alignment.
