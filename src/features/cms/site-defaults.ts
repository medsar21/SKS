import { companyContent } from "@/features/company/content";
export const defaultCompanyProfile = {
  headline: companyContent.headline,
  specialty: companyContent.specialty,
  experience: companyContent.experience,
  about: companyContent.about,
  services: [...companyContent.services],
  expertise: [...companyContent.expertise],
  commitments: [...companyContent.commitments],
  productIntro: companyContent.productIntro,
  projectTitle: companyContent.projectTitle,
  projects: [...companyContent.projects],
  contactIntro: companyContent.contactIntro,
  director: {
    name: companyContent.director.name,
    title: companyContent.director.title,
    paragraphs: [...companyContent.director.paragraphs],
  },
};
export const defaultSiteMedia = {
  hero: {
    src: "/images/presentation/chantier-hero-hd.webp",
    alt: "Structure de coffrage et échafaudage — visuel du document SKS PROJETS, page 10.",
  },
  catalog: {
    src: "/images/presentation/chantier-hero-hd.webp",
    alt: "Coffrage et échafaudage — présentation SKS PROJETS",
  },
  homeAbout: {
    src: "/images/presentation/equipe.webp",
    alt: "Équipe sur chantier — visuel fourni dans la présentation SKS PROJETS, page 3.",
  },
  companyAbout: {
    src: "/images/presentation/chantier.webp",
    alt: "Visuel de la présentation SKS PROJETS, page 6",
  },
};
export const defaultPageSeo = {
  about: {
    title: "À propos de SKS PROJETS",
    description: companyContent.about,
  },
  projects: { title: "Projets", description: companyContent.productIntro },
  contact: {
    title: "Demande de devis et contact",
    description: companyContent.contactIntro,
  },
  catalog: {
    title: "Notre catalogue produits",
    description: companyContent.productIntro,
  },
};
