export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  avatar?: string;
  /**
   * Simple list of short facts about the person to render in the About section.
   * Example: ["B.E. in Computer Engineering", "Avid learner"]
   */
  quickFacts?: string[];
  /**
   * Array of paragraph strings used in the About section.
   * When present, AboutComponent will render these paragraphs in order.
   */
  about?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  category: string;
  items: string[];
}

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillItem[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  /**
   * Optional list of images for a project.
   * If present and has more than one image, the UI will cycle through these images every second.
   */
  imageUrls?: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  skillItems: SkillCategory[];
  productionProjects: Project[];
  sampleProjects: Project[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
}
