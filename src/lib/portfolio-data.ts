// Shared constants and data for the portfolio site.

export const ACCENT = "#1b63d6";
export const DASHBOARD_PASSWORD = "mikail2026";
export const CONTACT_EMAIL = "mikail.2016.12@gmail.com";

// Font stacks live as CSS custom properties (--serif / --sans / --mono) in globals.css.

export type Project = {
  tag: string;
  title: string;
  /** Long-form write-up (kept for CV / case-study use). */
  descA: string;
  /** Short summary shown on the site. */
  descB: string;
  role: string;
  year: string;
  techs: string[];
  image: string;
  link?: string;
};

export const PROJECTS: Project[] = [
  {
    tag: "CLIENT · E-COMMERCE BACKEND",
    title: "LACROI",
    role: "Backend Engineer · via NATY",
    year: "2026",
    descA:
      "Production e-commerce platform for streetwear brand LACROI, delivered as a NATY client project. As the Backend Engineer, I designed the full database schema and built every marketplace endpoint, including a limited-drop system with idempotent checkout so that concurrent, first-come-first-served orders never double-charge or oversell. I integrated external APIs (Biteship for shipping rates and courier tracking, DOKU as the payment gateway), built the admin panel (admin.lacroidept.com), and containerized the stack with Docker for deployment to a VPS managed by Dokploy.",
    descB:
      "Production streetwear store for a NATY client. Designed the DB schema, built all marketplace endpoints plus an idempotent limited-drop checkout, integrated Biteship and DOKU, built the admin panel, and shipped it with Docker on Dokploy.",
    techs: ["PostgreSQL", "Docker", "Dokploy", "Biteship API", "DOKU"],
    image: "/assets/@LACROI.png",
    link: "https://lacroidept.com/",
  },
  {
    tag: "COMPETITION · BACKEND",
    title: "RestMaterial",
    role: "Backend Developer · Proposal Writer",
    year: "Jun 2026",
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
    role: "Backend Developer · AI Integration",
    year: "In progress",
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
    role: "Co-Founder · CEO · Backend Developer",
    year: "Ongoing",
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
    role: "Backend Developer · AI Integration",
    year: "May 2025",
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
    role: "Project Manager",
    year: "May 2026",
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

