# SEO Launch Checklist

Work through this before and immediately after the site goes live.

## Before launch

- [ ] `NEXT_PUBLIC_SITE_URL` is `https://www.incognitodigitalsolutions.co.za` (or the final canonical host)
- [ ] `NEXT_PUBLIC_SITE_ENV=production` is set **only** on the production deployment
- [ ] Preview/staging deployments return `Disallow: /` in `/robots.txt` and an `X-Robots-Tag: noindex` header
- [ ] The apex domain redirects to the `www` host (or vice versa) with a single 301/308 hop
- [ ] HTTP redirects to HTTPS; the SSL certificate is valid
- [ ] Old site URLs (if known) are listed in `redirects()` in `next.config.ts`
- [ ] Contact details in `src/content/site.ts` are confirmed correct
- [ ] Verified social profiles and Google Business Profile URL are added to `site.social` (or left empty)
- [ ] Demo portfolio entries are replaced with real projects, or clearly remain labelled as demos
- [ ] Prices are either verified or left as "Request a Quote"
- [ ] Privacy Policy and Terms have been reviewed
- [ ] A test enquiry through `/get-a-quote` and `/contact` arrives in the inbox

## Technical checks (run on the live URL)

- [ ] `/sitemap.xml` lists only canonical, indexable URLs and uses the production host
- [ ] `/robots.txt` allows crawling and references the sitemap
- [ ] Every page has a unique `<title>`, meta description and self-referencing canonical
- [ ] Unknown URLs return HTTP 404 with the branded page
- [ ] Structured data validates in the [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) (homepage, a service page, a blog article)
- [ ] Open Graph preview looks correct (share a link in WhatsApp/LinkedIn, or use a preview tool)
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) on mobile for the homepage, a service page and an article: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- [ ] Keyboard-only navigation works (Tab through header, Services menu, mobile menu, form)
- [ ] An accessibility scan (e.g. axe DevTools or Lighthouse) shows no serious issues

## Search Console and analytics

- [ ] Add the property in [Google Search Console](https://search.google.com/search-console) (Domain property via DNS is preferred; or set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`)
- [ ] Submit `https://www.incognitodigitalsolutions.co.za/sitemap.xml`
- [ ] Request indexing for the homepage and service pages
- [ ] Create a GA4 property, set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, redeploy
- [ ] Accept the cookie banner and confirm events in GA4 DebugView (`page_view`, `cta_click`, `phone_click`, `generate_lead`)
- [ ] Mark `generate_lead` as a key event
- [ ] Link Search Console to GA4

## Local SEO

- [ ] Claim or update the Google Business Profile with the same name, phone and website as the site
- [ ] Describe the real service area (the site currently says "businesses across South Africa")
- [ ] Only add a physical address (and LocalBusiness structured data) if the business serves customers at that address and wants it published
- [ ] Keep business details consistent on every directory listing

## Keyword-to-page map (starting points, not verified search volumes)

| Search intent | Target page |
| --- | --- |
| website design services South Africa / small business website | `/services/web-design` |
| SEO services for businesses / SEO audit | `/services/seo` |
| domain registration .co.za / web hosting for business | `/services/web-hosting-domains` |
| e-commerce website development / online store | `/services/ecommerce-development` |
| logo and branding design / graphic design for business | `/services/branding` |
| website maintenance and support | `/services/maintenance` |
| website cost / website packages | `/pricing` |
| how to plan a website, how long SEO takes, choosing a domain, website maintenance | `/blog/*` |

Validate these with Search Console query data after launch and adjust copy to match how customers actually search. Avoid creating near-duplicate location pages; add a location page only when there is genuinely local content to put on it.

## Ongoing (monthly)

- [ ] Review Search Console Performance (queries, pages, CTR) and Indexing reports
- [ ] Fix any crawl errors or 404s; add redirects for moved content
- [ ] Publish at least one genuinely useful article
- [ ] Refresh service pages when offerings or processes change
