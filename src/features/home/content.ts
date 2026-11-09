import { ClipboardCheck, Layers3, Route, ScanLine } from "lucide-react";

// Présentation fournie par SKS PROJETS, pages 3, 7 et 19.
export const homeSolutions = [
  "VERSATEC",
  "SKS PAL",
  "Échafaudage multidirectionnel",
] as const;
export const homeBenefits = [
  {
    icon: ClipboardCheck,
    title: "Sécurité",
    text: "Des solutions conformes aux normes pour garantir la sécurité sur chantier.",
  },
  {
    icon: Layers3,
    title: "Performance",
    text: "Matériel robuste et innovant pour une productivité optimale.",
  },
  {
    icon: Route,
    title: "Rapidité",
    text: "Disponibilité et réactivité pour respecter vos délais de livraison.",
  },
  {
    icon: ScanLine,
    title: "Accompagnement",
    text: "Une équipe d’experts à votre écoute pour vous conseiller et vous suivre.",
  },
] as const;
export const homeJourneys = [
  {
    id: "vente",
    image: {
      src: "/images/presentation/coffrage-chantier-hd.webp",
      alt: "Coffrage — présentation SKS PROJETS",
    },
    number: "01",
    label: "NOS SERVICES",
    title: "Vente",
    subtitle: "Vente • Location • Assistance Technique",
    text: "Coffrage, étaiement et échafaudage : des équipements pour vos projets de construction.",
    points: [
      "Coffrage Horizontal et Vertical",
      "Étaiement et Échafaudage",
      "Assistance Technique",
    ],
    cta: "Nous contacter",
  },
  {
    id: "location",
    image: {
      src: "/images/presentation/etais-galvanises.webp",
      alt: "Étais métalliques — présentation SKS PROJETS",
    },
    number: "02",
    label: "NOS SERVICES",
    title: "Location",
    subtitle: "Vente • Location • Assistance Technique",
    text: "Des solutions de location de matériel adaptées aux besoins de votre chantier.",
    points: [
      "Études Techniques",
      "Suivi de Chantier",
      "Accompagnement chantier",
    ],
    cta: "Nous contacter",
  },
  {
    id: "assistance",
    number: "03",
    label: "NOS SERVICES",
    title: "Assistance technique",
    subtitle: "",
    text: "Études techniques, accompagnement et suivi de chantier avec SKS PROJETS.",
    points: [],
    cta: "Nous contacter",
    image: {
      src: "/images/presentation/equipe.webp",
      alt: "Assistance technique — présentation SKS PROJETS",
    },
  },
] as const;
