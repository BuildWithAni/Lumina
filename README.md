# Lumina — Product Showcase Explorer

**Frontend Developer Take-Home Assignment — Razorpod**

A modern, responsive product discovery UI that fetches data from the [DummyJSON Products API](https://dummyjson.com/products) and presents it with a clean **glassmorphic** design and purposeful **Framer Motion** animations.

---

## Links

| | |
|---|---|
| **Deployment** | [https://lumina-nine-zeta.vercel.app](https://lumina-nine-zeta.vercel.app) |
| **Repository** | [https://github.com/BuildWithAni/Lumina](https://github.com/BuildWithAni/Lumina) |

---

## Features

### Core Requirements

| Requirement | Implementation |
|---|---|
| **Browse products** | Paginated grid (12 items/page) via DummyJSON API |
| **Product detail view** | Standalone page (`/products/{6-char-id}`) with image gallery, specs, policies, reviews |
| **Filter by category** | Sidebar with category pills, expandable for long lists |
| **Sort by price / title** | Client-side sorting — ascending, descending, A–Z, Z–A |
| **Loading states** | Skeleton shimmer cards + spinner during fetches |
| **Error states** | ErrorState component with retry button, AbortController for race conditions |
| **Responsive** | Fully responsive via Tailwind breakpoints (mobile, tablet, desktop) |

### Animation Requirements (Framer Motion)

| Requirement | Implementation |
|---|---|
| **List item appearance** | Staggered grid fade-in + slide-up (`staggerChildren: 0.06`) |
| **Detail view transition** | Spring-based scale + fade on page components |
| **Micro-interactions** | Spring-physics hover lift on cards, button feedback, theme toggle |

### Bonus 1 — Advanced Animation Showcase

| Animation | Technique |
|---|---|
| **Scroll-triggered reveals** | `whileInView` with staggered children on specs, policies, reviews |
| **Physics-based motion** | Spring animations on card hover (`stiffness: 300, damping: 15`) and theme toggle (`stiffness: 500, damping: 30`) |
| **Floating product tiles** | `useMotionValue` + `animate()` with infinite reverse loop |
| **Layout animation** | `layout` prop on cards during filter/sort transitions |
| **Sequential staggered reveal** | Incremental `delay` on spec cards, review cards, and policy cards |
| **Continuous animation** | Back-arrow pulse (`animate={{ x: [0, 4, 0] }}` with infinite repeat) |

### Bonus 2 — Node.js/Express Backend Proxy

- Custom Express 5 proxy server at `/api/*` (in `server/`)
- All frontend API calls route through the proxy, not directly to DummyJSON
- **In-memory caching** with three TTL tiers:
  - Product lists: **30s**
  - Product details: **120s**
  - Categories: **300s**
- Cache-health endpoint: `GET /api/health`
- Deployed on Vercel via serverless function (`api/proxy.js`) with CDN edge caching

### Extra Polish

- **6-character alphanumeric product IDs** (e.g., `/products/BAAHZR`) instead of raw numeric IDs
- **Amazon-style image gallery**: vertical 72px thumbnail strip + square main image
- **Dark mode** with spring-animated toggle switch, persisted to localStorage
- **Recently viewed** tracking with localStorage persistence
- **Hot Deals** (top discounts) and **Top Rated Picks** sidebar widgets
- **INR + USD** pricing with discount badges
- **Keyboard shortcuts**: Arrow Left/Right for image navigation, Escape to go back
- **Search** with 400ms debounce

---

## Tech Stack

| Category | Choice | Why |
|---|---|---|
| **Framework** | React 19 + TypeScript (strict mode) | Type safety, modern patterns, industry standard |
| **Build tool** | Vite 8 | Fast HMR, optimized builds |
| **Styling** | Tailwind CSS 3 | Utility-first, responsive-by-default, no CSS conflicts |
| **Animation** | Framer Motion 12 | Declarative API, spring physics, layout animations, scroll triggers |
| **Routing** | react-router-dom 7 | Standard React routing with loader support |
| **Icons** | lucide-react | Lightweight, tree-shakable, consistent design |
| **HTTP** | axios | Interceptors, AbortController integration, cleaner API |
| **Backend proxy** | Express 5 + cors | Minimal server for API proxying, easy to extend |
| **Dev runner** | concurrently | Runs Express + Vite in parallel with one command |

---

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx          # Hero with floating product tiles
│   ├── ProductsPage.tsx         # Product listing with filters/grid
│   ├── ProductPage.tsx          # Standalone product detail
│   ├── ProductCard.tsx          # Individual product card
│   ├── ProductGrid.tsx          # Animated grid + skeleton + empty state
│   ├── LeftSidebar.tsx          # Category, sort, rating, price filters
│   ├── RightSidebar.tsx         # Recently viewed, hot deals, top rated
│   ├── SearchBar.tsx            # Debounced search input
│   ├── Pagination.tsx           # Page navigation
│   ├── ErrorState.tsx           # Error display with retry
│   ├── SkeletonCard.tsx         # Loading shimmer skeleton
│   ├── ThemeToggle.tsx          # Spring-animated dark mode switch
│   └── ...filter/dropdown components
├── hooks/
│   ├── useProducts.ts           # Product fetching + pagination state
│   ├── useCategories.ts         # Category list fetching
│   ├── useDebounce.ts           # Debounce utility hook
│   └── useTheme.ts              # Dark mode state + persistence
├── services/
│   └── api.ts                   # Axios client → Express proxy
├── types/
│   └── product.ts               # Full TypeScript interfaces
├── utils/
│   ├── productId.ts             # 6-char encode/decode for IDs
│   └── sort.ts                  # Client-side sort functions
├── App.tsx                      # Router root
└── main.tsx                     # Entry point + BrowserRouter

server/
├── index.js                     # Express proxy server (port 3001)
└── cache.js                     # In-memory TTL cache

api/
└── proxy.js                     # Vercel serverless function (for production)
```

---

## Local Setup

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/BuildWithAni/Lumina.git
cd Lumina

# 2. Install dependencies
npm install

# 3. Start both servers (Express proxy + Vite dev)
npm run dev:all
```

The app opens at **http://localhost:5173**.

The Express proxy runs on **http://localhost:3001** — Vite automatically proxies `/api/*` requests to it.

### Run servers separately

```bash
# Terminal 1 — Express proxy
npm run server

# Terminal 2 — Vite dev server
npm run dev
```

### Production build

```bash
npm run build        # tsc -b && vite build
npm run preview      # serves the built app locally
```

---

## Architecture

### Data Flow

```
Browser  →  Vite Dev Server (:5173)  →  Proxy (/api/*)  →  Express Server (:3001)
                                                                      ↓
                                                              Memory Cache (TTL)
                                                                      ↓
                                                              DummyJSON API
```

In production (Vercel):
```
Browser  →  Vercel Edge  →  Serverless Function (api/proxy.js)  →  DummyJSON API
                              ↓
                        CDN Edge Cache (Cache-Control headers)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Standalone product page** instead of modal | Enables deep-linking, browser back/forward, and better mobile UX |
| **Client-side search/sort/filter** | DummyJSON doesn't support server-side sorting/partial text search; client-side is simpler and provides instant feedback |
| **Express backend proxy** | Keeps API base URL configurable, enables in-memory caching, simulates real-world microservice architecture |
| **Three-tier cache TTL** | Product lists change often (30s), details are semi-static (2m), categories rarely change (5m) |
| **6-char alphanumeric IDs** | Cleaner URLs than raw sequential IDs; prevents ID enumeration |
| **useMemo for filtered results** | Expensive sort/filter operations are memoized — they only recompute when dependencies change |
| **AbortController on all fetches** | Prevents race conditions when navigating rapidly between products/pages |
| **Scroll-triggered animations with `once: true`** | Animations play once on scroll — good performance, no repeats |
| **Spring physics for interactions** | Natural-feeling feedback (hover lift, toggle switch) vs linear transitions |

---

## Animation Details

The following Framer Motion techniques are used throughout the application:

1. **Staggered grid reveal** — Product cards fade in with a cascading delay using `staggerChildren: 0.06`
2. **Spring card hover** — Cards lift, scale, and rotate with `type: 'spring'` for tactile feedback
3. **Landing page floating tiles** — 11 product thumbnails bob gently using `useMotionValue` + infinite `animate()` loops
4. **Theme toggle** — The switch knob uses `spring({ stiffness: 500, damping: 30 })` for a premium feel
5. **Scroll-triggered section reveals** — Specifications, policies, and reviews fade and slide up as the user scrolls down the product detail page
6. **Layout animation** — Products re-animate into new positions when filters/sort change via the `layout` prop
7. **Continuous pulse** — The "Back" button arrow has an infinite `x` oscillation

---

## Libraries Used

| Library | Purpose |
|---|---|
| **react** + **react-dom** | UI framework |
| **typescript** | Type safety and developer experience |
| **vite** | Build tool and dev server |
| **tailwindcss** | Utility-first CSS framework |
| **framer-motion** | Declarative animations with spring physics |
| **react-router-dom** | Client-side routing |
| **axios** | HTTP client with AbortController support |
| **lucide-react** | Lightweight icon library |
| **express** + **cors** | Backend proxy server |
| **concurrently** | Run multiple dev scripts in parallel |
| **autoprefixer** + **postcss** | Tailwind CSS build pipeline |

---

## Submission Checklist

| Criteria | Status |
|---|---|
| **Core requirements** — Browse, paginate, filter, sort, detail view, loading/error states, responsive | ✅ |
| **TypeScript** — Strict mode, full type coverage | ✅ |
| **Framer Motion animations** — Staggered list, detail view transition, micro-interactions | ✅ |
| **Bonus 1: Advanced animations** — Scroll-triggered, spring physics, layout animation, floating tiles, continuous pulse, staggered reveals | ✅ |
| **Bonus 2: Express backend proxy** — 3-tier in-memory caching, health endpoint, deployed via Vercel serverless function | ✅ |
| **README** — Setup instructions, design decisions, third-party libraries, bonus sections highlighted | ✅ |
| **Deployment** — Live on Vercel at [lumina-nine-zeta.vercel.app](https://lumina-nine-zeta.vercel.app) | ✅ |
| **Repository** — Public on GitHub at [github.com/BuildWithAni/Lumina](https://github.com/BuildWithAni/Lumina) | ✅ |

---

## Notes

- Prices are displayed with INR conversion (`price × 83`) for localised pricing
- Pagination is hidden when search is active to keep results consistent
- The Express proxy is used for local development; Vercel deployment uses a serverless function with CDN edge caching via `Cache-Control` headers
- The `npm run dev:all` script starts both the Express server and Vite dev server concurrently

---

*Developed by Anirudh for the Razorpod Frontend Developer Take-Home Assignment.*
