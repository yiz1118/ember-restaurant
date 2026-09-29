import { site } from "@/data/site";

export type CreatorProfile = {
  name: string;
  title: string;
  email: string;
  location: string;
  availability: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  portfolioUrl: string | null;
};

export const creator: CreatorProfile = {
  name: "Alson Chua",
  title: "Independent Web & App Developer",
  email: "alsonchua18@gmail.com",
  location: "Malaysia · Working with clients worldwide",
  availability: "Available for freelance projects worldwide",
  linkedinUrl: "https://www.linkedin.com/in/chua-yiz-063ba9272",
  githubUrl: "https://github.com/yiz1118",
  whatsappDisplay: "+60 11-5857 6386",
  whatsappUrl: "https://wa.me/601158576386",
  portfolioUrl: null,
};

export function creatorContactLinks(profile: CreatorProfile = creator) {
  const whatsappMessage = `Hi ${profile.name.split(" ")[0]}, I came across your ${site.name} concept project and I'm interested in discussing a website/app project with you.`;
  const subject = `Project Inquiry — ${site.name}`;
  const body = `Hi ${profile.name.split(" ")[0]},\n\nI came across your ${site.name} concept project and would like to discuss a potential website, app, or digital product project.\n\n`;
  return {
    whatsapp: `${profile.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`,
    email: `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
