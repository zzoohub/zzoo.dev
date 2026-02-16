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
  duration: string;
  startDate: string;
  endDate?: string;
  d2Diagram?: string;
  links?: {
    live?: string;
    github?: string;
    docs?: string;
  };
}

export interface CaseStudy extends CaseStudyMeta {
  content: string;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  featured?: boolean;
}
