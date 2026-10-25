import type { FAQ } from "./services";

export const valueProps = [
  {
    icon: "target",
    title: "Business-focused solutions",
    description: "Every recommendation starts with your goals, whether that is more enquiries, more sales or a stronger brand.",
  },
  {
    icon: "smartphone",
    title: "Responsive by default",
    description: "Websites designed and tested for phones, tablets and desktops, so every visitor gets a good experience.",
  },
  {
    icon: "gauge",
    title: "Search visibility and performance",
    description: "Fast pages and solid SEO foundations that help customers find you and stay on your site.",
  },
  {
    icon: "layers",
    title: "Integrated digital services",
    description: "Websites, apps, hosting, domains, SEO and branding from one team, so everything works together.",
  },
  {
    icon: "lifebuoy",
    title: "Ongoing support",
    description: "Maintenance and technical support after launch, with a single point of contact.",
  },
] as const;

export const differentiators = [
  {
    title: "One partner, many services",
    description:
      "Instead of juggling a designer, a developer, a hosting company and an SEO consultant, you work with one team that understands how the pieces fit.",
  },
  {
    title: "Practical, not complicated",
    description:
      "We recommend what your business needs now, explain it in plain language and leave room to grow later.",
  },
  {
    title: "Transparent packages",
    description:
      "Clear inclusions, clear exclusions and recurring fees explained upfront, so there are no surprises on your invoice.",
  },
  {
    title: "Built for enquiries",
    description:
      "Clear messaging, visible calls to action and working forms, because a website should help you win customers.",
  },
  {
    title: "Professional support",
    description: "We stay available after launch for updates, fixes and advice when your business changes.",
  },
  {
    title: "Responsive and accessible",
    description: "Modern, accessible code that works across devices and is easier for everyone to use.",
  },
] as const;

export const processSteps = [
  { title: "Discover", description: "We get to know your business, your customers and what you want to achieve." },
  { title: "Plan", description: "We recommend the right solution, scope and timeline, with a clear quotation." },
  { title: "Build", description: "We design, develop and thoroughly test your website or service." },
  { title: "Launch and Support", description: "We deploy, monitor and maintain it, and stay on hand as you grow." },
] as const;

export const homeFaqs: FAQ[] = [
  {
    question: "How long does it take to build a website?",
    answer:
      "Timelines depend on the number of pages, the functionality required and how quickly content and feedback are available. Small business websites typically take a few weeks. We confirm a timeline in your quotation.",
  },
  {
    question: "Can you register my domain and host my website?",
    answer:
      "Yes. We register .co.za and international domains in your business's name, set up hosting and SSL, and can configure business email on your domain.",
  },
  {
    question: "What does your SEO service include?",
    answer:
      "Our SEO work covers technical audits, keyword and intent research, on-page optimisation, local SEO guidance and reporting through Google Search Console. We do not promise specific rankings, because no one can honestly guarantee them.",
  },
  {
    question: "Do you build online stores?",
    answer:
      "Yes. We build e-commerce websites with product catalogues, cart and checkout, and integration with a reputable payment gateway so payments are processed securely by the provider.",
  },
  {
    question: "Do you offer website maintenance?",
    answer:
      "Yes. Maintenance plans cover software updates, backups, security and uptime monitoring, content changes and technical support.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Pricing depends on scope: the number of pages, features, integrations and whether you need help with content. Tell us about your project and we will send a tailored quotation with all once-off and recurring costs listed.",
  },
  {
    question: "Can you integrate online payments into my website?",
    answer:
      "Yes. We can integrate a payment gateway for online stores and other payment needs. The payment provider handles card data and charges its own transaction fees, which we explain before you commit.",
  },
];
