/**
 * Areas we serve. Each entry becomes a /locations/[slug] landing page and is
 * listed on /locations, in the footer, in the sitemap and in the structured
 * data. Every city has its own copy (local economy, industries, areas and
 * FAQs) so the pages are genuinely useful rather than near-duplicates.
 * Only state facts about the business that are verified: we work with these
 * areas remotely and do not claim an office in each city.
 */

import type { FAQ } from "@/content/services";

export type Province =
  | "Gauteng"
  | "KwaZulu-Natal"
  | "Western Cape"
  | "Northern Cape"
  | "North West"
  | "Free State"
  | "Mpumalanga"
  | "Eastern Cape"
  | "Limpopo";

export type Location = {
  slug: string;
  name: string;
  /** Other names people search with, e.g. "Port Elizabeth" for Gqeberha. */
  alsoKnownAs?: string;
  province: Province;
  /** Short regional label shown under the city name. */
  region: string;
  seo: { title: string; description: string };
  intro: string;
  /** Why an online presence matters for businesses in this city. */
  market: string[];
  /** Local sectors and how we help them. */
  industries: { title: string; description: string }[];
  /** City-specific angle for the services most relevant here. */
  serviceFocus: { service: string; text: string }[];
  /** Suburbs and nearby towns, used on the page and as areaServed. */
  areas: string[];
  faqs: FAQ[];
  nearby: string[];
};

export const locations: Location[] = [
  {
    slug: "vanderbijlpark",
    name: "Vanderbijlpark",
    province: "Gauteng",
    region: "Vaal Triangle, Gauteng",
    seo: {
      title: "Web Design, SEO and Hosting in Vanderbijlpark",
      description:
        "Website design, SEO, hosting, apps and branding for Vanderbijlpark businesses. Get found on Google by customers across the Vaal Triangle. Request a quote.",
    },
    intro:
      "Incognito Digital Solutions helps Vanderbijlpark businesses win more customers online, with fast websites, local SEO, reliable hosting and branding built for the Vaal Triangle market.",
    market: [
      "Vanderbijlpark grew up around steel, and engineering, fabrication and industrial suppliers remain a big part of the local economy. Alongside them is a growing base of retailers, trades, medical practices and student-focused businesses around the Vaal University of Technology.",
      "Buyers in the Vaal increasingly start with a Google search, whether they are a procurement officer looking for a fabrication supplier or a family looking for a plumber in SE2. A clear website and a strong local search presence put your business in front of them before they call a competitor.",
    ],
    industries: [
      { title: "Engineering and fabrication", description: "Capability-led websites with project galleries, certifications and RFQ forms that help industrial buyers shortlist you." },
      { title: "Trades and home services", description: "Mobile-friendly sites with click-to-call buttons and local SEO for searches like \"electrician Vanderbijlpark\"." },
      { title: "Student accommodation and services", description: "Listing pages, booking enquiries and social-ready branding aimed at VUT students and their parents." },
      { title: "Medical and professional practices", description: "Trustworthy, POPIA-aware websites with clear service pages and appointment requests." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Websites that explain your capabilities clearly to both industrial buyers and local consumers in the Vaal." },
      { service: "seo", text: "Local SEO and Google Business Profile optimisation so you appear for Vanderbijlpark and Vaal Triangle searches." },
      { service: "web-hosting-domains", text: "Managed hosting, .co.za domains and business email so your site and inbox stay online." },
    ],
    areas: ["Vanderbijlpark CE and CW", "SE suburbs (SE1 to SE7)", "SW suburbs", "Sylviavale", "Bonanne", "Bophelong", "Boipatong", "Sebokeng", "Vaalpark", "Sasolburg"],
    faqs: [
      {
        question: "Do you work with businesses in Vanderbijlpark?",
        answer:
          "Yes. We work with Vanderbijlpark and Vaal Triangle businesses by phone, email and video call, so you get the same service as a city-centre agency without the travel.",
      },
      {
        question: "Can you help my business show up on Google Maps in the Vaal?",
        answer:
          "Yes. We set up or optimise your Google Business Profile, add your services and service areas, and build location pages on your website so Google understands where you work.",
      },
      {
        question: "Do you build websites for industrial and engineering companies?",
        answer:
          "Yes. We build capability-focused websites with service breakdowns, project galleries, certifications and request-for-quote forms that suit B2B buyers.",
      },
    ],
    nearby: ["vereeniging", "alberton", "johannesburg"],
  },
  {
    slug: "vereeniging",
    name: "Vereeniging",
    province: "Gauteng",
    region: "Vaal Triangle, Gauteng",
    seo: {
      title: "Web Design, SEO and Hosting in Vereeniging",
      description:
        "Professional websites, local SEO, hosting and branding for Vereeniging and Vaal River businesses. Reach more local customers on Google. Request a quote.",
    },
    intro:
      "From Three Rivers to Arcon Park, we help Vereeniging businesses look professional online and get found by customers searching across the Vaal.",
    market: [
      "Vereeniging is the commercial centre of the Vaal Triangle, with established retail, engineering, logistics and professional services, plus a leisure economy along the Vaal River that includes guesthouses, wedding venues, boating and restaurants.",
      "Many of those customers come from Johannesburg and the wider Gauteng area, which means they find you online first. A modern website with good photos, clear prices or packages and a strong Google presence turns that search into a booking.",
    ],
    industries: [
      { title: "Venues, guesthouses and leisure", description: "Image-rich websites with packages, availability enquiries and reviews that convert weekend visitors from Gauteng." },
      { title: "Retail and local services", description: "Online catalogues, WhatsApp-ready contact options and local SEO for neighbourhood searches." },
      { title: "Engineering and logistics", description: "Clean B2B websites that make it easy for buyers to understand what you supply and request a quote." },
      { title: "Schools and community organisations", description: "Easy-to-update sites for news, events, enrolment information and contact forms." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Photo-led websites that sell the Vaal River experience or show off your products and projects." },
      { service: "seo", text: "Local SEO for Vereeniging, Three Rivers and Meyerton searches, plus Google Business Profile optimisation." },
      { service: "ecommerce-development", text: "Online shops and booking flows so customers can buy or reserve without phoning first." },
    ],
    areas: ["Vereeniging CBD", "Three Rivers", "Arcon Park", "Duncanville", "Unitas Park", "Peacehaven", "Sharpeville", "Meyerton", "Henley on Klip", "Vaal Marina"],
    faqs: [
      {
        question: "Do you offer website design in Vereeniging?",
        answer:
          "Yes. We design and build websites for Vereeniging businesses and handle the project remotely, with calls and video meetings at times that suit you.",
      },
      {
        question: "Can you build a booking website for my venue or guesthouse?",
        answer:
          "Yes. We build websites with galleries, packages and enquiry or booking forms, and we can connect online payments or a booking system if you need one.",
      },
      {
        question: "How long does local SEO take to work in the Vaal?",
        answer:
          "Most businesses see early movement in Google Maps within a few weeks of a properly optimised Business Profile. Ranking pages on your website usually takes three to six months, depending on competition.",
      },
    ],
    nearby: ["vanderbijlpark", "alberton", "johannesburg"],
  },
  {
    slug: "alberton",
    name: "Alberton",
    province: "Gauteng",
    region: "Ekurhuleni, Gauteng",
    seo: {
      title: "Web Design, SEO and Hosting in Alberton",
      description:
        "Websites, local SEO, hosting and branding for Alberton and Ekurhuleni businesses, from Alrode suppliers to Meyersdal practices. Request a quote today.",
    },
    intro:
      "We help Alberton businesses, from Alrode manufacturers to family-run shops in New Redruth, build a professional online presence that brings in local enquiries.",
    market: [
      "Alberton sits on the south side of Ekurhuleni, close to the N3, R59 and Johannesburg. The Alrode industrial area is home to manufacturers, distributors and automotive businesses, while suburbs like Meyersdal, Brackenhurst and Randhart support busy retail, medical and home-service sectors.",
      "With Johannesburg and Germiston competitors only minutes away, local businesses need to stand out in search results. A fast website and an optimised Google Business Profile help you win the \"near me\" searches that happen on customers' phones.",
    ],
    industries: [
      { title: "Manufacturing and distribution", description: "Product and capability websites for Alrode businesses, with catalogues and trade enquiry forms." },
      { title: "Automotive services", description: "Workshop, panel beater and parts websites with service menus, booking requests and Google Maps visibility." },
      { title: "Healthcare and wellness", description: "Practice websites with practitioner profiles, services and appointment requests." },
      { title: "Home services", description: "Local SEO and lead-focused sites for builders, plumbers, solar installers and security companies." },
    ],
    serviceFocus: [
      { service: "seo", text: "Local SEO targeting Alberton and nearby Ekurhuleni suburbs so you show up for \"near me\" searches." },
      { service: "web-design", text: "Lead-focused websites with clear calls to action for trades, workshops and practices." },
      { service: "maintenance", text: "Ongoing updates, backups and security monitoring so your site keeps working while you run the business." },
    ],
    areas: ["Alberton North", "New Redruth", "Alberante", "Brackenhurst", "Brackendowns", "Meyersdal", "Randhart", "Raceview", "Alrode", "Thokoza", "Germiston"],
    faqs: [
      {
        question: "Do you work with Alberton businesses?",
        answer:
          "Yes. We work with businesses across Alberton and Ekurhuleni. Projects run by phone, email and video call, so there is no need to travel to a meeting.",
      },
      {
        question: "Can you create an online catalogue for my Alrode business?",
        answer:
          "Yes. We can build a product catalogue with categories, specifications and quote requests, or a full online shop if you want to sell directly.",
      },
      {
        question: "Will my website work well on mobile phones?",
        answer:
          "Yes. Every site we build is mobile-first and tested on phones and tablets, because most local searches happen on a phone.",
      },
    ],
    nearby: ["johannesburg", "vereeniging", "sandton"],
  },
  {
    slug: "johannesburg",
    name: "Johannesburg",
    province: "Gauteng",
    region: "City of Johannesburg, Gauteng",
    seo: {
      title: "Web Design, SEO and App Development in Johannesburg",
      description:
        "Website design, SEO, mobile apps, hosting and branding for Johannesburg businesses. Compete in Joburg's crowded search results. Request a quote.",
    },
    intro:
      "Johannesburg is South Africa's most competitive market online. We help Joburg businesses stand out with sharp websites, apps, SEO and branding that turn searches into customers.",
    market: [
      "Johannesburg is the economic heart of South Africa, with finance, retail, media, technology and professional services all competing for attention. From Braamfontein start-ups to Randburg retailers and Soweto entrepreneurs, almost every business is up against dozens of rivals on Google.",
      "In a market this busy, a generic template website is not enough. You need a fast, well-structured site, content that answers buyers' questions, and an SEO plan that targets the specific suburbs and services your customers search for.",
    ],
    industries: [
      { title: "Professional services", description: "Authoritative websites for consultants, accountants and legal firms that build trust and generate qualified leads." },
      { title: "Start-ups and tech", description: "Product websites, web apps and mobile apps built to launch quickly and scale as you grow." },
      { title: "Retail and e-commerce", description: "Online shops with South African payment gateways, delivery options and stock management." },
      { title: "Hospitality and events", description: "Restaurant, venue and events sites with menus, bookings and strong Google Maps presence." },
    ],
    serviceFocus: [
      { service: "seo", text: "Suburb-level and service-level SEO strategies to compete in Johannesburg's crowded search results." },
      { service: "mobile-app-development", text: "iOS, Android and web apps for Johannesburg start-ups and established businesses." },
      { service: "ecommerce-development", text: "Online stores with local payment gateways and courier integrations." },
    ],
    areas: ["Johannesburg CBD", "Braamfontein", "Maboneng", "Rosebank", "Parktown", "Melville", "Randburg", "Fourways", "Midrand", "Roodepoort", "Soweto", "Northcliff"],
    faqs: [
      {
        question: "Are you a Johannesburg web design company?",
        answer:
          "We are a South African digital solutions company that works with Johannesburg businesses every day. Projects run remotely by phone, email and video call, which keeps them efficient and affordable.",
      },
      {
        question: "Can you help us rank for competitive searches in Johannesburg?",
        answer:
          "Yes. We start with keyword research for your services and suburbs, fix technical issues, improve your pages and build supporting content. Competitive terms take time, so we report progress monthly.",
      },
      {
        question: "Do you build mobile apps for Johannesburg businesses?",
        answer:
          "Yes. We design and build apps for iOS, Android and the web, from customer-facing apps to internal tools.",
      },
    ],
    nearby: ["sandton", "alberton", "pretoria"],
  },
  {
    slug: "sandton",
    name: "Sandton",
    province: "Gauteng",
    region: "Northern Johannesburg, Gauteng",
    seo: {
      title: "Web Design, SEO and Digital Solutions in Sandton",
      description:
        "Premium websites, SEO, apps and branding for Sandton firms, from Rivonia start-ups to corporate offices. Look as good online as you do in person.",
    },
    intro:
      "Sandton businesses compete on reputation. We build premium websites, apps and brands for Sandton firms that need to look as polished online as they do in the boardroom.",
    market: [
      "Sandton is home to the Johannesburg Stock Exchange and the head offices of many of South Africa's largest companies. Around them is a dense network of law firms, financial advisers, consultancies, property businesses, luxury retailers and hospitality brands.",
      "Clients in Sandton judge a business by its website within seconds. A slow or dated site undermines trust, while a polished, fast and well-written one supports every sales conversation and pitch.",
    ],
    industries: [
      { title: "Finance and advisory", description: "Credible, compliant websites with clear service explanations, team profiles and secure contact forms." },
      { title: "Legal and consulting", description: "Content-rich sites that showcase expertise through insights, case studies and practice-area pages." },
      { title: "Property and real estate", description: "Listing-friendly websites with search, galleries and lead capture for agents and developers." },
      { title: "Luxury retail and hospitality", description: "Brand-led design and e-commerce that reflects a premium positioning." },
    ],
    serviceFocus: [
      { service: "branding", text: "Brand identities and guidelines for Sandton firms that need a consistent, premium image." },
      { service: "web-design", text: "High-end corporate websites with fast performance and strong accessibility." },
      { service: "mobile-app-development", text: "Client portals, booking apps and internal tools for growing Sandton businesses." },
    ],
    areas: ["Sandton CBD", "Sandown", "Morningside", "Bryanston", "Rivonia", "Sunninghill", "Illovo", "Hyde Park", "Wendywood", "Woodmead", "Paulshof", "Lonehill"],
    faqs: [
      {
        question: "Do you work with Sandton companies?",
        answer:
          "Yes. We work with Sandton firms of all sizes, from start-ups in Rivonia to established professional practices. Projects run by phone, email and video meetings.",
      },
      {
        question: "Can you redesign our corporate website without losing our Google rankings?",
        answer:
          "Yes. We map your existing URLs, set up permanent redirects, keep your best-performing content and monitor Search Console after launch so rankings are protected.",
      },
      {
        question: "Do you offer branding as well as websites?",
        answer:
          "Yes. We design logos, brand identities and guidelines, and apply them consistently across your website, documents and social media.",
      },
    ],
    nearby: ["johannesburg", "pretoria", "alberton"],
  },
  {
    slug: "umhlanga",
    name: "Umhlanga",
    province: "KwaZulu-Natal",
    region: "Durban North Coast, KwaZulu-Natal",
    seo: {
      title: "Web Design, SEO and Hosting in Umhlanga",
      description:
        "Websites, SEO, hosting and branding for Umhlanga businesses, from Gateway offices to beachfront hospitality. Get found on Google. Request a quote.",
    },
    intro:
      "We help Umhlanga businesses, from Umhlanga Ridge offices to beachfront hotels and restaurants, attract more customers through great websites and local search.",
    market: [
      "Umhlanga has become one of KwaZulu-Natal's busiest business and lifestyle hubs. Umhlanga Ridge and the Gateway area host corporate offices, medical specialists and property developers, while the beachfront draws tourists and local visitors year-round.",
      "Visitors and new residents rely on Google to choose where to eat, stay, shop and get services. Businesses with a strong Google Business Profile, good reviews and a fast mobile website capture most of that demand.",
    ],
    industries: [
      { title: "Hospitality and tourism", description: "Hotel, guesthouse and restaurant sites with bookings, menus and photo galleries that convert visitors." },
      { title: "Property and development", description: "Development showcases and agent websites with listings, floor plans and enquiry capture." },
      { title: "Medical specialists", description: "Professional practice websites with specialist profiles, procedures and appointment requests." },
      { title: "Corporate and professional services", description: "Polished company websites for firms based in the Umhlanga Ridge business district." },
    ],
    serviceFocus: [
      { service: "seo", text: "Local SEO for Umhlanga, La Lucia and the north coast, including Google Maps optimisation." },
      { service: "web-design", text: "Visually rich websites that showcase properties, venues and the coastal lifestyle." },
      { service: "web-hosting-domains", text: "Fast, secure hosting and professional email for growing north coast businesses." },
    ],
    areas: ["Umhlanga Rocks", "Umhlanga Ridge", "Gateway", "La Lucia", "Mount Edgecombe", "Sibaya", "Durban North", "Glenashley", "Ballito"],
    faqs: [
      {
        question: "Do you provide web design in Umhlanga?",
        answer:
          "Yes. We work with Umhlanga and north coast businesses remotely, by phone, email and video call, so distance is never a barrier.",
      },
      {
        question: "Can you help my restaurant or guesthouse get more bookings?",
        answer:
          "Yes. We build fast mobile websites with menus or rooms, online booking or enquiry forms, and optimise your Google Business Profile so you appear when visitors search nearby.",
      },
      {
        question: "Do you also work in Durban and Ballito?",
        answer:
          "Yes. We work with businesses across the greater Durban area, including the north coast up to Ballito.",
      },
    ],
    nearby: ["durban", "mbombela", "gqeberha"],
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    province: "Western Cape",
    region: "City of Cape Town, Western Cape",
    seo: {
      title: "Web Design, SEO and App Development in Cape Town",
      description:
        "Website design, SEO, apps, e-commerce and branding for Cape Town businesses, from tech start-ups to tourism. Request a quote from Incognito.",
    },
    intro:
      "Cape Town has a strong design and start-up culture. We help Cape Town businesses compete with websites, apps and SEO that are fast, beautiful and built to convert.",
    market: [
      "Cape Town combines a thriving tech and start-up scene with tourism, wine, film, creative agencies and a large financial and retail sector. Areas like Woodstock, Century City and the CBD are full of businesses that sell to customers across South Africa and overseas.",
      "Because so many Cape Town businesses serve tourists and international clients, your website often has to work for local and foreign visitors at once, with clear information, strong visuals and easy ways to book or buy.",
    ],
    industries: [
      { title: "Tourism and experiences", description: "Tour, accommodation and activity websites with bookings and content that ranks for visitor searches." },
      { title: "Tech start-ups", description: "Product sites, web apps and mobile apps built to launch quickly and iterate." },
      { title: "Food, wine and lifestyle", description: "Brand-led sites and online shops for restaurants, wine estates and lifestyle brands." },
      { title: "Creative and professional services", description: "Portfolio-style websites that showcase work and win new clients." },
    ],
    serviceFocus: [
      { service: "mobile-app-development", text: "Apps and web platforms for Cape Town start-ups and scale-ups." },
      { service: "ecommerce-development", text: "Online stores that ship nationally and internationally, with local payment options." },
      { service: "seo", text: "SEO that targets both local Cape Town searches and visitors planning trips." },
    ],
    areas: ["Cape Town CBD", "Woodstock", "Sea Point", "Green Point", "Century City", "Claremont", "Rondebosch", "Bellville", "Durbanville", "Tableview", "Somerset West", "Stellenbosch"],
    faqs: [
      {
        question: "Do you work with businesses in Cape Town?",
        answer:
          "Yes. We work with Cape Town businesses remotely. Video calls and shared project boards keep everything moving quickly, wherever you are in the Western Cape.",
      },
      {
        question: "Can you build a website for international visitors?",
        answer:
          "Yes. We can design for international audiences, with clear pricing, time-zone friendly contact options and online payments that accept international cards.",
      },
      {
        question: "Do you build apps for Cape Town start-ups?",
        answer:
          "Yes. We help start-ups plan a first release, design the experience and build iOS, Android or web apps that can grow with the business.",
      },
    ],
    nearby: ["gqeberha", "kimberley", "bloemfontein"],
  },
  {
    slug: "pretoria",
    name: "Pretoria",
    alsoKnownAs: "Tshwane",
    province: "Gauteng",
    region: "City of Tshwane, Gauteng",
    seo: {
      title: "Web Design, SEO and Hosting in Pretoria",
      description:
        "Website design, SEO, apps, hosting and branding for Pretoria and Centurion businesses. Get found by customers across Tshwane. Request a quote.",
    },
    intro:
      "We help Pretoria and Centurion businesses build credible, fast websites and the search visibility to match, from Menlyn retailers to Hatfield start-ups.",
    market: [
      "Pretoria is South Africa's administrative capital, home to government departments, embassies, research institutions and major universities including the University of Pretoria, Tshwane University of Technology and UNISA. Around them are thousands of consultants, suppliers, medical practices, retailers and service businesses.",
      "Many Pretoria businesses supply government, NGOs or larger organisations, where a professional website and clear credentials matter. Others serve busy suburbs like Menlyn, Brooklyn and Centurion, where customers expect to find and contact you on their phone in seconds.",
    ],
    industries: [
      { title: "Government suppliers and consultants", description: "Credible company websites with capability statements, compliance information and downloadable profiles." },
      { title: "Education and training", description: "Websites for tutors, colleges and training providers with course listings and enrolment enquiries." },
      { title: "Healthcare", description: "Practice websites with services, practitioners and appointment requests." },
      { title: "Retail and hospitality", description: "Local SEO and online ordering for shops, restaurants and service businesses in Menlyn, Brooklyn and Centurion." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Professional websites that present your credentials clearly to government and corporate buyers." },
      { service: "seo", text: "Local SEO for Pretoria, Centurion and individual Tshwane suburbs." },
      { service: "maintenance", text: "Updates, backups and security monitoring so your website stays reliable." },
    ],
    areas: ["Pretoria CBD", "Hatfield", "Brooklyn", "Arcadia", "Menlyn", "Lynnwood", "Faerie Glen", "Garsfontein", "Montana", "Silverton", "Centurion", "Pretoria East"],
    faqs: [
      {
        question: "Do you offer web design in Pretoria?",
        answer:
          "Yes. We work with Pretoria and Centurion businesses remotely, by phone, email and video call, with the same process and quality on every project.",
      },
      {
        question: "Can you create a company profile website for tenders?",
        answer:
          "Yes. We build websites that present your services, experience, accreditations and team clearly, with a downloadable company profile if you need one.",
      },
      {
        question: "Do you also cover Centurion and Midrand?",
        answer:
          "Yes. We work with businesses across Tshwane, Centurion and Midrand, and can target each area separately in your SEO.",
      },
    ],
    nearby: ["johannesburg", "sandton", "polokwane"],
  },
  {
    slug: "kimberley",
    name: "Kimberley",
    province: "Northern Cape",
    region: "Northern Cape",
    seo: {
      title: "Web Design, SEO and Hosting in Kimberley",
      description:
        "Websites, SEO, hosting and branding for Kimberley and Northern Cape businesses. Reach customers across the Diamond City and beyond. Request a quote.",
    },
    intro:
      "We help Kimberley businesses reach more customers across the Northern Cape with professional websites, local search visibility and reliable hosting.",
    market: [
      "Kimberley is the capital of the Northern Cape and a regional centre for government, mining, agriculture, education and tourism. The Big Hole and the city's diamond history attract visitors, while Sol Plaatje University and provincial government bring steady demand for services.",
      "Because the Northern Cape is vast and towns are far apart, customers often search online before travelling. A business that is easy to find on Google, with clear contact details and opening hours, gets the call ahead of competitors.",
    ],
    industries: [
      { title: "Tourism and accommodation", description: "Guesthouse and tour websites with galleries, packages and bookings for visitors to the Diamond City." },
      { title: "Mining and agricultural suppliers", description: "Capability websites and product catalogues that serve customers across a wide region." },
      { title: "Government suppliers", description: "Credible company websites with clear services, credentials and company profiles." },
      { title: "Local retail and services", description: "Mobile-friendly sites and Google Business Profile optimisation for walk-in and phone customers." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Clear, fast websites that help regional customers understand what you offer before they travel." },
      { service: "seo", text: "Local SEO for Kimberley and surrounding Northern Cape towns." },
      { service: "web-hosting-domains", text: ".co.za domains, hosting and business email set up and managed for you." },
    ],
    areas: ["Kimberley CBD", "Belgravia", "Royldene", "Monument Heights", "Hadison Park", "Kimberley North", "Cassandra", "Galeshewe", "Ritchie", "Barkly West"],
    faqs: [
      {
        question: "Do you work with businesses in Kimberley?",
        answer:
          "Yes. We work with Kimberley and Northern Cape businesses entirely remotely, by phone, email and video call.",
      },
      {
        question: "Can you help tourists find my guesthouse online?",
        answer:
          "Yes. We build booking-friendly websites and optimise your Google Business Profile so visitors find you when they search for accommodation in Kimberley.",
      },
      {
        question: "Can you register a .co.za domain and set up email for me?",
        answer:
          "Yes. We register your domain, set up hosting and professional email addresses, and manage renewals so nothing expires unexpectedly.",
      },
    ],
    nearby: ["bloemfontein", "rustenburg", "cape-town"],
  },
  {
    slug: "rustenburg",
    name: "Rustenburg",
    province: "North West",
    region: "Bojanala, North West",
    seo: {
      title: "Web Design, SEO and Hosting in Rustenburg",
      description:
        "Websites, SEO, hosting and branding for Rustenburg businesses, from mining suppliers to Pilanesberg tourism. Get found on Google. Request a quote.",
    },
    intro:
      "We help Rustenburg businesses, from mining contractors to lodges near Pilanesberg, build a professional online presence that brings in work.",
    market: [
      "Rustenburg sits at the centre of one of the world's richest platinum-producing regions, and mining, engineering contractors and industrial suppliers drive much of the local economy. Tourism is the other big draw, with Pilanesberg National Park, Sun City and the Magaliesberg close by.",
      "Mining houses and contractors check suppliers online before inviting them to quote, and tourists book lodges and activities from their phones. In both cases, a strong website and Google presence decide who gets the business.",
    ],
    industries: [
      { title: "Mining suppliers and contractors", description: "B2B websites with capabilities, safety credentials, project references and RFQ forms." },
      { title: "Lodges and tourism", description: "Booking-ready websites for lodges, game drives and activities near Pilanesberg and the Magaliesberg." },
      { title: "Automotive and trades", description: "Service websites with booking requests and Google Maps visibility for workshops and contractors." },
      { title: "Retail and local services", description: "Mobile-first websites and local SEO for shops and service businesses in town." },
    ],
    serviceFocus: [
      { service: "web-design", text: "B2B websites that show mining houses your capabilities, safety record and experience." },
      { service: "seo", text: "Local SEO for Rustenburg, Phokeng and surrounding Bojanala towns." },
      { service: "branding", text: "Logos and brand identities that help contractors and lodges look established and trustworthy." },
    ],
    areas: ["Rustenburg CBD", "Waterfall East", "Cashan", "Protea Park", "Safari Gardens", "Geelhoutpark", "Tlhabane", "Phokeng", "Boitekong", "Mooinooi", "Kroondal"],
    faqs: [
      {
        question: "Do you build websites for mining suppliers in Rustenburg?",
        answer:
          "Yes. We build B2B websites that present your services, equipment, safety credentials and project experience clearly, with a request-for-quote form.",
      },
      {
        question: "Can you help my lodge get more direct bookings?",
        answer:
          "Yes. A fast website with good photos, clear rates and a booking or enquiry form, plus an optimised Google Business Profile, helps you win direct bookings instead of paying high commission.",
      },
      {
        question: "Do you work with businesses outside Rustenburg town?",
        answer:
          "Yes. We work with businesses across the North West, including Phokeng, Mooinooi, Brits and the Pilanesberg area.",
      },
    ],
    nearby: ["pretoria", "johannesburg", "kimberley"],
  },
  {
    slug: "bloemfontein",
    name: "Bloemfontein",
    alsoKnownAs: "Mangaung",
    province: "Free State",
    region: "Mangaung, Free State",
    seo: {
      title: "Web Design, SEO and Hosting in Bloemfontein",
      description:
        "Website design, SEO, hosting and branding for Bloemfontein and Free State businesses. Get found by customers across Mangaung. Request a quote.",
    },
    intro:
      "We help Bloemfontein businesses build modern websites and the local search presence they need to reach customers across Mangaung and the Free State.",
    market: [
      "Bloemfontein is the Free State's capital and South Africa's judicial capital, home to the Supreme Court of Appeal, the University of the Free State and the Central University of Technology. Its position on the N1 makes it a hub for agriculture, logistics, healthcare and retail serving the whole province.",
      "Farmers, students, travellers and local families all search online for suppliers and services. Businesses that invest in a professional website and Google presence stand out in a market where many competitors still rely on word of mouth.",
    ],
    industries: [
      { title: "Agriculture and agri-suppliers", description: "Product catalogues and supplier websites for co-ops, equipment dealers and agri-businesses." },
      { title: "Legal and professional services", description: "Professional websites for law firms and advisers close to the courts and government offices." },
      { title: "Healthcare", description: "Practice and clinic websites with services, practitioners and appointment requests." },
      { title: "Student and youth markets", description: "Social-ready branding and websites for businesses serving UFS and CUT students." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Professional websites for Bloemfontein firms, practices and agri-businesses." },
      { service: "seo", text: "Local SEO for Bloemfontein suburbs and Free State towns along the N1." },
      { service: "ecommerce-development", text: "Online ordering and catalogues for suppliers serving customers across the province." },
    ],
    areas: ["Bloemfontein CBD", "Westdene", "Brandwag", "Universitas", "Langenhovenpark", "Bayswater", "Fichardt Park", "Willows", "Heuwelsig", "Mangaung", "Botshabelo", "Thaba Nchu"],
    faqs: [
      {
        question: "Do you offer web design in Bloemfontein?",
        answer:
          "Yes. We work with Bloemfontein and Free State businesses remotely, by phone, email and video call.",
      },
      {
        question: "Can you build an online catalogue for my agri-business?",
        answer:
          "Yes. We build product catalogues with categories, specifications and enquiry forms, or full online shops with delivery options.",
      },
      {
        question: "Can you help me rank in other Free State towns too?",
        answer:
          "Yes. We can create useful pages for each town you serve and set up your Google Business Profile service areas to match.",
      },
    ],
    nearby: ["kimberley", "vanderbijlpark", "gqeberha"],
  },
  {
    slug: "witbank",
    name: "Witbank",
    alsoKnownAs: "eMalahleni",
    province: "Mpumalanga",
    region: "Nkangala, Mpumalanga",
    seo: {
      title: "Web Design, SEO and Hosting in Witbank (eMalahleni)",
      description:
        "Websites, SEO, hosting and branding for Witbank and eMalahleni businesses, from mining and engineering suppliers to local services. Request a quote.",
    },
    intro:
      "We help Witbank businesses, from engineering suppliers to local retailers, win more work through professional websites and strong local search visibility.",
    market: [
      "Witbank, officially eMalahleni, is the centre of Mpumalanga's coal-mining and power-generation industry. Mines, power stations and steel and ferrochrome producers support a large network of engineering firms, plant hire companies, labour brokers and industrial suppliers.",
      "Procurement teams and site managers search for suppliers online and expect to see clear capabilities and contact details. At the same time, the city's growing residential areas create steady demand for retail, healthcare and home services.",
    ],
    industries: [
      { title: "Mining and engineering suppliers", description: "Capability websites with services, equipment lists, accreditations and RFQ forms." },
      { title: "Plant hire and logistics", description: "Fleet and equipment catalogues with availability enquiries and quick contact options." },
      { title: "Healthcare and practices", description: "Clean practice websites with services and appointment requests." },
      { title: "Home services and retail", description: "Local SEO and mobile-friendly websites for builders, security, solar and retail businesses." },
    ],
    serviceFocus: [
      { service: "web-design", text: "B2B websites that help mining and engineering buyers shortlist your business." },
      { service: "seo", text: "Local SEO for Witbank, eMalahleni and Middelburg searches." },
      { service: "web-hosting-domains", text: "Reliable hosting and business email so tenders and enquiries never go missing." },
    ],
    areas: ["Witbank CBD", "Del Judor", "Reyno Ridge", "Tasbet Park", "Ben Fleur", "Die Heuwel", "Klipfontein", "KwaGuqa", "Ackerville", "Kriel", "Middelburg"],
    faqs: [
      {
        question: "Do you work with businesses in Witbank (eMalahleni)?",
        answer:
          "Yes. We work with Witbank and Nkangala businesses remotely, by phone, email and video call.",
      },
      {
        question: "Can you build a website that helps us get on mine supplier lists?",
        answer:
          "Yes. We build websites that present your capabilities, safety credentials, B-BBEE status and project history clearly, with a downloadable company profile.",
      },
      {
        question: "Do you also work in Middelburg?",
        answer:
          "Yes. We work with businesses in Middelburg and across Mpumalanga, and can target each town in your SEO.",
      },
    ],
    nearby: ["mbombela", "pretoria", "polokwane"],
  },
  {
    slug: "mbombela",
    name: "Mbombela",
    alsoKnownAs: "Nelspruit",
    province: "Mpumalanga",
    region: "Ehlanzeni, Mpumalanga",
    seo: {
      title: "Web Design, SEO and Hosting in Mbombela (Nelspruit)",
      description:
        "Websites, SEO, hosting and branding for Mbombela and Lowveld businesses, from Kruger-area lodges to citrus exporters. Request a quote today.",
    },
    intro:
      "We help Mbombela and Lowveld businesses, from lodges near the Kruger to farming exporters and local retailers, reach more customers online.",
    market: [
      "Mbombela, still widely known as Nelspruit, is the capital of Mpumalanga and the commercial centre of the Lowveld. It is a gateway to the Kruger National Park and the Panorama Route, and the surrounding area is a major producer of citrus, macadamias and subtropical fruit.",
      "Tourism businesses compete for bookings from local and international visitors, while agricultural and export businesses need websites that build trust with buyers. Local shops and services need to show up when residents and visitors search nearby.",
    ],
    industries: [
      { title: "Lodges, safaris and tourism", description: "Booking-focused websites with galleries, rates and content that ranks for Kruger and Lowveld searches." },
      { title: "Agriculture and export", description: "Professional company websites that present your farms, products and certifications to buyers." },
      { title: "Retail and services", description: "Mobile-first websites and Google Business Profile optimisation for Riverside and city businesses." },
      { title: "Healthcare and professional services", description: "Practice and firm websites with services, team profiles and contact forms." },
    ],
    serviceFocus: [
      { service: "seo", text: "Local and tourism SEO for Mbombela, White River and Kruger-area searches." },
      { service: "web-design", text: "Visual websites that sell the Lowveld experience and convert visitors into bookings." },
      { service: "ecommerce-development", text: "Online shops and booking flows that accept local and international payments." },
    ],
    areas: ["Mbombela CBD", "Riverside Park", "Sonheuwel", "West Acres", "Steiltes", "Kanyamazane", "Matsulu", "White River", "Hazyview", "Barberton"],
    faqs: [
      {
        question: "Do you work with businesses in Mbombela (Nelspruit)?",
        answer:
          "Yes. We work with Mbombela and Lowveld businesses remotely, by phone, email and video call.",
      },
      {
        question: "Can you help my lodge rank for Kruger Park searches?",
        answer:
          "Yes. We build useful content about your location and experiences, optimise your Google Business Profile and make sure your site is fast on mobile, which helps you compete for visitor searches.",
      },
      {
        question: "Do you also serve White River and Hazyview?",
        answer:
          "Yes. We work with businesses across the Lowveld, including White River, Hazyview and Barberton.",
      },
    ],
    nearby: ["witbank", "polokwane", "umhlanga"],
  },
  {
    slug: "durban",
    name: "Durban",
    alsoKnownAs: "eThekwini",
    province: "KwaZulu-Natal",
    region: "eThekwini, KwaZulu-Natal",
    seo: {
      title: "Web Design, SEO and App Development in Durban",
      description:
        "Website design, SEO, apps, e-commerce and hosting for Durban businesses, from port logistics to beachfront tourism. Request a quote today.",
    },
    intro:
      "We help Durban businesses, from port logistics firms to Berea retailers and beachfront tourism, grow online with websites, apps and SEO that perform.",
    market: [
      "Durban is home to one of the busiest ports in Africa, which makes logistics, freight, manufacturing and import and export businesses central to the city's economy. Tourism, retail, healthcare and a large small-business sector make up much of the rest.",
      "Durban customers search online for everything from clearing agents to restaurants, and many businesses here serve clients across South Africa. A strong website and SEO strategy help you compete beyond your immediate area.",
    ],
    industries: [
      { title: "Logistics, freight and clearing", description: "B2B websites with service breakdowns, tracking links and quote requests for shippers." },
      { title: "Manufacturing", description: "Product and capability sites with catalogues and trade enquiry forms." },
      { title: "Tourism and hospitality", description: "Booking-ready websites for hotels, restaurants and activities along the coast." },
      { title: "Retail and e-commerce", description: "Online shops with local payment gateways and courier integrations." },
    ],
    serviceFocus: [
      { service: "web-design", text: "B2B and consumer websites for Durban businesses that serve customers nationwide." },
      { service: "ecommerce-development", text: "Online stores built for South African payments and delivery." },
      { service: "seo", text: "Local and national SEO for Durban, Westville, Pinetown and the south and north coasts." },
    ],
    areas: ["Durban CBD", "Berea", "Morningside", "Glenwood", "Musgrave", "Durban North", "Westville", "Pinetown", "Hillcrest", "Chatsworth", "Umlazi", "Amanzimtoti"],
    faqs: [
      {
        question: "Do you offer web design in Durban?",
        answer:
          "Yes. We work with Durban businesses remotely, by phone, email and video call, with clear timelines and regular check-ins.",
      },
      {
        question: "Can you build a website for a logistics or clearing company?",
        answer:
          "Yes. We build B2B websites that explain your services, routes and compliance clearly, with quote request forms and links to tracking systems.",
      },
      {
        question: "Do you also work in Umhlanga and Ballito?",
        answer:
          "Yes. We work across the greater Durban area, including Umhlanga and the north coast.",
      },
    ],
    nearby: ["umhlanga", "mbombela", "gqeberha"],
  },
  {
    slug: "gqeberha",
    name: "Gqeberha",
    alsoKnownAs: "Port Elizabeth",
    province: "Eastern Cape",
    region: "Nelson Mandela Bay, Eastern Cape",
    seo: {
      title: "Web Design, SEO and Hosting in Gqeberha (Port Elizabeth)",
      description:
        "Websites, SEO, hosting and branding for Gqeberha and Nelson Mandela Bay businesses, from automotive suppliers to tourism. Request a quote.",
    },
    intro:
      "We help Gqeberha and Nelson Mandela Bay businesses, from automotive suppliers to Summerstrand guesthouses, grow with websites and local SEO that work.",
    market: [
      "Gqeberha, formerly Port Elizabeth, is the heart of South Africa's automotive industry, with vehicle manufacturers and hundreds of component suppliers across Nelson Mandela Bay and Kariega. The Coega Special Economic Zone and the Port of Ngqura add manufacturing and logistics, while beaches and nearby game reserves support tourism.",
      "Automotive and industrial suppliers need websites that meet the expectations of large manufacturers, while tourism and local service businesses need to show up when people search on their phones. We build for both.",
    ],
    industries: [
      { title: "Automotive and component suppliers", description: "Capability websites with certifications, processes and RFQ forms for OEM and tier buyers." },
      { title: "Manufacturing and logistics", description: "B2B websites for Coega and port-linked businesses." },
      { title: "Tourism and hospitality", description: "Guesthouse, restaurant and activity websites with bookings and strong Google Maps presence." },
      { title: "Local services", description: "Mobile-friendly sites and local SEO for trades, practices and retailers." },
    ],
    serviceFocus: [
      { service: "web-design", text: "B2B websites that present your quality systems and capabilities to automotive buyers." },
      { service: "seo", text: "Local SEO for Gqeberha, Port Elizabeth and Kariega searches." },
      { service: "branding", text: "Brand identities that help local businesses look established and consistent." },
    ],
    areas: ["Central", "Summerstrand", "Humewood", "Walmer", "Newton Park", "Richmond Hill", "Mill Park", "Lorraine", "Westering", "Kabega Park", "Motherwell", "Kariega"],
    faqs: [
      {
        question: "Do you work with businesses in Gqeberha (Port Elizabeth)?",
        answer:
          "Yes. We work with businesses across Nelson Mandela Bay remotely, by phone, email and video call.",
      },
      {
        question: "Should my website say Gqeberha or Port Elizabeth?",
        answer:
          "Both. Many customers still search for Port Elizabeth, so we include both names naturally in your content and Google Business Profile so you are found either way.",
      },
      {
        question: "Do you build websites for automotive suppliers?",
        answer:
          "Yes. We build capability-focused websites that present your processes, certifications and customer industries clearly for OEM and tier-one buyers.",
      },
    ],
    nearby: ["cape-town", "durban", "bloemfontein"],
  },
  {
    slug: "polokwane",
    name: "Polokwane",
    province: "Limpopo",
    region: "Capricorn, Limpopo",
    seo: {
      title: "Web Design, SEO and Hosting in Polokwane",
      description:
        "Website design, SEO, hosting and branding for Polokwane and Limpopo businesses. Get found by customers across Capricorn and beyond. Request a quote.",
    },
    intro:
      "We help Polokwane businesses become the obvious choice online, with professional websites, local SEO and branding that reach customers across Limpopo.",
    market: [
      "Polokwane is the capital of Limpopo and the main commercial centre for the province, with retail, government, healthcare, education and transport all concentrated here. Agriculture and mining in the surrounding region bring a steady flow of suppliers and contractors, and the N1 links the city to Gauteng and Zimbabwe.",
      "Customers travel from towns across Limpopo to shop and do business in Polokwane, and most of them search online first. A business with a clear website, good reviews and a complete Google Business Profile wins that trip.",
    ],
    industries: [
      { title: "Retail and wholesale", description: "Online catalogues, specials pages and local SEO for shops serving customers from across the province." },
      { title: "Government and corporate suppliers", description: "Credible company websites with services, credentials and downloadable company profiles." },
      { title: "Agriculture and mining suppliers", description: "Product and capability websites that reach buyers across Limpopo." },
      { title: "Healthcare and education", description: "Practice, school and training-provider websites with clear information and enquiry forms." },
    ],
    serviceFocus: [
      { service: "web-design", text: "Professional websites that help Polokwane businesses look established and trustworthy." },
      { service: "seo", text: "Local SEO for Polokwane, Seshego, Mankweng and surrounding Limpopo towns." },
      { service: "branding", text: "Logos and brand identities for new and growing Limpopo businesses." },
    ],
    areas: ["Polokwane CBD", "Bendor", "Fauna Park", "Flora Park", "Ster Park", "Westenburg", "Welgelegen", "Ivy Park", "Seshego", "Mankweng", "Moletjie", "Tzaneen"],
    faqs: [
      {
        question: "Do you offer web design in Polokwane?",
        answer:
          "Yes. We work with Polokwane and Limpopo businesses remotely, by phone, email and video call.",
      },
      {
        question: "Can you help my business appear on Google Maps in Polokwane?",
        answer:
          "Yes. We set up or optimise your Google Business Profile, add your services, photos and service areas, and connect it to your website.",
      },
      {
        question: "Do you work with businesses outside Polokwane?",
        answer:
          "Yes. We work with businesses across Limpopo, including Seshego, Mankweng, Tzaneen and Mokopane.",
      },
    ],
    nearby: ["pretoria", "mbombela", "witbank"],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}

/** Groups locations by province in the order provinces first appear. */
export function locationsByProvince() {
  const groups = new Map<Province, Location[]>();
  for (const l of locations) groups.set(l.province, [...(groups.get(l.province) ?? []), l]);
  return [...groups.entries()].map(([province, items]) => ({ province, items }));
}
