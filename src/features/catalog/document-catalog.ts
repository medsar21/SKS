import type { CatalogProduct } from "./types";
import { presentationDocument } from "@/features/company/content";

export const documentCategories = [
  { slug: "coffrage-horizontal", name: "Coffrage Horizontal" },
  { slug: "coffrage-vertical", name: "Coffrage Vertical" },
  { slug: "etaiement", name: "Étais métalliques" },
  { slug: "echafaudage", name: "Échafaudage" },
  { slug: "bois-coffrage", name: "Bois de coffrage" },
  { slug: "accessoires", name: "Accessoires de coffrage" },
];

type DocumentProduct = {
  slug: string;
  name: string;
  category: string;
  page: number;
  image: string;
  description: string;
  usage: string;
  kind?: CatalogProduct["kind"];
  specifications?: CatalogProduct["specifications"];
  advantages?: string[];
};
const entries: DocumentProduct[] = [
  {
    slug: "systeme-versatec",
    name: "Système VERSATEC",
    category: "coffrage-horizontal",
    page: 8,
    image: "versatec",
    description:
      "Le système VERSATEC est une solution de coffrage modulaire de nouvelle génération, conçue pour répondre aux exigences des chantiers modernes. Grâce à sa conception robuste et évolutive, il offre une grande polyvalence pour la réalisation de structures en béton armé, tout en garantissant rapidité de montage, sécurité et qualité de finition.",
    usage: "Structures horizontales et verticales",
    specifications: [
      {
        label: "SOLUTION MODULAIRE HAUTE PERFORMANCE",
        value:
          "Conception modulaire flexible, adaptée à toutes les configurations de chantier.",
      },
      {
        label: "RAPIDITÉ ET PRODUCTIVITÉ",
        value:
          "Montage et démontage rapides, réduisant les temps d’installation et améliorant la productivité sur chantier.",
      },
      {
        label: "SÉCURITÉ ET STABILITÉ",
        value:
          "Excellente répartition des charges et grande stabilité systémique pour une sécurité optimale.",
      },
      {
        label: "QUALITÉ ET DURABILITÉ",
        value:
          "Matériaux robustes et finition de haute qualité pour une longue durée de vie et de nombreuses réutilisations.",
      },
    ],
    advantages: [
      "Solution de coffrage modulaire haute performance",
      "Grande rapidité de montage et de démontage",
      "Adapté aux structures horizontales et verticales",
      "Compatible avec plusieurs configurations de chantier",
      "Excellente stabilité et répartition des charges",
      "Qualité de parement élevée",
      "Réutilisation sur de nombreux cycles",
      "Productivité optimisée",
      "Sécurité maximale sur chantier",
      "Conforme aux normes européennes",
    ],
  },
  {
    slug: "sks-pal",
    name: "SKS PAL",
    category: "coffrage-horizontal",
    page: 9,
    image: "sks-pal-photo",
    kind: "prop",
    description:
      "Cadre modulaire en acier à haute résistance. Idéal pour la réalisation de dalles et de portiques grâce à sa robustesse, sa simplicité de montage et sa sécurité maximale sur chantier.",
    usage: "Dalles, Échafaudage d’accès",
    specifications: [
      { label: "Acier", value: "Fe 235" },
      { label: "Diamètre tube", value: "48,3", unit: "mm" },
      { label: "Épaisseur tube", value: "2,50", unit: "mm" },
      { label: "Charge admissible/pied", value: "1,00", unit: "T" },
      { label: "Traitement", value: "Peinture" },
      { label: "Utilisation", value: "Dalles, Échafaudage d’accès" },
      { label: "Montage", value: "Rapide, simple et sécurisé" },
    ],
  },
  {
    slug: "dalle-echafaudage-multidirectionnel",
    name: "Dalle avec échafaudage multidirectionnel",
    category: "coffrage-horizontal",
    page: 10,
    image: "dalle-multidirectionnel",
    description:
      "Le système de dalle sur échafaudage multidirectionnel SKS PROJETS est une solution robuste et polyvalente destinée au coffrage des dalles en béton. Grâce à sa structure modulaire, il assure une excellente stabilité, une grande capacité de charge et un montage rapide. Il est parfaitement adapté aux bâtiments résidentiels, commerciaux, industriels ainsi qu'aux ouvrages de génie civil.",
    usage: "Coffrage des dalles en béton",
  },
  {
    slug: "systeme-montage-poteaux",
    name: "Système Montage Poteaux",
    category: "coffrage-vertical",
    page: 11,
    image: "poteaux",
    description:
      "Le système de montage poteaux SKS PROJETS est conçu pour le coffrage des poteaux en béton armé avec une mise en œuvre simple, rapide et sécurisée. Grâce à sa conception modulaire, il garantit une excellente précision d'assemblage et une finition de haute qualité, tout en optimisant les délais d'exécution sur chantier.",
    usage: "Coffrage des poteaux en béton armé",
    advantages: [
      "Montage rapide et sécurisé.",
      "Excellente précision d'alignement.",
      "Finition de qualité des surfaces en béton.",
      "Système robuste et réutilisable.",
      "Adapté aux projets résidentiels, commerciaux et industriels.",
    ],
  },
  {
    slug: "systeme-montage-voile",
    name: "Système Montage voile",
    category: "coffrage-vertical",
    page: 12,
    image: "voile",
    description:
      "Le système de coffrage voile SKS PROJETS est conçu pour la réalisation de voiles en béton armé avec rapidité, précision et sécurité. Sa conception modulaire permet une mise en œuvre efficace tout en garantissant une excellente qualité de finition. Adapté aux projets résidentiels, industriels et d'infrastructure, il offre robustesse, durabilité et productivité sur tous types de chantiers.",
    usage: "Réalisation de voiles en béton armé",
    advantages: [
      "Montage rapide et sécurisé.",
      "Excellente qualité de finition.",
      "Haute résistance et stabilité.",
      "Système modulaire et réutilisable.",
      "Assistance technique SKS PROJETS.",
    ],
  },
  {
    slug: "etais-metalliques",
    name: "Étais métalliques",
    category: "etaiement",
    page: 13,
    image: "etais-galvanises",
    kind: "prop",
    description:
      "Solutions d'étaiement pour systèmes de coffrage horizontaux. Les étais métalliques assurent le soutien temporaire des dalles et planchers pendant les différentes phases de construction. Disponibles en étais galvanisés à chaud, étais peints et étais renforcés, ainsi qu'en plusieurs dimensions, ils s'adaptent aux exigences de chaque chantier et garantissent sécurité, stabilité et performance.",
    usage: "Soutien temporaire des dalles et planchers",
    specifications: [
      { label: "Hauteurs", value: "de 0,80 m à 5,00 m" },
      {
        label: "Versions",
        value: "Étais galvanisés à chaud, étais peints et étais renforcés",
      },
    ],
    advantages: [
      "Hauteurs de 0,80 m à 5,00 m",
      "Haute capacité de charge",
      "Réglage facile et sécurisé",
      "Grande durabilité",
      "Adaptés à tous types de projets",
    ],
  },
  {
    slug: "etai-galvanise",
    name: "Etai Galvanisé",
    category: "etaiement",
    page: 14,
    image: "etais-galvanises",
    kind: "prop",
    description:
      "Excellente résistance à la corrosion. Longue durée de vie. Adapté aux environnements exigeants.",
    usage: "Solutions d'étaiement pour systèmes de coffrage horizontaux.",
    advantages: [
      "Excellente résistance à la corrosion",
      "Longue durée de vie",
      "Adapté aux environnements exigeants",
    ],
  },
  {
    slug: "etai-acier-peint",
    name: "Étai acier Peint",
    category: "etaiement",
    page: 14,
    image: "etais-peints",
    kind: "prop",
    description:
      "Solution économique et robuste. Grande stabilité. Disponible en plusieurs dimensions.",
    usage: "Solutions d'étaiement pour systèmes de coffrage horizontaux.",
    advantages: [
      "Solution économique et robuste",
      "Grande stabilité",
      "Disponible en plusieurs dimensions",
    ],
  },
  {
    slug: "echafaudage-multidirectionnel",
    name: "Échafaudage Multidirectionnel",
    category: "echafaudage",
    page: 15,
    image: "echafaudage-multidirectionnel-photo",
    kind: "prop",
    description:
      "Le système d'échafaudage multidirectionnel SKS PROJETS offre une solution modulaire alliant sécurité, stabilité et rapidité de montage. Grâce à sa grande polyvalence, il s'adapte à de nombreuses applications : plateformes de travail, tours d'accès, étaiement et structures temporaires. Conforme aux normes européennes, il répond aux exigences des chantiers les plus exigeants.",
    usage:
      "Plateformes de travail, tours d'accès, étaiement et structures temporaires",
    specifications: [
      {
        label: "Présentation",
        value:
          "Système modulaire destiné au soutien temporaire des ouvrages en béton et des structures de chantier.",
      },
    ],
  },
  {
    slug: "sks-pals",
    name: "SKS Pals",
    category: "echafaudage",
    page: 15,
    image: "sks-pals-photo",
    kind: "prop",
    description:
      "Solution mobile et sécurisée pour les travaux en hauteur et les interventions de maintenance.",
    usage: "Travaux en hauteur et interventions de maintenance",
  },
  {
    slug: "echafaudage-facade",
    name: "Échafaudage de Façade",
    category: "echafaudage",
    page: 15,
    image: "echafaudage-facade-photo",
    kind: "prop",
    description:
      "Système conçu pour les travaux de façade, de construction, de rénovation et d'entretien des bâtiments.",
    usage:
      "Travaux de façade, de construction, de rénovation et d'entretien des bâtiments",
  },
  {
    slug: "poutre-h20",
    name: "POUTRE H20",
    category: "bois-coffrage",
    page: 16,
    image: "poutre-h20",
    description:
      "Poutre en bois haute résistance idéale pour les systèmes de coffrage horizontaux et garantissant la stabilité.",
    usage: "Systèmes de coffrage horizontaux",
  },
  {
    slug: "panneau-tricappa",
    name: "PANNEAU TRICAPPA",
    category: "bois-coffrage",
    page: 16,
    image: "panneau-tricappa",
    description:
      "Panneau trois couches offrant une excellente résistance à l’usure et aux intempéries, et une longue durée de vie.",
    usage: "Bois de coffrage",
  },
  {
    slug: "contreplaque-bakelise",
    name: "CONTREPLAQUÉ BAKÉLISÉ",
    category: "bois-coffrage",
    page: 16,
    image: "contreplaque-bakelise",
    description:
      "Panneau vérifié d’un film phénolique assurant une grande résistance à l’humidité et à l’abrasion. Idéal pour multiples réutilisations.",
    usage: "Bois de coffrage",
  },
  {
    slug: "pince-assemblage",
    name: "Pince d’assemblage",
    category: "accessoires",
    page: 17,
    image: "pince-assemblage",
    kind: "accessory",
    description:
      "Assemblage rapide des panneaux de coffrage verticalement et horizontalement.",
    usage: "Assemblage des panneaux de coffrage",
  },
  {
    slug: "crochet-levage",
    name: "Crochet de levage",
    category: "accessoires",
    page: 17,
    image: "crochet-levage",
    kind: "accessory",
    description: "Manutention sécurisée des panneaux à l'aide d'une grue",
    usage: "Manutention des panneaux à l'aide d'une grue",
  },
  {
    slug: "tige-plaque-ecrou",
    name: "Tige & Plaque avec écrou",
    category: "accessoires",
    page: 17,
    image: "tige-plaque-ecrou",
    kind: "accessory",
    description:
      "Système de serrage fiable pour le maintien des panneaux de coffrage",
    usage: "Maintien des panneaux de coffrage",
  },
];

export const documentCatalogProducts: CatalogProduct[] = entries.map(
  (entry) => ({
    // Repère de lecture du document, et non référence commerciale inventée.
    sku: `PDF-${String(entry.page).padStart(2, "0")}-${entry.slug}`,
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    category: documentCategories.find(
      (category) => category.slug === entry.category,
    )!,
    kind: entry.kind ?? "panel",
    isDemo: false,
    usage: entry.usage,
    images: [
      {
        src: `/images/presentation/${entry.image}.webp`,
        alt: `${entry.name} — visuel du document SKS PROJETS, page ${entry.page}`,
      },
    ],
    specifications:
      entry.specifications ??
      (entry.category === "bois-coffrage"
        ? [
            {
              label: "RÉSISTANCE",
              value: "Matériaux de haute qualité pour une performance durable.",
            },
            {
              label: "RÉUTILISABLE",
              value:
                "Conçus pour plusieurs utilisations avec un excellent rendement.",
            },
            {
              label: "FIABILITÉ",
              value:
                "Conformes aux normes pour garantir la sécurité et la qualité sur chantier.",
            },
            {
              label: "SOLUTION ÉCOLOGIQUE",
              value: "Le bois utilisé provient de forêts gérées durablement.",
            },
          ]
        : []),
    advantages: entry.advantages ?? [],
    technicalSheet:
      entry.category === "etaiement"
        ? {
            src: "/images/presentation/page-14.webp",
            alt: "Fiche technique des étais : dimensions et charges admissibles, page 14 du document SKS PROJETS.",
          }
        : { src: "", alt: "" },
    technicalNote:
      entry.category === "etaiement"
        ? "Charges admissibles selon la norme européenne UNI EN 1065 (1 kN = 102 kg). Tableaux reproduits du document fourni, page 14."
        : "",
    sourcePage: entry.page,
    documents: [
      {
        label: `Présentation SKS PROJETS · page ${entry.page}`,
        href: `${presentationDocument}#page=${entry.page}`,
      },
      ...(entry.category === "etaiement" && entry.page !== 14
        ? [
            {
              label: "Fiche technique des étais · page 14",
              href: `${presentationDocument}#page=14`,
            },
          ]
        : []),
    ],
    price: null,
  }),
);
