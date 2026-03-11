export { getAllBlogPosts, getBlogPost } from "./blog";
export {
  getAllProjects,
  getProject,
  hasDesignContent,
  getDesignContent,
  hasEngineeringDoc,
  getEngineeringDoc,
  // Backward-compatible aliases
  getAllCaseStudies,
  getCaseStudy,
  hasCaseStudy,
  getCaseStudyContent,
  hasDesignDoc,
  getDesignDoc,
} from "./projects";
export { getAboutContent } from "./about";
export { getTestimonials } from "./testimonials";
