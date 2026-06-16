// Shared constants and data for the portfolio site.

export const ACCENT = "#1b63d6";
export const DASHBOARD_PASSWORD = "mikail2026";
export const CONTACT_EMAIL = "mikail.2016.12@gmail.com";

// Font family stacks backed by the next/font CSS variables defined in layout.tsx.
export const FONT_SPACE = "var(--font-space), sans-serif";
export const FONT_HANKEN = "var(--font-hanken), sans-serif";
export const FONT_MONO = "var(--font-mono), monospace";

export type Project = {
  tag: string;
  title: string;
  /** Longer write-up used in the Editorial (A) variant. */
  descA: string;
  /** Shorter write-up used in the Korporat (B) variant. */
  descB: string;
  techs: string[];
  image: string;
  link?: string;
};

export const PROJECTS: Project[] = [
  {
    tag: "COMPETITION · BACKEND",
    title: "RestMaterial",
    descA:
      "Developed for the VO Festival 2026 National Web Development Competition (UNTAR), securing 5th place. As the Backend Engineer, Proposal Writer, and presenter, I engineered the Express and Supabase backend and built a CO2 impact calculator grounded in EPA and Bappenas emission factors. I authored the full project proposal and pitched to the panel of judges, bridging real-world environmental impact with dependable, user-centric engineering.",
    descB:
      "Express & Supabase backend with CO2 impact calculator for a circular-economy construction marketplace. Secured 5th place at VO Festival 2026.",
    techs: ["Node.js", "Express.js", "Supabase", "PostgreSQL"],
    image: "/assets/@RESTMATERIAL.png",
    link: "https://fe-restmaterial.vercel.app/",
  },
  {
    tag: "AI · MOBILE BACKEND",
    title: "Harmoney",
    descA:
      "As the backend developer and AI engineer, I built the microservices connecting to the Groq API for Harmoney, a money management app featuring AI receipt scanning (OCR) and spend tracking (Harmoney Runway). I designed backend business logic layers and established the Supabase database integrated with Prisma migrations, ensuring stable connection to our layered architecture.",
    descB:
      "AI money management app with OCR receipt scanning and spend tracking. Built Groq-powered microservices and Supabase db with Prisma.",
    techs: ["Node.js", "Express.js", "Prisma", "Supabase", "Groq API"],
    image: "/assets/harmoney-hero.png",
    link: "https://github.com/AlvinPanjaitan/FE_Harmoney",
  },
  {
    tag: "STUDIO · BACKEND",
    title: "NATY (Nusantara Technology)",
    descA:
      "As Co-Founder, CEO, and Backend Developer of NATY, I consolidated our freelance developer portfolios under a single software agency brand to establish market credibility. As CEO, I manage client relationships, scope, and team delivery. As Backend Developer, I own the server-side architecture, APIs, databases, third-party integrations, and deployment, emphasizing security and reliability.",
    descB:
      "Co-founded software agency NATY. Manage client scope and team delivery while owning backend APIs, databases, and deployment.",
    techs: ["Node.js", "Express.js", "PostgreSQL", "API Design", "Docker"],
    image: "/assets/@NATY.png",
    link: "https://www.natynext.com/",
  },
  {
    tag: "HACKATHON · SPATIAL / AI",
    title: "GeoLapak",
    descA:
      "Created for the Gunadarma Code Week hackathon, GeoLapak is a location-intelligence platform helping entrepreneurs identify target markets and property agents find rental spaces. As the team's hacker, I proposed the core concept, mapped the technical stack, and made key architectural decisions regarding spatial data tools and location-based APIs.",
    descB:
      "Location-intelligence hackathon platform built for Gunadarma Code Week. Proposed the core concept and architected the stack.",
    techs: ["Node.js", "Express.js", "PostgreSQL", "Google Maps API"],
    image: "/assets/@GEOLAPAK.png",
    link: "https://www.figma.com/design/6AAL3gYHY0GKjh3gCYjWZ7/GUNDAR?node-id=7-3&t=g0CxHTxji3MQASPi-1",
  },
  {
    tag: "ACADEMIC · RE-ENGINEERING",
    title: "Refactoring Hotel Management",
    descA:
      "As Project Manager, I led a technical debt reduction effort for a legacy hotel management system. I analyzed and mapped god classes and modularity coupling smells, then delegated refactoring tasks. We transitioned the application into a clean domain-driven architecture with UI, Service, and Domain layers, successfully replacing rigid inheritance with delegation.",
    descB:
      "Managed system re-engineering. Resolved monolithic god classes into clean domain-driven architecture layers using delegation over inheritance.",
    techs: ["Java", "Design Patterns", "UML", "Refactoring", "Clean Architecture"],
    image: "/assets/@REFACTORING.png",
    link: "https://github.com/MikailMuh/Code-Reenginering-AOL-Hotel-Management-Case",
  },
];

export type InboxMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  ts: string;
  read: boolean;
};

