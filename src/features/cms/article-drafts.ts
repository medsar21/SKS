import type { PageBody } from "./validation";

type ArticleDraft = {
  slug: string;
  title: string;
  summary: string;
  body: PageBody;
};

function draft(
  slug: string,
  title: string,
  summary: string,
  sections: { heading: string; text: string }[],
): ArticleDraft {
  return {
    slug,
    title,
    summary,
    body: {
      cover: "",
      coverAlt: "",
      seoTitle: title,
      seoDescription: summary,
      blocks: [
        {
          type: "text",
          text: "Proposition éditoriale de démonstration à relire avant publication. Ce contenu ne décrit aucun chantier ni aucune prestation réalisée.",
          url: "",
        },
        ...sections.flatMap(({ heading, text }): PageBody["blocks"] => [
          { type: "heading", text: heading, url: "" },
          { type: "text", text, url: "" },
        ]),
      ],
    },
  };
}

export const articleDrafts: ArticleDraft[] = [
  draft(
    "preparer-demande-devis-materiel",
    "Matériel de chantier : préparer une demande de devis claire",
    "Les informations à réunir pour présenter votre besoin en matériel et faciliter les échanges autour de votre projet.",
    [
      {
        heading: "Décrire le besoin avant de choisir une référence",
        text: "Présentez la nature du projet, sa localisation et les usages envisagés. Distinguez les éléments déjà définis de ceux qui restent à étudier. Si vous disposez de plans, indiquez leur date et leur version pour que les échanges portent sur les mêmes documents.",
      },
      {
        heading: "Préciser les quantités et le calendrier",
        text: "Listez les familles de matériel recherchées, les quantités estimées et les périodes souhaitées. Signalez les livraisons par phase et les dates encore provisoires. Pour une location, précisez la durée envisagée ainsi que les conditions de retour à discuter.",
      },
      {
        heading: "Identifier les points à confirmer",
        text: "Ajoutez les contraintes d’accès et de réception du matériel, puis les questions ouvertes : transport, documentation, disponibilité ou accessoires associés. Une demande de devis présente un besoin ; elle ne confirme ni une disponibilité ni une compatibilité technique.",
      },
    ],
  ),
  draft(
    "organiser-dossier-projet-coffrage",
    "Projet de coffrage : organiser les informations à transmettre",
    "Un dossier structuré pour présenter les plans, le phasage et les questions à examiner avec les intervenants du projet.",
    [
      {
        heading: "Rassembler les documents utiles",
        text: "Regroupez les plans disponibles et identifiez clairement les zones concernées. Nommez les fichiers avec leur version et leur date. Accompagnez-les d’une description du besoin et signalez les données manquantes plutôt que de les remplacer par des hypothèses non validées.",
      },
      {
        heading: "Présenter le phasage envisagé",
        text: "Décrivez les étapes prévues et les périodes auxquelles le matériel serait nécessaire. Indiquez les possibilités de réemploi envisagées entre zones, en les distinguant des choix déjà validés. Le dossier sert à ouvrir la discussion sur la configuration adaptée au projet.",
      },
      {
        heading: "Garder une trace des validations",
        text: "Centralisez les questions, les réponses et les versions retenues dans un document de suivi. Les choix de configuration et de compatibilité doivent être examinés par les personnes compétentes à partir des documents techniques applicables. Cet article propose une organisation documentaire, sans méthode de dimensionnement ou de montage.",
      },
    ],
  ),
  draft(
    "achat-location-materiel-questions",
    "Achat ou location de matériel : les questions à poser",
    "Une trame de comparaison pour clarifier la durée du besoin, les services attendus et les conditions des offres reçues.",
    [
      {
        heading: "Définir l’horizon du besoin",
        text: "Le matériel répond-il à une phase ponctuelle ou à plusieurs projets identifiés ? Notez la durée d’utilisation envisagée et les incertitudes du planning. Cette description permet de demander des propositions d’achat et de location fondées sur le même besoin.",
      },
      {
        heading: "Comparer le périmètre des propositions",
        text: "Pour chaque offre, relevez les références, les quantités, le transport, les accessoires et la documentation inclus. Demandez que les conditions d’entretien, de stockage, de retour et de prolongation soient explicites lorsqu’elles s’appliquent. Les conditions restent à confirmer dans chaque proposition commerciale.",
      },
      {
        heading: "Consigner les hypothèses avant de décider",
        text: "Préparez un tableau reprenant les mêmes postes pour chaque proposition et marquez les informations non confirmées. Aucun scénario n’est systématiquement préférable : la décision dépend du projet et des conditions effectivement proposées. Cet exemple ne présente aucun tarif ni gain commercial chiffré.",
      },
    ],
  ),
];
