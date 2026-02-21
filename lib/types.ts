export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: "en" | "ko";
  draft?: boolean;
  readingTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface CaseStudyMeta {
  slug: string;
  title: string;
  description: string;
  clientType: string;
  status: "active" | "completed" | "archived";
  techStack: string[];
  featured?: boolean;
  launchDate: string;
  thumbnail?: string;
  images?: string[];
  d2Diagram?: string;
  links?: {
    live?: string;
    github?: string;
    docs?: string;
  };

  // Marketing fields
  tagline?: string;
  category?: "mobile-app" | "chrome-extension" | "web" | "cli";
  keywords?: {
    primary?: string[];
    longTail?: string[];
  };
  competitors?: Array<{
    name: string;
    differentiator: string;
  }>;
  cta?: {
    primary?: { label: string; url: string };
    secondary?: { label: string; url: string };
  };
  features?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;

  // Extended media
  heroImage?: string;
  video?: string;
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
}

export interface ExperienceEntry {
  period: string;
  title: string;
  description: string;
  current?: boolean;
}

export interface AboutData {
  experience: ExperienceEntry[];
  content: string;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  featured?: boolean;
}
