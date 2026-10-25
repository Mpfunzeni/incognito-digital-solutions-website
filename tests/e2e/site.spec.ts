import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/services",
  "/services/web-design",
  "/services/seo",
  "/services/web-hosting-domains",
  "/services/ecommerce-development",
  "/services/mobile-app-development",
  "/services/branding",
  "/services/maintenance",
  "/pricing",
  "/hosting",
  "/account/login",
  "/account/sign-up",
  "/portfolio",
  "/about",
  "/blog",
  "/blog/what-is-seo-and-how-long-does-it-take",
  "/contact",
  "/get-a-quote",
  "/privacy-policy",
  "/terms-and-conditions",
  "/locations",
  "/locations/johannesburg",
  "/locations/gqeberha",
];

for (const path of pages) {
  test(`${path} renders with one H1, canonical, no console errors and no horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(await page.locator("html").getAttribute("lang")).toBe("en-ZA");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("unknown pages return a branded 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page could not be found");
});

test("logo is top-left and links home", async ({ page }) => {
  await page.goto("/pricing");
  const logo = page.getByRole("banner").getByRole("link", { name: "Incognito Digital Solutions home" });
  await expect(logo).toBeVisible();
  const box = (await logo.boundingBox())!;
  expect(box.x).toBeLessThan(140);
  expect(box.y).toBeLessThan(20);
  await logo.click();
  await expect(page).toHaveURL(/\/$/);
});

test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of ["/", "/services/seo", "/blog/how-to-plan-a-small-business-website", "/about"]) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => seen.add(h));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile);
  test("services menu opens, links work and Escape closes it", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Show services menu" });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await page.getByRole("banner").getByRole("link", { name: /E-commerce Development/ }).click();
    await expect(page).toHaveURL(/\/services\/ecommerce-development$/);
    await expect(page.getByRole("button", { name: "Show services menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile);
  test("menu opens and closes after choosing a link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(mobileNav).toBeHidden();
  });
});

test.describe("quote form", () => {
  test("shows accessible validation errors", async ({ page }) => {
    await page.goto("/get-a-quote");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(page.getByLabel(/Full name/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/Full name/)).toBeFocused();
  });

  test("pre-selects the service from a card link", async ({ page }) => {
    await page.goto("/get-a-quote?service=" + encodeURIComponent("Search Engine Optimisation (SEO)"));
    await expect(page.getByLabel(/Service required/)).toHaveValue("Search Engine Optimisation (SEO)");
  });

  test("never shows success when delivery is not configured", async ({ page }) => {
    await page.goto("/get-a-quote");
    await page.getByLabel(/Full name/).fill("Test Person");
    await page.getByLabel(/Email address/).fill("test@example.com");
    await page.getByLabel(/Service required/).selectOption({ index: 1 });
    await page.getByLabel(/Project description/).fill("Testing the quote form from the automated test suite.");
    await page.getByRole("checkbox").check();
    await page.waitForTimeout(3100);
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("could not send your request");
    await expect(page.getByText("your request has been sent")).toHaveCount(0);
  });
});

test("API rejects cross-origin and invalid requests", async ({ request, baseURL }) => {
  const cross = await request.post("/api/quote", { headers: { origin: "https://evil.example" }, data: {} });
  expect(cross.status()).toBe(403);
  const invalid = await request.post("/api/quote", { headers: { origin: baseURL! }, data: { fullName: "x", startedAt: Date.now() - 10_000 } });
  expect(invalid.status()).toBe(422);
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/services/web-design</loc>");
  expect(sitemap).toContain("/blog/");
  expect((await request.get("/robots.txt")).status()).toBe(200);
});
