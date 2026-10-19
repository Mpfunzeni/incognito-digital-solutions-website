/**
 * Service catalogue. Homepage cards, the Services overview, the navigation
 * mega-menu, the sitemap and each /services/[slug] page are generated from
 * this list. Edit copy here; set `published: false` to hide a service.
 */

export type ServiceIcon =
  | "monitor"
  | "search"
  | "server"
  | "cart"
  | "palette"
  | "wrench"
  | "wallet";

export type FAQ = { question: string; answer: string };

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon: ServiceIcon;
  accent: "teal" | "orange" | "pink" | "purple";
  /** Card description (one or two sentences). */
  summary: string;
  /** Three short benefits shown on cards. */
  benefits: string[];
  published: boolean;
  seo: { title: string; description: string };
  hero: { heading: string; intro: string };
  overview: string[];
  deliverables: { title: string; description: string }[];
  idealFor: string[];
  process: { title: string; description: string }[];
  pricingFactors: string[];
  faqs: FAQ[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "web-design",
    title: "Website Design and Development",
    shortTitle: "Web Design",
    icon: "monitor",
    accent: "teal",
    summary:
      "Fast, responsive business websites designed around your customers and built to turn visits into enquiries.",
    benefits: ["Mobile-first, responsive layouts", "Clear calls to action", "Search-ready structure"],
    published: true,
    seo: {
      title: "Website Design and Development in South Africa",
      description:
        "Professional, responsive website design and development for South African businesses. Clear structure, fast pages and calls to action that generate enquiries.",
    },
    hero: {
      heading: "Website Design and Development",
      intro:
        "Your website is often the first conversation a customer has with your business. We design and build responsive websites that explain what you do clearly, load quickly and make it easy for visitors to get in touch.",
    },
    overview: [
      "A good business website does three things well: it tells visitors what you offer, it shows why they can trust you, and it makes the next step obvious. We plan every page around those goals before any design work starts.",
      "We build with modern, well-supported web technology so your site stays fast, secure and easy to extend. Every layout is tested on phones, tablets and desktops, because most visitors will see your site on a small screen first.",
      "Whether you need a simple brochure site or a larger website with a blog, service pages and enquiry forms, we scope the project to what your business actually needs.",
    ],
    deliverables: [
      { title: "Site plan and page structure", description: "A sitemap and content outline agreed with you before design begins." },
      { title: "Custom responsive design", description: "Layouts designed for your brand that adapt cleanly to every screen size." },
      { title: "Enquiry and quote forms", description: "Validated forms that deliver enquiries straight to your inbox." },
      { title: "On-page SEO foundations", description: "Page titles, meta descriptions, headings, sitemap and structured data set up from day one." },
      { title: "Performance and accessibility", description: "Optimised images, efficient code and accessible markup for a fast, inclusive experience." },
      { title: "Launch and handover", description: "Deployment, analytics set-up on request, and a walkthrough of how to manage your content." },
    ],
    idealFor: [
      "New businesses that need a professional online presence",
      "Established businesses with an outdated or slow website",
      "Service providers who want more enquiries from their website",
      "Organisations that need a site they can grow over time",
    ],
    process: [
      { title: "Discovery", description: "We learn about your business, customers, competitors and goals." },
      { title: "Structure and content", description: "We agree the sitemap, page content and calls to action." },
      { title: "Design", description: "We design key pages and refine them with your feedback." },
      { title: "Build and test", description: "We develop the site and test it across devices and browsers." },
      { title: "Launch", description: "We deploy the site, connect your domain and confirm everything works." },
    ],
    pricingFactors: [
      "Number of pages and unique page layouts",
      "Whether you supply the copy and images or need help creating them",
      "Forms, integrations and special functionality",
      "Blog or content management requirements",
    ],
    faqs: [
      {
        question: "How long does a website take to build?",
        answer:
          "It depends on the size of the site and how quickly content and feedback are available. A small business website is typically a matter of weeks rather than months. We give you a timeline with your quotation once we understand the scope.",
      },
      {
        question: "Will my website work on mobile phones?",
        answer:
          "Yes. Every site we build is responsive and is tested on phones, tablets and desktop screens before launch.",
      },
      {
        question: "Can I update the website myself?",
        answer:
          "We can set up your site so that common content such as blog posts can be updated easily, or you can choose a maintenance plan and we will make updates for you. We discuss the best option during planning.",
      },
      {
        question: "Do you write the content for the website?",
        answer:
          "You know your business best, so we usually work from information you supply. We can help structure and refine your copy so that it reads clearly and supports search visibility.",
      },
    ],
    related: ["seo", "web-hosting-domains", "maintenance"],
  },
  {
    slug: "seo",
    title: "Search Engine Optimisation (SEO)",
    shortTitle: "SEO",
    icon: "search",
    accent: "orange",
    summary:
      "Technical, on-page and content improvements that help the right customers find your business on search engines.",
    benefits: ["Technical SEO audits", "On-page optimisation", "Local search visibility"],
    published: true,
    seo: {
      title: "SEO Services for South African Businesses",
      description:
        "Practical SEO services: technical audits, on-page optimisation, local search and content guidance to help customers find your business. No unrealistic ranking promises.",
    },
    hero: {
      heading: "Search Engine Optimisation (SEO)",
      intro:
        "Search engine optimisation helps people who are already looking for what you offer find your business. We focus on the technical health, content and local signals that search engines rely on, and we report on progress honestly.",
    },
    overview: [
      "SEO is not a trick or a one-off task. It is the ongoing work of making your website easy for search engines to crawl and understand, and genuinely useful for the people who land on it.",
      "We start with a technical review of your site, look at how your pages match what customers search for, and then prioritise the improvements most likely to make a difference for your business.",
      "No one can guarantee a specific ranking on Google, and we will never promise one. What we can do is remove the obstacles holding your site back and build a stronger foundation for visibility over time.",
    ],
    deliverables: [
      { title: "Technical SEO audit", description: "Crawlability, indexing, page speed, mobile usability, broken links and structured data." },
      { title: "Keyword and intent research", description: "Identifying the searches your potential customers make and mapping them to the right pages." },
      { title: "On-page optimisation", description: "Titles, meta descriptions, headings, internal links and image alt text." },
      { title: "Local SEO", description: "Consistent business information and guidance on your Google Business Profile." },
      { title: "Content recommendations", description: "Ideas and outlines for pages and articles that answer real customer questions." },
      { title: "Search Console set-up and reporting", description: "Monitoring of impressions, clicks and indexing so you can see what is changing." },
    ],
    idealFor: [
      "Businesses whose website gets few visitors from search",
      "Local service providers who want to appear in nearby searches",
      "Companies launching a new website who want to start correctly",
      "Online stores that need product and category pages to be found",
    ],
    process: [
      { title: "Audit", description: "We review your site's technical health and current search visibility." },
      { title: "Research", description: "We identify the search intent behind your key services." },
      { title: "Prioritise", description: "We agree a plan that focuses on the highest-impact fixes first." },
      { title: "Implement", description: "We make the on-page and technical improvements." },
      { title: "Measure", description: "We track results in Search Console and refine the approach." },
    ],
    pricingFactors: [
      "Size and current technical condition of the website",
      "Number of services, locations or products to target",
      "Whether you need a one-off audit or ongoing monthly work",
      "Content creation requirements",
    ],
    faqs: [
      {
        question: "How long does SEO take to show results?",
        answer:
          "Search engines need time to recrawl and re-evaluate pages, so SEO is a medium- to long-term investment. Technical fixes can have an effect sooner, while content and authority build over months. We set realistic expectations based on your site and market.",
      },
      {
        question: "Can you guarantee first-page rankings?",
        answer:
          "No, and you should be cautious of anyone who does. Rankings are decided by search engines and change constantly. We focus on the work that improves your chances and report transparently on the results.",
      },
      {
        question: "Is SEO included when you build a website?",
        answer:
          "Every website we build includes on-page SEO foundations such as titles, descriptions, headings, a sitemap and structured data. Ongoing SEO, such as research, content and monitoring, is a separate service.",
      },
    ],
    related: ["web-design", "maintenance", "ecommerce-development"],
  },
  {
    slug: "web-hosting-domains",
    title: "Web Hosting and Domain Registration",
    shortTitle: "Hosting and Domains",
    icon: "server",
    accent: "purple",
    summary:
      "Domain registration, reliable hosting and business email set-up, managed for you so your website stays online.",
    benefits: [".co.za and international domains", "SSL certificates (HTTPS)", "Managed set-up and renewals"],
    published: true,
    seo: {
      title: "Web Hosting and Domain Registration",
      description:
        "Register your .co.za or international domain and host your website reliably. Incognito Digital Solutions manages set-up, SSL, DNS and renewals for you.",
    },
    hero: {
      heading: "Web Hosting and Domain Registration",
      intro:
        "Your domain name and hosting are the foundation of your online presence. We help you choose and register the right domain, set up secure hosting and keep renewals on track so your website and email keep working.",
    },
    overview: [
      "A domain name is your address on the internet, and hosting is where your website lives. Getting both right avoids downtime, email problems and expired domains that are difficult to recover.",
      "We register domains in your business's name, configure DNS, install SSL certificates so your site loads securely over HTTPS, and set up hosting that suits the size and traffic of your site.",
      "If you already own a domain or hosting account, we can work with your existing provider or help you move to a better set-up with minimal disruption.",
    ],
    deliverables: [
      { title: "Domain search and registration", description: "Help choosing an available name and registering .co.za or international extensions." },
      { title: "Hosting set-up", description: "Hosting matched to your website's technology and traffic." },
      { title: "SSL certificate", description: "HTTPS encryption so visitors' browsers trust your site." },
      { title: "DNS management", description: "Correct records for your website, email and verification services." },
      { title: "Business email set-up", description: "Professional addresses on your own domain, configured on request." },
      { title: "Renewal reminders", description: "Tracking of renewal dates so your domain and hosting do not lapse unexpectedly." },
    ],
    idealFor: [
      "Businesses registering their first domain name",
      "Owners who are unsure who controls their domain or hosting",
      "Companies moving away from slow or unreliable hosting",
      "Anyone who wants professional email on their own domain",
    ],
    process: [
      { title: "Review", description: "We check your current domain, hosting and email situation." },
      { title: "Recommend", description: "We suggest the right domain and hosting set-up for your needs." },
      { title: "Register and configure", description: "We register, configure DNS and install SSL." },
      { title: "Migrate if needed", description: "We move existing sites or email carefully to avoid downtime." },
      { title: "Monitor renewals", description: "We keep track of renewals and support you when changes are needed." },
    ],
    pricingFactors: [
      "Domain extension (.co.za, .com and others have different registry fees)",
      "Hosting resources your website needs",
      "Number of email mailboxes",
      "Whether a migration from another provider is required",
    ],
    faqs: [
      {
        question: "Who owns the domain name?",
        answer:
          "Your domain should be registered in your business's name. We register it on your behalf and you remain the owner.",
      },
      {
        question: "Are hosting and domains once-off costs?",
        answer:
          "No. Domains and hosting are recurring services, usually renewed annually or monthly. We explain all recurring fees clearly in your quotation.",
      },
      {
        question: "Can you move my existing website to new hosting?",
        answer:
          "Yes. We plan migrations carefully, including DNS and email, to keep any interruption to a minimum.",
      },
    ],
    related: ["web-design", "maintenance", "ecommerce-development"],
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    shortTitle: "E-commerce",
    icon: "cart",
    accent: "pink",
    summary:
      "Online stores with clear product pages, smooth checkout and South African payment options, built to sell.",
    benefits: ["Product and category management", "Secure checkout and payments", "Order notifications"],
    published: true,
    seo: {
      title: "E-commerce Website Development",
      description:
        "Online store development for South African businesses: product catalogues, secure checkout, payment gateway integration and a store you can manage yourself.",
    },
    hero: {
      heading: "E-commerce Development",
      intro:
        "Selling online should be simple for your customers and manageable for you. We build online stores with clear product pages, a smooth checkout and payment options suited to South African shoppers.",
    },
    overview: [
      "A successful online store needs more than a product list. Customers need to find products quickly, trust your store, and check out without friction, especially on mobile.",
      "We help you choose the right e-commerce platform for your range and budget, set up products and categories, and integrate a reputable payment gateway so payments are processed securely by the provider.",
      "After launch, you can manage products, stock and orders yourself, and we remain available for support, improvements and maintenance.",
    ],
    deliverables: [
      { title: "Platform recommendation", description: "Advice on the most suitable e-commerce platform for your products and growth plans." },
      { title: "Store design", description: "Branded, responsive product, category, cart and checkout pages." },
      { title: "Payment gateway integration", description: "Connection to a reputable payment provider for secure online payments." },
      { title: "Shipping and tax settings", description: "Delivery options, rates and VAT settings configured for your business." },
      { title: "Product set-up", description: "Initial product and category structure, with guidance on adding more." },
      { title: "Training and handover", description: "A walkthrough of managing products, orders and customers." },
    ],
    idealFor: [
      "Retailers ready to sell online for the first time",
      "Businesses selling through social media who want a proper store",
      "Existing stores that need a better design or checkout",
      "Brands that want to accept card and instant EFT payments",
    ],
    process: [
      { title: "Scope", description: "We review your products, payments, shipping and operations." },
      { title: "Platform and design", description: "We choose the platform and design the store experience." },
      { title: "Build and integrate", description: "We build the store and connect payments and shipping." },
      { title: "Test orders", description: "We place test orders end to end before going live." },
      { title: "Launch and support", description: "We launch, monitor early orders and support your team." },
    ],
    pricingFactors: [
      "Number of products and product variations",
      "Payment, shipping and third-party integrations",
      "Platform subscription and payment provider fees (charged by those providers)",
      "Custom features such as bookings, subscriptions or wholesale pricing",
    ],
    faqs: [
      {
        question: "Which payment methods can my store accept?",
        answer:
          "That depends on the payment gateway you choose. Most South African gateways support card payments and instant EFT, and some support additional methods. We help you compare options before integration.",
      },
      {
        question: "Are there ongoing costs for an online store?",
        answer:
          "Yes. Typical recurring costs include hosting or a platform subscription, the payment provider's transaction fees, your domain, and optional maintenance. We list these in your quotation.",
      },
      {
        question: "Can I add products myself after launch?",
        answer:
          "Yes. We build stores so that you can manage products, prices, stock and orders yourself, and we show you how.",
      },
    ],
    related: ["web-design", "seo", "web-hosting-domains"],
  },
  {
    slug: "branding",
    title: "Branding and Graphic Design",
    shortTitle: "Branding",
    icon: "palette",
    accent: "purple",
    summary:
      "Logos, visual identities and marketing graphics that make your business look consistent and professional everywhere.",
    benefits: ["Logo and identity design", "Brand guidelines", "Print and social graphics"],
    published: true,
    seo: {
      title: "Branding and Graphic Design Services",
      description:
        "Logo design, visual identity, brand guidelines and marketing graphics for South African businesses that want a consistent, professional image.",
    },
    hero: {
      heading: "Branding and Graphic Design",
      intro:
        "Consistent branding helps customers recognise and trust your business. We design logos, visual identities and everyday marketing materials that work together across your website, social media and print.",
    },
    overview: [
      "Your brand is how people remember you. A clear logo, a consistent colour palette and well-chosen typography make every touchpoint, from your website to your invoices, feel like it comes from the same professional business.",
      "We start by understanding your business, audience and personality, then develop design concepts and refine them with your feedback.",
      "You receive your final files in the formats you need for web, social media and print, along with simple guidelines that help everyone use your brand correctly.",
    ],
    deliverables: [
      { title: "Logo design", description: "Original logo concepts refined into a final mark with variations for different uses." },
      { title: "Colour and typography", description: "A defined palette and font pairing for consistent communication." },
      { title: "Brand guidelines", description: "A concise guide covering logo usage, colours, fonts and examples." },
      { title: "Business stationery", description: "Business cards, letterheads and email signatures." },
      { title: "Social media graphics", description: "Profile images, cover images and post templates." },
      { title: "Marketing materials", description: "Flyers, brochures, banners and other print or digital collateral." },
    ],
    idealFor: [
      "New businesses that need a logo and identity",
      "Businesses whose branding looks inconsistent across channels",
      "Companies preparing for a new website or product launch",
      "Teams that need ready-to-use marketing templates",
    ],
    process: [
      { title: "Brief", description: "We discuss your business, audience, competitors and preferences." },
      { title: "Concepts", description: "We present initial design directions." },
      { title: "Refine", description: "We refine your chosen direction based on feedback." },
      { title: "Finalise", description: "We prepare final artwork and supporting assets." },
      { title: "Deliver", description: "We hand over files and guidelines in the formats you need." },
    ],
    pricingFactors: [
      "Whether you need a new identity or a refresh",
      "Number of concepts and revision rounds",
      "The range of supporting materials required",
      "Print production requirements",
    ],
    faqs: [
      {
        question: "What files will I receive?",
        answer:
          "You receive your logo in vector and high-resolution formats suitable for web, social media and print, including versions for light and dark backgrounds where appropriate.",
      },
      {
        question: "Can you update my existing logo rather than replace it?",
        answer:
          "Yes. A refresh can modernise your existing logo while keeping the recognition you have already built.",
      },
      {
        question: "Do you design social media posts?",
        answer:
          "Yes. We can design individual graphics or reusable templates that keep your posts consistent with your brand.",
      },
    ],
    related: ["web-design", "ecommerce-development", "seo"],
  },
  {
    slug: "maintenance",
    title: "Digital Maintenance and Technical Support",
    shortTitle: "Maintenance and Support",
    icon: "wrench",
    accent: "teal",
    summary:
      "Updates, backups, security checks and content changes that keep your website healthy, secure and up to date.",
    benefits: ["Updates and backups", "Security monitoring", "Content changes on request"],
    published: true,
    seo: {
      title: "Website Maintenance and Technical Support",
      description:
        "Website maintenance plans covering updates, backups, security checks, uptime monitoring and content changes, so your site stays fast, secure and current.",
    },
    hero: {
      heading: "Digital Maintenance and Technical Support",
      intro:
        "A website needs regular care to stay secure and work properly. Our maintenance and support services keep your software updated, your data backed up and your content current, so you can focus on running your business.",
    },
    overview: [
      "Websites are not set-and-forget. Software components need updates, security vulnerabilities need patching, and content needs to keep up with your business.",
      "Our maintenance service handles the routine technical work and gives you a single point of contact when something needs to change or something goes wrong.",
      "We agree the scope of support in advance, so you know what is covered and how quickly we respond.",
    ],
    deliverables: [
      { title: "Software updates", description: "Regular updates to your website's platform, plugins and dependencies." },
      { title: "Backups", description: "Scheduled backups so your site and data can be restored if needed." },
      { title: "Security checks", description: "Monitoring for vulnerabilities, suspicious activity and expired certificates." },
      { title: "Uptime monitoring", description: "Alerts if your website becomes unavailable." },
      { title: "Content updates", description: "Text, image and page changes within your plan's allowance." },
      { title: "Technical support", description: "Help with website, domain and email issues." },
    ],
    idealFor: [
      "Businesses without an in-house technical team",
      "Websites that are not regularly updated",
      "Online stores where downtime directly affects sales",
      "Owners who want one reliable contact for website issues",
    ],
    process: [
      { title: "Health check", description: "We review your site's current condition and risks." },
      { title: "Agree a plan", description: "We confirm what is covered and how support requests work." },
      { title: "Set up monitoring", description: "We configure backups, monitoring and access." },
      { title: "Maintain", description: "We carry out routine updates and checks." },
      { title: "Support", description: "We handle your requests and keep you informed." },
    ],
    pricingFactors: [
      "Website platform and complexity",
      "How often updates and backups are required",
      "Number of content changes included each month",
      "Response time expectations",
    ],
    faqs: [
      {
        question: "Can you maintain a website you did not build?",
        answer:
          "Usually, yes. We start with a health check to understand how the site was built and identify any risks before agreeing a maintenance plan.",
      },
      {
        question: "What happens if my website goes down?",
        answer:
          "With uptime monitoring in place, we are alerted when your site becomes unavailable and investigate the cause. Response times are agreed as part of your plan.",
      },
      {
        question: "Is maintenance a monthly service?",
        answer:
          "Maintenance is normally provided as an ongoing monthly plan, although once-off fixes and updates can also be quoted.",
      },
    ],
    related: ["web-hosting-domains", "web-design", "seo"],
  },
];

/**
 * Listed in the brief as "where offered". Kept unpublished until the business
 * confirms it is offered. Set `published: true` and add a page to show it.
 */
export const optionalServices = [
  {
    title: "Client Account and Payment Solutions",
    summary: "Secure client accounts and online payment integration for invoices and services.",
    published: false,
  },
];

export const publishedServices = services.filter((s) => s.published);

export function getService(slug: string) {
  return publishedServices.find((s) => s.slug === slug);
}
