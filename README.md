# Lumina — Product Showcase Explorer

**Frontend Developer Take-Home (Razorpod)**

Lumina is a modern, fully-responsive product discovery UI built with **React + TypeScript + Vite**. It fetches data from the **DummyJSON Products API** through a custom **Node.js/Express backend proxy** with in-memory caching, and renders it with a premium **glassmorphic** aesthetic and purposeful **Framer Motion** animations.

---

## Demo

| Route | Description |
|---|---|
| `/` | Landing page with floating product tiles |
| `/products` | Product listing with filters, search, sort, pagination |
| `/products/{6-CHAR-ID}` | Standalone product detail page (Amazon-style) |

---

## Features

### Core Requirements
| Feature | Detail |
|---|---|
| **Browse products** | Paginated grid with 12 items per page via `/api/products?limit=12&skip=0` |
| **Filter by category** | Sidebar with category pills fetched from `/api/categories`, expandable for long lists |
| **Filter by rating** | Minimum star rating filter (1–5) |
| **Filter by price range** | INR price range slider |
| **Search** | Debounced (400ms) text search across product titles |
| **Sort** | Price (asc/desc), Title (A–Z / Z–A), Default |
| **Product detail page** | Standalone page with image gallery, specs, policies, reviews |
| **Loading states** | Skeleton cards with shimmer animation + spinner |
| **Error handling** | ErrorState component with retry button |
| **Responsive** | Mobile / Tablet / Desktop via Tailwind breakpoints |

### Bonus 1 — Advanced Animations (Framer Motion)
| Animation | Technique |
|---|---|
| Staggered card reveal | `staggerChildren: 0.06` with fade + slide |
| Spring physics on card hover | `whileHover={{ y: -8, scale: 1.02 }}` with `type: 'spring'` |
| Floating product tiles (landing) | `useMotionValue` + continuous `animate()` with reverse |
| Theme toggle knob | Spring physics `stiffness: 500, damping: 30` |
| Scroll-triggered section reveals | `whileInView` with staggered children |
| Layout animation on reorder | `layout` prop on cards during filter/sort |
| Continuous back-arrow pulse | `animate={{ x: [0, 4, 0] }}` with infinite repeat |

### Bonus 2 — Express Backend Proxy
- Node.js/Express server proxy at `/api/*`
- All frontend API calls go through the proxy (not directly to DummyJSON)
- **In-memory caching** with three TTL tiers:
  - Product lists: **30s**
  - Product details: **120s**
  - Categories: **300s**
- Cache-health endpoint: `GET /api/health`

### Extra Polish
- **6-character alphanumeric product IDs** in URLs (e.g., `/products/BAAHZR`) instead of raw numeric IDs
- **Amazon-style image gallery**: vertical 72px thumbnails strip + square main image
- **Dark mode** with spring-animated toggle switch
- **Recently viewed** sidebar with product cards
- **Hot Deals** (top 4 discounts) and **Top Rated** sidebar widgets
- **INR + USD** pricing with discount badges
- **Keyboard shortcuts**: Arrow Left/Right for images, Escape to go back

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript 6 |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS 3 |
| **Animation** | Framer Motion 12 |
| **Icons** | lucide-react |
| **HTTP** | axios |
| **Routing** | react-router-dom 7 |
| **Backend proxy** | Express 5 + cors |

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
│   ├── ProductModal.tsx         # (Legacy) modal detail view
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
```

---

## Local Setup

### Prerequisites
- **Node.js** 20+ (LTS recommended)

### 1. Install dependencies
```bash
npm install
```

### 2. Run both servers (Express proxy + Vite dev)
```bash
npm run dev:all
```

Or run them separately in two terminals:
```bash
# Terminal 1 — Express proxy on http://localhost:3001
npm run server

# Terminal 2 — Vite dev server on http://localhost:5173
npm run dev
```

### 3. Open the app
**http://localhost:5173**

---

## How It Works (Architecture)

### Data Flow
```
Browser  →  Vite Dev Server (:5173)  →  Proxy (/api/*)  →  Express Server (:3001)
                                                                      ↓
                                                              Memory Cache (TTL)
                                                                      ↓
                                                              DummyJSON API
```

1. **Frontend** calls `/api/products`, `/api/products/:id`, `/api/categories` via axios
2. **Vite** proxies `/api/*` to the Express server on `localhost:3001`
3. **Express server** checks its in-memory cache first; if miss, fetches from DummyJSON and caches the result
4. Response flows back through the chain

### State Management
- **useProducts** hook manages fetching, pagination, loading/error states with AbortController
- **useCategories** hook fetches category list once with caching
- All filtering, sorting, and search are **client-side** (applied to fetched results via `useMemo`)

### Routing
| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Hero with floating product gallery |
| `/products` | `ProductsPage` | Product grid + filters + sidebars |
| `/products/:id` | `ProductPage` | Standalone product detail |

### Product ID Encoding
Numeric DummyJSON IDs are encoded as 6-character alphanumeric codes in URLs using a reversible scramble (`id * 7919 + 33554432` → base-32). This avoids exposing raw sequential IDs.

---

## Design Decisions

| Decision | Rationale |
|---|---|
| **Standalone product page** instead of modal | Enables deep-linking, browser back/forward, and better mobile UX |
| **Client-side search/sort/filter** | DummyJSON doesn't support server-side sorting for all fields; client-side is simpler and provides instant feedback |
| **Express backend proxy** | Keeps API base URL configurable, enables caching (bonus), and simulates real-world architecture |
| **Three-tier cache TTL** | Product lists change often (30s), details are semi-static (2m), categories rarely change (5m) |
| **6-char alphanumeric IDs** | Looks more polished than raw IDs in URLs, prevents ID enumeration |
| **Inline scroll-triggered animations** | Uses `whileInView` with `once: true` — performs well and doesn't distract after initial view |
| **Spring physics for interactions** | Natural-feeling feedback (hover lift, toggle switch) vs linear transitions |
| **Full TypeScript** | Strict types for Product, Review, Category, SortOption — catches errors early |

---

## Evaluation Checklist

| Criteria | Status |
|---|---|
| **Functionality** — All core requirements met | ✅ Browsing, filtering, search, sort, detail view, pagination |
| **Code quality** — Clean, typed, well-organized | ✅ TypeScript strict mode, custom hooks, separated concerns |
| **API integration** — Loading/error states, race conditions handled | ✅ Skeleton + ErrorState + AbortController on all fetches |
| **Animations** — Framer Motion throughout | ✅ Staggered grid, spring hovers, scroll reveals, theme toggle, floating tiles |
| **Responsiveness** — Mobile/Tablet/Desktop | ✅ `sm:` `md:` `lg:` `xl:` breakpoints on all layouts |
| **Bonus 1: Advanced animations** | ✅ 6 animation techniques (scroll-triggered, spring physics, stagger, layout, motion values, infinite) |
| **Bonus 2: Express backend proxy with caching** | ✅ Full proxy with 3-tier TTL cache, health endpoint |
| **README** — Setup steps + design rationale | ✅ |

---

## Notes
- Prices are displayed with an **INR conversion** factor (`price * 83`) for the UI
- Pagination is hidden when search is active to keep results consistent
- The Express proxy requires `npm run server` or `npm run dev:all` during development
- For production, the Express server can serve the built frontend from `dist/` (not implemented in this scope)

---

*Developed by Anirudh for Razorpod.*
