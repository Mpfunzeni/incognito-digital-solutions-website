# Incognito Digital Solutions Website

Marketing and lead-generation website for **Incognito Digital Solutions**, a South African digital solutions company.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. All public pages are statically generated; the only server code is the quote form endpoint.

## Quick start

```bash
npm install
cp .env.example .env.local   # QUOTE_DELIVERY=log lets you test the form locally
npm run dev                  # http://localhost:3000
```

Requires Node.js 20.9 or newer.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | Generates route types and runs `tsc` |
| `npm test` | Unit tests (Vitest): form validation, rate limiter, email builder, blog loader |
| `npm run test:e2e` | Browser tests (Playwright) against a production build, desktop and mobile. Run `npm run build` first. Install a browser with `npx playwright install chromium`, or point `PLAYWRIGHT_CHROMIUM_PATH` at an existing Chromium. |
| `npm run check` | Lint, typecheck, unit tests and build in one go |

## Project structure

```
src/
  app/                    Routes (App Router)
    page.tsx              Homepage (sections A–K)
    services/             Services overview + /services/[slug] pages
    pricing/ portfolio/ about/ blog/ contact/ get-a-quote/
    privacy-policy/ terms-and-conditions/
    api/quote/route.ts    Quote form endpoint (validation, rate limit, spam checks, email)
    sitemap.ts robots.ts manifest.ts not-found.tsx
    icon.png apple-icon.png favicon.ico
  components/
    layout/               Header (logo top-left, mega-menu, mobile menu), Footer, Analytics, ConsentBanner
    sections/             Reusable page sections (cards, hero, CTA, process, portfolio, blog)
    forms/QuoteForm.tsx   Quote / contact form
    ui/                   Buttons, headings, FAQ accordion, breadcrumbs, JSON-LD, icons
  content/                ← Edit business content here
    site.ts               Company name, contact details, social links, logo
    services.ts           All service copy, FAQs and page content
    pricing.ts            Packages and (optional) prices
    portfolio.ts          Portfolio entries (currently demo concepts)
    testimonials.ts       Approved testimonials (empty, so the section is hidden)
    home.ts               Homepage value props, differentiators, process, FAQs
    blog/*.md             Blog articles
  lib/                    SEO helpers, blog loader, validation schema, rate limiter, email, analytics
public/brand/             Official logo (original upload + transparent-margin-trimmed copy)
public/og/                Default social sharing image
tests/unit, tests/e2e     Automated tests
```

## The logo

`public/brand/incognito-logo-original.png` is the logo exactly as supplied. `public/brand/incognito-logo.png` is the same artwork with only the empty transparent canvas around it trimmed, so it can sit at a sensible size in the navigation. The artwork itself is not redrawn, recoloured or cropped. Next.js serves optimised AVIF/WebP versions automatically.

The supplied logo is a **stacked** mark (icon above the wordmark), so in a navigation bar it displays about 68 px wide at 72 px tall. Its navy wordmark needs a light background, which is why the header is white and the footer places the logo on a white tile. If a **horizontal** version of the logo (icon beside the wordmark) exists, add it to `public/brand/`, update `site.logo` in `src/content/site.ts` (path, width, height) and it will display at about 150–190 px wide as originally specified. A dedicated square icon file would also improve the favicon.

## Updating content

- **Contact details / social links**: `src/content/site.ts`. Social links that are empty are not shown anywhere (including structured data).
- **WhatsApp**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` once the business number is verified; the WhatsApp contact option appears automatically.
- **Services**: edit `src/content/services.ts`. Each entry generates its card, mega-menu entry, sitemap entry and full service page. `optionalServices` holds "Client Account and Payment Solutions", unpublished until confirmed.
- **Prices**: in `src/content/pricing.ts`, every `price` is `null`, which displays "Request a Quote". To publish a verified price: `price: { amount: 4500, prefix: "From", suffix: "once-off" }`.
- **Portfolio**: entries in `src/content/portfolio.ts` are labelled demonstration concepts. Replace them with real projects (with client permission) and set `isDemo: false`, `client` and optional `url`.
- **Testimonials**: add genuine, approved testimonials to `src/content/testimonials.ts`; the homepage section appears automatically.
- **Blog**: add a Markdown file to `src/content/blog/` with this front matter, then redeploy:

  ```yaml
  ---
  title: "Article title"
  description: "One or two sentence summary used for search and social."
  date: "2026-10-19"
  updated: "2026-10-19"
  category: "SEO"
  tags: ["tag one", "tag two"]
  author: "Incognito Digital Solutions"
  image: "/blog/your-image.svg"     # 1200×630, placed in public/blog/
  imageAlt: "Describe the image"
  ---
  ```

  Start body headings at `##` (the title is the page's H1). Articles are added to the sitemap, listing, search/filter and related-articles automatically.
- **Redirects**: add old URLs to `redirects()` in `next.config.ts` (308 permanent).

## Quote form

Flow: client-side validation → `POST /api/quote` → server-side validation with the same Zod schema → same-origin check → rate limit (5 requests per IP per 15 minutes) → honeypot and minimum fill-time checks → email delivery. The visitor only sees the success message after the server confirms delivery; on failure they see an error with the phone number and email address.

Delivery modes (`QUOTE_DELIVERY`):

- `resend`: sends via the [Resend](https://resend.com) API. Requires `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` on a domain verified in Resend. The visitor's email is set as reply-to.
- `log`: development only; prints enquiries to the terminal.
- unset: every submission fails safely with the error message.

The rate limiter is in-memory, so on serverless/multi-instance hosting each instance counts separately. For stronger protection, back it with Upstash Redis or similar (`src/lib/rate-limit.ts`). Enquiries are not stored in a database; add one (for example Supabase with row-level security) only if you need a record beyond email.

## Analytics

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to enable Google Analytics 4. A consent banner then appears; GA loads only after the visitor accepts. Events sent:

| Event | When |
| --- | --- |
| `page_view` | Initial load and client-side navigations |
| `cta_click` (`cta_id`) | Any element with a `data-track` attribute (header, hero, cards, banners) |
| `phone_click`, `email_click`, `whatsapp_click` | `tel:`, `mailto:` and WhatsApp links |
| `generate_lead` (`form`, `service`) | Only after the server confirms the enquiry was delivered |
| `form_submit_error` | When a submission fails |

Mark `generate_lead` as a key event (conversion) in GA4.

## SEO

- Unique titles, descriptions and canonical URLs per page (`src/lib/seo.ts`)
- Open Graph and Twitter cards with a branded default image
- `sitemap.xml` (static pages, service pages, articles) and `robots.txt`
- JSON-LD: Organization, WebSite, BreadcrumbList, Service, Article, FAQPage. LocalBusiness is **not** used because no verified physical address was supplied.
- `lang="en-ZA"`, one H1 per page, semantic landmarks, crawlable links
- Non-production deployments are noindexed automatically (see `NEXT_PUBLIC_SITE_ENV`)

See [docs/SEO-LAUNCH-CHECKLIST.md](docs/SEO-LAUNCH-CHECKLIST.md).

## Security

- Security headers in `next.config.ts`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP
- The CSP allows `'unsafe-inline'` scripts so that pages stay statically generated; move to a nonce-based CSP if stricter policy is required
- Secrets are server-only (`server-only` import in `src/lib/email.ts`); only `NEXT_PUBLIC_*` values reach the browser
- External links use `rel="noopener noreferrer"`
- `npm audit` currently reports advisories in development-only ESLint dependencies (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`). They do not ship to the browser or run in production; update `eslint-config-next` when a fixed release is available.

## Deployment

The site works on any Node.js host that supports Next.js. Vercel is the simplest option:

1. Push this folder to a Git repository and import it in Vercel (framework preset: Next.js).
2. Add the environment variables from `.env.example`. On the **Production** environment only, set `NEXT_PUBLIC_SITE_ENV=production`.
3. Set `QUOTE_DELIVERY=resend` and the Resend variables, and verify the sending domain in Resend (DNS records).
4. Add the domain `www.incognitodigitalsolutions.co.za` (and redirect the apex domain to it), then update DNS at the registrar.
5. Submit a test enquiry on the live site and confirm the email arrives.

Self-hosting: `npm ci && npm run build && npm start` behind a reverse proxy with HTTPS. Set the same environment variables before building, because `NEXT_PUBLIC_*` values are embedded at build time.

## Maintenance

- Run `npm outdated` and `npm audit` monthly; update Next.js patch releases promptly.
- Run `npm run check` and `npm run test:e2e` before every deployment.
- Review Search Console coverage and Core Web Vitals monthly.
- Have the Privacy Policy and Terms reviewed by a legal adviser, and update them when services or data handling change.
