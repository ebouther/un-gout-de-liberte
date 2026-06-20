# Un Goût de Liberté — Agent Guide

## Stack

- **Nuxt 3** (SSR), **Vue 3** (Composition API, `<script setup>`), **Pinia**, **Tailwind CSS**
- **Stripe** (products, prices, checkout), **Yarn v1** package manager
- **Playwright** (e2e), **Vercel** (hosting)

## Commands

```sh
yarn dev          # dev server on localhost:3000
yarn build        # production build
yarn generate     # static export
npx playwright test --project=firefox  # run e2e (requires dev server running or auto-started)
```

No linter, no formatter config in the repo. `.editorconfig` covers indentation (2-space). No typecheck step.

## Architecture

### Pages (8 routes)
- `/` — shop front with hero, product grid, about section
- `/product/[id]` — SEO-friendly product detail page
- `/contact` — contact form + hours
- `/blog` / `/blog/[slug]` — blog listing + article
- `/admin` / `/admin/login` — admin panel (product/blog CRUD)

### Layouts
- `layouts/default.vue` — wraps pages with Navbar2 + Footer
- `layouts/admin.vue` — dark admin layout (no navbar/footer)

### Component naming
- `components/navbar2.vue` is imported as `<navbar-2>` (kebab-case)
- `components/products.vue` imports `CategoryFilter`, `ProductStats`, `Product` as nested components
- All SFCs use `import` + define in Options API or `<script setup>`

### State
- `store/cart.js` — Pinia store with localStorage persistence (via `@vueuse/core` `useStorage`)

### API routes (`server/api/`)
- `/api/products` — public, cached 5 min, lists active Stripe products
- `/api/order` — creates Stripe CheckoutSession, rate-limited
- `/api/blog/articles` — public listing of published articles (fetched from GitHub)
- `/api/admin/*` — JWT-protected (cookie `admin-auth`), verified in `server/middleware/auth.js`

### Scripts
- `scripts/export-stripe-data.js` / `scripts/import-stripe-data.js` — Stripe product CSV import/export
- `scripts/test-shipping.js` — verify shipping cost calculation

## Environment (see `.env.example`)

| Variable | Required | Purpose |
|---|---|---|
| `STRIPE_PK` / `STRIPE_SK` | Yes | Stripe payments |
| `ADMIN_PASSWORD` | Yes | Admin login |
| `JWT_SECRET` | Yes | Admin session signing |
| `GITHUB_TOKEN` | Yes (prod) | Blog article storage via GitHub API |
| `GITHUB_REPO` | Yes (prod) | `ebouther/un-gout-de-liberte` |

**`.env` is committed** — contains live production Stripe keys. Do not push secrets.

## Blog system

Articles live as markdown in `content/articles/`. In production (Vercel read-only fs), the admin panel creates/updates articles directly via GitHub API, which triggers auto-deploy. Commit convention: `content(blog): add|update|remove article "slug"`.

## Design tokens (current)

Custom font at `assets/css/fonts/gout-liberte.ttf`. Google Fonts loaded per-page via `<link>` tags (e.g. `pages/contact.vue` loads DM Serif Display, homepage loads Fraunces + Sora). `@nuxtjs/google-fonts` is in `devDependencies` but not configured in `nuxt.config.js` — don't use it. The Tailwind config (`tailwind.config.js`) is minimal with no extended theme — most colors use Tailwind defaults (`amber-600`, etc.) with a few custom CSS variables in recent work.

**Design palette** (redesign in progress — tokens not yet applied everywhere; many components still use `amber-600` etc.):
```
--stone:  #F4EFE8   (bg)
--gold:   #B88645   (primary)
--sage:   #5A7D63   (accent)
--line:   #D6CEC2   (borders/rules)
```

## Product data

Products come from Stripe. Categories use specific slugs: `confitures`, `fruits-sirop`, `biscuits-sucres`, `aperitifs`, `biscottes`, `macarons`, `confits-chutneys`, `sirops`, `caramels`, `autres`. Weight metadata stored on Stripe price metadata (`Poids` or `Poids net total`). Shipping only within France (Colissimo 2025 rates, free at 50€).

## Testing

Test file: `tests/e2e/ecommerce.spec.ts` — single spec covering full purchase flow. Runs against localhost:3000. Playwright config auto-starts dev server. Preferred browser: Firefox (most stable with parallel workers).

```sh
npx playwright test --project=firefox
npx playwright test --project=chromium --project=webkit
```

## Gotchas

- The `carousel.vue` component uses TW Elements (bootsrap-like JS carousel). Not to be confused with standard Vue carousel patterns.
- Multi-page form/checkout is not used — Stripe CheckoutSession handles payment externally.
- Blog article slugs must be unique. Admin panel generates them from the title.
- No migration or codegen step — Stripe is the source of truth for products.
- The `store/cart.js` store is imported as `useStore` (not `useCartStore`). Don't rename — it's used across 10+ components.
- All UI text is in French. Don't introduce English labels.
- CategoryFilter pills use `formatCategoryName` mapping — the slug values come from Stripe metadata.
