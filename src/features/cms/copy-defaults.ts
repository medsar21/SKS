// Public content registry. Les contenus existants sont conservés pour les publications du CMS.
export const copyGroups: Record<
  string,
  { value: string; kind: "text" | "image" | "url" }[]
> = {
  home: [
    {
      value: "Explorer les équipements",
      kind: "text",
    },
    {
      value:
        "Chantier illustratif généré : coffrage et structure en béton. Aucune réalisation réelle de SKS PROJETS représentée.",
      kind: "text",
    },
    {
      value: "SKS PROJETS / ÉQUIPEMENTS BTP",
      kind: "text",
    },
    {
      value: "DU MATÉRIEL.",
      kind: "text",
    },
    {
      value: "DU CONCRET.",
      kind: "text",
    },
    {
      value: "VOS PROJETS.",
      kind: "text",
    },
    {
      value:
        "Coffrage, étaiement et accessoires de chantier. Le point de départ pour construire votre sélection et préparer la suite.",
      kind: "text",
    },
    {
      value: "Préparer mon projet",
      kind: "text",
    },
    {
      value: "POUR LES PROFESSIONNELS DU BÂTIMENT",
      kind: "text",
    },
    {
      value: "Découvrir les gammes",
      kind: "text",
    },
    {
      value: "VISUEL GÉNÉRÉ · CHANTIER ILLUSTRATIF",
      kind: "text",
    },
    {
      value: "Rechercher un équipement",
      kind: "text",
    },
    {
      value: "VOTRE CHANTIER COMMENCE ICI",
      kind: "text",
    },
    {
      value: "De quoi avez-vous besoin ?",
      kind: "text",
    },
    {
      value: "Coffrage, panneau, accessoire…",
      kind: "text",
    },
    {
      value: "Rechercher dans le catalogue",
      kind: "text",
    },
    {
      value: "DÉMONSTRATION",
      kind: "text",
    },
    {
      value:
        "Catalogue et visuels illustratifs. Caractéristiques, tarifs et disponibilités à confirmer.",
      kind: "text",
    },
    {
      value: "L’ESSENTIEL, SUR LE TERRAIN.",
      kind: "text",
    },
    {
      value: "Les bons équipements.",
      kind: "text",
    },
    {
      value: "Dès les premières étapes.",
      kind: "text",
    },
    {
      value: "Découvrir notre univers",
      kind: "text",
    },
    {
      value: "01 / LES GAMMES",
      kind: "text",
    },
    {
      value: "À CHAQUE OUVRAGE,",
      kind: "text",
    },
    {
      value: "SA SOLUTION.",
      kind: "text",
    },
    {
      value: "Tout le catalogue",
      kind: "text",
    },
    {
      value: "GAMME À DÉCOUVRIR",
      kind: "text",
    },
    {
      value: "Explorer la sélection illustrative",
      kind: "text",
    },
    {
      value:
        "Illustrations de principe. Configurations et compatibilités techniques à confirmer.",
      kind: "text",
    },
    {
      value: "02 / LES ÉQUIPEMENTS",
      kind: "text",
    },
    {
      value: "LE CHOIX COMMENCE ICI.",
      kind: "text",
    },
    {
      value: "Achat et location",
      kind: "text",
    },
    {
      value:
        "Parcours de préparation. Conditions de vente et de location à confirmer avec SKS PROJETS.",
      kind: "text",
    },
    {
      value: "03 / LA MÉTHODE",
      kind: "text",
    },
    {
      value: "BIEN PRÉPARER.",
      kind: "text",
    },
    {
      value: "MIEUX AVANCER.",
      kind: "text",
    },
    {
      value:
        "Des questions précises aujourd’hui. Une décision mieux éclairée demain.",
      kind: "text",
    },
    {
      value: "VOTRE PROCHAIN CHANTIER",
      kind: "text",
    },
    {
      value: "DONNONS FORME",
      kind: "text",
    },
    {
      value: "À VOTRE PROJET.",
      kind: "text",
    },
    {
      value:
        "Le matériel, les quantités, le calendrier. Rassemblez l’essentiel pour préparer votre consultation.",
      kind: "text",
    },
    {
      value: "Un besoin précis ? Commencez par les bonnes informations.",
      kind: "text",
    },
    {
      value: "Préparer notre échange",
      kind: "text",
    },
    {
      value: "/images/construction-demo.webp",
      kind: "image",
    },
    {
      value:
        "Visuel généré de démonstration : structure en béton et étaiement métallique sur un chantier illustratif, sans lien avec une réalisation de SKS PROJETS.",
      kind: "text",
    },
    {
      value: "Visuel généré · chantier illustratif",
      kind: "text",
    },
    {
      value: "L’ÉQUIPEMENT AU CŒUR DU CHANTIER",
      kind: "text",
    },
    {
      value: "La précision",
      kind: "text",
    },
    {
      value: "au service de",
      kind: "text",
    },
    {
      value: "vos chantiers.",
      kind: "text",
    },
    {
      value: "Coffrage, étaiement et équipements BTP.",
      kind: "text",
    },
    {
      value:
        "Donnez une structure à vos projets, de la première réflexion au choix du matériel.",
      kind: "text",
    },
    {
      value: "/catalogue",
      kind: "url",
    },
    {
      value: "Explorer le catalogue",
      kind: "text",
    },
    {
      value: "/contact",
      kind: "url",
    },
    {
      value: "Préparer un devis ",
      kind: "text",
    },
    {
      value: "PENSÉ POUR LES PROFESSIONNELS DU BTP",
      kind: "text",
    },
    {
      value: "#presentation",
      kind: "url",
    },
    {
      value: "Découvrir SKS PROJETS",
      kind: "text",
    },
    {
      value: "VERSION DE DÉMONSTRATION",
      kind: "text",
    },
    {
      value:
        "Visuels illustratifs et catalogue démo. Offre, caractéristiques et disponibilités à confirmer.",
      kind: "text",
    },
    {
      value: "01 / SKS PROJETS",
      kind: "text",
    },
    {
      value: "Le chantier donne le cap.",
      kind: "text",
    },
    {
      value: "L’équipement fait la différence.",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS s’adresse aux professionnels du bâtiment qui préparent leurs besoins en coffrage, étaiement et équipements de construction.",
      kind: "text",
    },
    {
      value:
        "Cette vitrine vous aide à explorer les solutions, à envisager l’achat ou la location et à réunir les informations utiles à votre projet.",
      kind: "text",
    },
    {
      value: "#solutions",
      kind: "url",
    },
    {
      value: "Découvrir les solutions",
      kind: "text",
    },
    {
      value: "02 / LES SOLUTIONS",
      kind: "text",
    },
    {
      value: "Des solutions pour",
      kind: "text",
    },
    {
      value: "penser chaque chantier.",
      kind: "text",
    },
    {
      value:
        "MECANOFLEX, ECOFORM et VMC : les gammes à découvrir avec SKS PROJETS. Leurs fiches et configurations techniques restent à confirmer.",
      kind: "text",
    },
    {
      value: "SOLUTION",
      kind: "text",
    },
    {
      value: "0",
      kind: "text",
    },
    {
      value: "Présentation technique à compléter.",
      kind: "text",
    },
    {
      value: "Échanger sur ",
      kind: "text",
    },
    {
      value:
        "Graphismes de repérage uniquement. Aucune performance, certification ou configuration technique n’est annoncée.",
      kind: "text",
    },
    {
      value: "03 / LE CATALOGUE",
      kind: "text",
    },
    {
      value: "À chaque besoin,",
      kind: "text",
    },
    {
      value: "sa famille d’équipements.",
      kind: "text",
    },
    {
      value: "Tout le catalogue ",
      kind: "text",
    },
    {
      value:
        "Sélection de démonstration. Illustrations de principe, caractéristiques à valider.",
      kind: "text",
    },
    {
      value: "04 / VOTRE MODE D’ÉQUIPEMENT",
      kind: "text",
    },
    {
      value: "Acheter ou louer.",
      kind: "text",
    },
    {
      value: "Le choix commence par votre besoin.",
      kind: "text",
    },
    {
      value:
        "Parcours de préparation uniquement. Éligibilité à la vente ou à la location, modalités, tarifs et disponibilités à confirmer.",
      kind: "text",
    },
    {
      value: "05 / UNE APPROCHE PROFESSIONNELLE",
      kind: "text",
    },
    {
      value: "Moins d’incertitude.",
      kind: "text",
    },
    {
      value: "Plus de clarté pour avancer.",
      kind: "text",
    },
    {
      value:
        "Les bons équipements commencent par les bonnes questions. Une démarche lisible pour préparer votre décision.",
      kind: "text",
    },
    {
      value: "06 / PRÉPARER VOTRE DEMANDE DE DEVIS",
      kind: "text",
    },
    {
      value: "Votre projet mérite",
      kind: "text",
    },
    {
      value: "un point de départ précis.",
      kind: "text",
    },
    {
      value:
        "Le matériel envisagé, les quantités, le lieu et le calendrier : rassemblez l’essentiel pour préparer votre consultation.",
      kind: "text",
    },
    {
      value: "Préparer ma demande de devis",
      kind: "text",
    },
    {
      value:
        "Aucune demande n’est collectée ni envoyée depuis cette démonstration.",
      kind: "text",
    },
    {
      value: "VOTRE POINT DE DÉPART",
      kind: "text",
    },
    {
      value: "01",
      kind: "text",
    },
    {
      value: "Votre besoin en matériel",
      kind: "text",
    },
    {
      value: "02",
      kind: "text",
    },
    {
      value: "Les contraintes du chantier",
      kind: "text",
    },
    {
      value: "03",
      kind: "text",
    },
    {
      value: "Votre calendrier prévisionnel",
      kind: "text",
    },
    {
      value: "07 / CONTACT",
      kind: "text",
    },
    {
      value: "Parlons du prochain chantier.",
      kind: "text",
    },
    {
      value:
        "Les coordonnées officielles seront publiées après confirmation par SKS PROJETS.",
      kind: "text",
    },
    {
      value: "Préparer notre échange ",
      kind: "text",
    },
    {
      value: "MECANOFLEX",
      kind: "text",
    },
    {
      value: "ECOFORM",
      kind: "text",
    },
    {
      value: "VMC",
      kind: "text",
    },
    {
      value: "Une lecture claire de l’offre",
      kind: "text",
    },
    {
      value:
        "Coffrage, étaiement, accessoires : explorez les familles d’équipements depuis un même catalogue.",
      kind: "text",
    },
    {
      value: "Deux façons d’équiper votre projet",
      kind: "text",
    },
    {
      value:
        "Préparez votre réflexion entre achat et location, selon la durée et les besoins du chantier.",
      kind: "text",
    },
    {
      value: "La technique avant la décision",
      kind: "text",
    },
    {
      value:
        "Dimensions, compatibilités et contraintes : identifiez les points à valider avant de vous engager.",
      kind: "text",
    },
    {
      value: "Un besoin mieux préparé",
      kind: "text",
    },
    {
      value:
        "Rassemblez les informations utiles pour donner un cadre précis à votre future consultation.",
      kind: "text",
    },
    {
      value: "vente",
      kind: "text",
    },
    {
      value: "POUR VOS BESOINS DURABLES",
      kind: "text",
    },
    {
      value: "Vente",
      kind: "text",
    },
    {
      value: "Équipez la suite de vos projets.",
      kind: "text",
    },
    {
      value:
        "Vous envisagez d’investir dans votre matériel ? Identifiez les équipements, les quantités et les configurations à étudier.",
      kind: "text",
    },
    {
      value: "Familles d’équipements",
      kind: "text",
    },
    {
      value: "Quantités envisagées",
      kind: "text",
    },
    {
      value: "Compatibilités à vérifier",
      kind: "text",
    },
    {
      value: "Préparer mon achat",
      kind: "text",
    },
    {
      value: "location",
      kind: "text",
    },
    {
      value: "POUR LE TEMPS DU CHANTIER",
      kind: "text",
    },
    {
      value: "Location",
      kind: "text",
    },
    {
      value: "Pensez le matériel à l’échelle du projet.",
      kind: "text",
    },
    {
      value:
        "Vous étudiez un besoin temporaire ? Précisez la durée, le phasage et les contraintes de votre chantier pour préparer l’échange.",
      kind: "text",
    },
    {
      value: "Durée prévisionnelle",
      kind: "text",
    },
    {
      value: "Phasage du chantier",
      kind: "text",
    },
    {
      value: "Conditions à confirmer",
      kind: "text",
    },
    {
      value: "Préparer ma location",
      kind: "text",
    },
    {
      value: "/images/presentation/chantier.webp",
      kind: "image",
    },
    {
      value:
        "Visuel de présentation fourni par SKS PROJETS, page 6 du document.",
      kind: "text",
    },
    {
      value: "COFFRAGE,",
      kind: "text",
    },
    {
      value: "ÉTAIEMENT",
      kind: "text",
    },
    {
      value: "ET ÉCHAFAUDAGE",
      kind: "text",
    },
    {
      value: "Maroc | Afrique · +15 ans d’expérience",
      kind: "text",
    },
    {
      value: "VISUEL DU DOCUMENT SKS PROJETS",
      kind: "text",
    },
    {
      value: "NOS PRODUITS",
      kind: "text",
    },
    {
      value: "VERSATEC, SKS PAL, étais…",
      kind: "text",
    },
    {
      value: "PRÉSENTATION SKS PROJETS",
      kind: "text",
    },
    {
      value: "Consulter le document de présentation (PDF)",
      kind: "text",
    },
    {
      value: "QUI SOMMES-NOUS ?",
      kind: "text",
    },
    {
      value: "À propos de",
      kind: "text",
    },
    {
      value: "SKS PROJETS",
      kind: "text",
    },
    {
      value: "NOS SYSTÈMES",
      kind: "text",
    },
    {
      value: "DE COFFRAGE.",
      kind: "text",
    },
    {
      value: "Découvrir le système",
      kind: "text",
    },
    {
      value: "POURQUOI CHOISIR",
      kind: "text",
    },
    {
      value: "SKS PROJETS ?",
      kind: "text",
    },
    {
      value: "Spécialisée dans les solutions de coffrage et d’échafaudage",
      kind: "text",
    },
    {
      value: "PROJETS",
      kind: "text",
    },
    {
      value: "NOS SOLUTIONS AU SERVICE",
      kind: "text",
    },
    {
      value: "DE VOS PROJETS",
      kind: "text",
    },
    {
      value: "Projets",
      kind: "text",
    },
    {
      value: "Contact",
      kind: "text",
    },
    {
      value: "Votre partenaire en coffrage, étaiement et échafaudage",
      kind: "text",
    },
    {
      value: "Expert en solutions de coffrage, d’étaiement et d’échafaudage",
      kind: "text",
    },
    {
      value: "Vente • Location • Assistance Technique",
      kind: "text",
    },
    {
      value: "Maroc | Afrique",
      kind: "text",
    },
    {
      value: "+15 ans d’expérience",
      kind: "text",
    },
    {
      value:
        "Depuis sa création, SKS PROJETS accompagne les professionnels du BTP avec des solutions de coffrage, d'étaiement et d'échafaudage adaptées à tous types de projets. Portée par un dirigeant bénéficiant de plus de 15 ans d'expérience dans le secteur du coffrage et du gros œuvre, l'entreprise s'engage à fournir des solutions fiables, innovantes et performantes, répondant aux plus hauts standards de qualité et de sécurité.",
      kind: "text",
    },
    {
      value: "Vente de matériel",
      kind: "text",
    },
    {
      value: "Location de matériel",
      kind: "text",
    },
    {
      value: "Assistance technique",
      kind: "text",
    },
    {
      value: "Accompagnement chantier",
      kind: "text",
    },
    {
      value: "Coffrage Horizontal et Vertical",
      kind: "text",
    },
    {
      value: "Étaiement et Échafaudage",
      kind: "text",
    },
    {
      value: "Assistance Technique",
      kind: "text",
    },
    {
      value: "Études Techniques",
      kind: "text",
    },
    {
      value: "Suivi de Chantier",
      kind: "text",
    },
    {
      value: "Produits certifiés et de haute qualité",
      kind: "text",
    },
    {
      value: "Ingénierie européenne",
      kind: "text",
    },
    {
      value: "Étude & conseil technique sur chantier",
      kind: "text",
    },
    {
      value: "Solutions adaptées à chaque projet",
      kind: "text",
    },
    {
      value: "Assistance & montage durant le chantier",
      kind: "text",
    },
    {
      value: "Excellent rapport qualité/prix",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS propose des systèmes complets de coffrage pour les ouvrages horizontaux et verticaux, destinés aux projets résidentiels, commerciaux, industriels et de génie civil.",
      kind: "text",
    },
    {
      value: "Nos solutions au service de vos projets",
      kind: "text",
    },
    {
      value: "Bâtiments résidentiels",
      kind: "text",
    },
    {
      value: "Immeubles de bureaux",
      kind: "text",
    },
    {
      value: "Centres commerciaux",
      kind: "text",
    },
    {
      value: "Ouvrages industriels",
      kind: "text",
    },
    {
      value: "Génie civil",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS vous accompagne avec des solutions performantes, sûres et adaptées à tous vos chantiers.",
      kind: "text",
    },
    {
      value: "contact@sks-projets.ma",
      kind: "text",
    },
    {
      value: "+212 522 97 34 76",
      kind: "text",
    },
    {
      value: "+212 663 80 33 42",
      kind: "text",
    },
    {
      value: "www.sks-projets.ma",
      kind: "text",
    },
    {
      value:
        "Mega business centre 2, Lot 5i3d\n11 Bdir Aoua étage, M47 Sidi\nMaârouf, Casablanca",
      kind: "text",
    },
    {
      value: "Amine HARIR",
      kind: "text",
    },
    {
      value: "Directeur Général",
      kind: "text",
    },
    {
      value:
        "Depuis notre création, SKS PROJETS s'est donné pour mission d'accompagner les professionnels de la construction avec des solutions fiables en coffrage, étaiement et échafaudage métallique.",
      kind: "text",
    },
    {
      value:
        "Chaque jour, notre équipe met son savoir-faire au service de vos chantiers avec une exigence constante de qualité, de réactivité et de professionnalisme.",
      kind: "text",
    },
    {
      value:
        "Notre force réside dans notre capacité à conjuguer expertise technique, proximité et écoute.",
      kind: "text",
    },
    {
      value:
        "Au-delà des équipements que nous proposons en vente, location et importation, nous plaçons la relation humaine au cœur de notre métier. Nous sommes convaincus qu'un chantier réussi commence par un partenaire de confiance, capable de comprendre les besoins de ses clients et d'y répondre avec efficacité.",
      kind: "text",
    },
    {
      value:
        "Je remercie sincèrement nos clients pour leur confiance renouvelée ainsi que notre équipe pour son engagement, son professionnalisme et son esprit d'initiative.",
      kind: "text",
    },
    {
      value:
        "Ensemble, nous continuons de bâtir l'avenir, projet après projet.",
      kind: "text",
    },
    {
      value: "/images/presentation/chantier-hero.webp",
      kind: "image",
    },
    {
      value:
        "Structure de coffrage et échafaudage — visuel du document SKS PROJETS, page 10.",
      kind: "text",
    },
    {
      value: "COFFRAGE · ÉTAIEMENT · ÉCHAFAUDAGE",
      kind: "text",
    },
    {
      value: "DES SOLUTIONS",
      kind: "text",
    },
    {
      value: "DE CONSTRUCTION",
      kind: "text",
    },
    {
      value: "FIABLES ET PERFORMANTES",
      kind: "text",
    },
    {
      value:
        "Vente, location et assistance technique d’équipements pour tous vos projets de construction au Maroc et en Afrique.",
      kind: "text",
    },
    {
      value: "Découvrir nos produits",
      kind: "text",
    },
    {
      value: "Nos services",
      kind: "text",
    },
    {
      value: "Visuel de la présentation SKS PROJETS",
      kind: "text",
    },
    {
      value: "Les engagements SKS PROJETS",
      kind: "text",
    },
    {
      value: "NOS SERVICES",
      kind: "text",
    },
    {
      value: "Un accompagnement complet",
      kind: "text",
    },
    {
      value: "pour vos chantiers",
      kind: "text",
    },
    {
      value:
        "Vente de matériel, location de matériel, assistance technique et accompagnement chantier.",
      kind: "text",
    },
    {
      value: "Nous contacter",
      kind: "text",
    },
    {
      value: "6 catégories d’équipements",
      kind: "text",
    },
    {
      value: "pour les besoins du BTP",
      kind: "text",
    },
    {
      value: "Voir le catalogue complet",
      kind: "text",
    },
    {
      value:
        "Équipe sur chantier — visuel fourni dans la présentation SKS PROJETS, page 3.",
      kind: "text",
    },
    {
      value: "À PROPOS DE SKS PROJETS",
      kind: "text",
    },
    {
      value: "Un partenaire de confiance",
      kind: "text",
    },
    {
      value: "dans le secteur du BTP",
      kind: "text",
    },
    {
      value: "Découvrir l’entreprise",
      kind: "text",
    },
    {
      value: "Sélection d’équipements",
      kind: "text",
    },
    {
      value: "Nos engagements",
      kind: "text",
    },
    {
      value: "Vous avez un projet ?",
      kind: "text",
    },
    {
      value: "Demandez une consultation.",
      kind: "text",
    },
    {
      value:
        "Notre équipe vous accompagne pour identifier la solution adaptée.",
      kind: "text",
    },
    {
      value: "Faire une demande",
      kind: "text",
    },
    {
      value:
        "Coffrage, étaiement et échafaudage : des équipements pour vos projets de construction.",
      kind: "text",
    },
    {
      value:
        "Des solutions de location de matériel adaptées aux besoins de votre chantier.",
      kind: "text",
    },
    {
      value:
        "Études techniques, accompagnement et suivi de chantier avec SKS PROJETS.",
      kind: "text",
    },
    {
      value: "Sécurité",
      kind: "text",
    },
    {
      value: "Qualité et fiabilité des équipements.",
      kind: "text",
    },
    {
      value: "Performance",
      kind: "text",
    },
    {
      value: "Des solutions robustes et durables.",
      kind: "text",
    },
    {
      value: "Accompagnement",
      kind: "text",
    },
    {
      value: "Assistance technique et suivi de chantier.",
      kind: "text",
    },
    {
      value: "Vente & location",
      kind: "text",
    },
    {
      value: "Des solutions adaptées à chaque projet.",
      kind: "text",
    },
    {
      value: "/images/presentation/chantier-hero-hd.webp",
      kind: "image",
    },
  ],
  catalogue: [
    {
      value: "SKS PROJETS / LES ÉQUIPEMENTS",
      kind: "text",
    },
    {
      value: "LE CATALOGUE PROFESSIONNEL",
      kind: "text",
    },
    {
      value: "La précision commence",
      kind: "text",
    },
    {
      value: "par le bon ",
      kind: "text",
    },
    {
      value: "équipement.",
      kind: "text",
    },
    {
      value:
        "Explorez les familles de coffrage métallique et préparez une consultation adaptée à votre chantier.",
      kind: "text",
    },
    {
      value: "MECANOFLEX",
      kind: "text",
    },
    {
      value: "ECOFORM",
      kind: "text",
    },
    {
      value: "VMC",
      kind: "text",
    },
    {
      value: "ACCESSOIRES",
      kind: "text",
    },
    {
      value:
        "CATALOGUE DE DÉMONSTRATION — Références et illustrations indicatives. Aucune caractéristique technique, aucun tarif ni stock confirmés.",
      kind: "text",
    },
    {
      value:
        "Tarifs et disponibilités à confirmer. Les illustrations génériques ne constituent pas des photos produit.",
      kind: "text",
    },
    {
      value: "Filtres du catalogue",
      kind: "text",
    },
    {
      value: "Affiner la sélection",
      kind: "text",
    },
    {
      value: "Catégorie",
      kind: "text",
    },
    {
      value: "Toutes les catégories",
      kind: "text",
    },
    {
      value: "Catégorie inconnue",
      kind: "text",
    },
    {
      value: "Utilisation",
      kind: "text",
    },
    {
      value: "Toutes les utilisations",
      kind: "text",
    },
    {
      value: "Utilisation à préciser",
      kind: "text",
    },
    {
      value: "Utilisation inconnue",
      kind: "text",
    },
    {
      value: "Données disponibles",
      kind: "text",
    },
    {
      value: "Toutes les fiches",
      kind: "text",
    },
    {
      value: "Caractéristiques renseignées",
      kind: "text",
    },
    {
      value: "Documents PDF disponibles",
      kind: "text",
    },
    {
      value: "Caractéristiques à compléter",
      kind: "text",
    },
    {
      value:
        "Ces filtres concernent les informations des fiches. Ils n’indiquent aucun stock.",
      kind: "text",
    },
    {
      value: "Réinitialiser",
      kind: "text",
    },
    {
      value: "BIEN PRÉPARER SON PROJET",
      kind: "text",
    },
    {
      value: "Dimensions, quantités, contraintes : chaque détail compte.",
      kind: "text",
    },
    {
      value: "/contact",
      kind: "url",
    },
    {
      value: "Préparer mon besoin →",
      kind: "text",
    },
    {
      value: "Résultats du catalogue",
      kind: "text",
    },
    {
      value: "Rechercher un produit",
      kind: "text",
    },
    {
      value: "Nom, famille ou référence…",
      kind: "text",
    },
    {
      value: "Trier les produits",
      kind: "text",
    },
    {
      value: "Référence",
      kind: "text",
    },
    {
      value: "Nom : A à Z",
      kind: "text",
    },
    {
      value: "Nom : Z à A",
      kind: "text",
    },
    {
      value: "référence",
      kind: "text",
    },
    {
      value: " de démonstration",
      kind: "text",
    },
    {
      value: "· Page",
      kind: "text",
    },
    {
      value: "sur ",
      kind: "text",
    },
    {
      value: "Aucune référence trouvée.",
      kind: "text",
    },
    {
      value: "Essayez un autre mot-clé ou élargissez vos filtres.",
      kind: "text",
    },
    {
      value: "Effacer les filtres",
      kind: "text",
    },
    {
      value: "Pagination du catalogue",
      kind: "text",
    },
    {
      value: "Précédent",
      kind: "text",
    },
    {
      value: "Suivant",
      kind: "text",
    },
    {
      value: "Démonstration",
      kind: "text",
    },
    {
      value: "Tarif et disponibilité non renseignés.",
      kind: "text",
    },
    {
      value: "Voir la fiche",
      kind: "text",
    },
    {
      value: "Préparer une consultation",
      kind: "text",
    },
    {
      value: "Demander un devis",
      kind: "text",
    },
    {
      value: "/catalogue",
      kind: "url",
    },
    {
      value: "Retour au catalogue",
      kind: "text",
    },
    {
      value: "RÉF. ",
      kind: "text",
    },
    {
      value: "Tarif",
      kind: "text",
    },
    {
      value: "Non renseigné",
      kind: "text",
    },
    {
      value: "Disponibilité",
      kind: "text",
    },
    {
      value: "Non vérifiée",
      kind: "text",
    },
    {
      value: "Précisez les quantités et les besoins de votre chantier.",
      kind: "text",
    },
    {
      value: "01 / LA TECHNIQUE",
      kind: "text",
    },
    {
      value: "Caractéristiques techniques",
      kind: "text",
    },
    {
      value:
        "Les données non renseignées nécessitent une validation avant toute utilisation.",
      kind: "text",
    },
    {
      value: "Aucune caractéristique technique validée disponible.",
      kind: "text",
    },
    {
      value: "02 / LA DOCUMENTATION",
      kind: "text",
    },
    {
      value: "Documents PDF",
      kind: "text",
    },
    {
      value: "(PDF)",
      kind: "text",
    },
    {
      value: "Aucun document PDF validé disponible pour cette référence.",
      kind: "text",
    },
    {
      value: "Image indisponible · illustration générique",
      kind: "text",
    },
    {
      value:
        "Illustration générique de démonstration · photo produit non fournie",
      kind: "text",
    },
    {
      value: "Choisir une image",
      kind: "text",
    },
    {
      value: "Nos produits",
      kind: "text",
    },
    {
      value:
        "Produits et données issus de la présentation fournie par SKS PROJETS. Les repères PDF indiquent les pages du document, pas des références commerciales. Tarifs et disponibilités non indiqués dans le document.",
      kind: "text",
    },
    {
      value: "Les avantages",
      kind: "text",
    },
    {
      value: "Fiche technique des étais",
      kind: "text",
    },
    {
      value: "Accueil",
      kind: "text",
    },
    {
      value: "Produits",
      kind: "text",
    },
    {
      value: "Notre catalogue produits",
      kind: "text",
    },
  ],
  contact: [
    {
      value: "VOTRE PROJET",
      kind: "text",
    },
    {
      value: "Préparons votre besoin.",
      kind: "text",
    },
    {
      value:
        "Préparez votre consultation. Aucune demande n’est collectée ou envoyée depuis cette démonstration.",
      kind: "text",
    },
    {
      value:
        "Cette référence est introuvable. Sélectionnez un produit dans le catalogue pour préparer votre brouillon.",
      kind: "text",
    },
    {
      value: "Les informations à réunir",
      kind: "text",
    },
    {
      value: "La famille d’équipement et les quantités envisagées.",
      kind: "text",
    },
    {
      value: "Les contraintes techniques et les dimensions nécessaires.",
      kind: "text",
    },
    {
      value: "La ville du chantier et le calendrier prévisionnel.",
      kind: "text",
    },
    {
      value:
        "Les coordonnées commerciales officielles seront ajoutées après confirmation par SKS PROJETS.",
      kind: "text",
    },
    {
      value: "/catalogue",
      kind: "url",
    },
    {
      value: "Explorer les équipements",
      kind: "text",
    },
    {
      value: "PRODUIT DE DÉMONSTRATION\n",
      kind: "text",
    },
    {
      value: "Votre brouillon de demande",
      kind: "text",
    },
    {
      value:
        "Le formulaire prépare un fichier texte sur votre appareil. Aucun envoi, aucune sauvegarde serveur.",
      kind: "text",
    },
    {
      value: "Produit concerné",
      kind: "text",
    },
    {
      value: "Quantité envisagée",
      kind: "text",
    },
    {
      value: "Ville du chantier",
      kind: "text",
    },
    {
      value: "Votre besoin et vos contraintes",
      kind: "text",
    },
    {
      value: "Dimensions à étudier, calendrier, achat ou location…",
      kind: "text",
    },
    {
      value: "Télécharger mon brouillon",
      kind: "text",
    },
    {
      value: "Brouillon préparé pour téléchargement. Aucune demande envoyée.",
      kind: "text",
    },
    {
      value:
        "Les coordonnées commerciales officielles restent à confirmer pour transmettre votre demande.",
      kind: "text",
    },
    {
      value: "Retour à la fiche produit",
      kind: "text",
    },
    {
      value: "SKS PROJETS | Maroc | Afrique",
      kind: "text",
    },
    {
      value: "Votre partenaire en coffrage, étaiement et échafaudage",
      kind: "text",
    },
    {
      value: "Siège social",
      kind: "text",
    },
    {
      value: "Vente • Location • Assistance Technique",
      kind: "text",
    },
    {
      value: "Coordonnées dans la présentation SKS PROJETS (PDF)",
      kind: "text",
    },
    {
      value: "Expert en solutions de coffrage, d’étaiement et d’échafaudage",
      kind: "text",
    },
    {
      value: "Maroc | Afrique",
      kind: "text",
    },
    {
      value: "+15 ans d’expérience",
      kind: "text",
    },
    {
      value:
        "Depuis sa création, SKS PROJETS accompagne les professionnels du BTP avec des solutions de coffrage, d'étaiement et d'échafaudage adaptées à tous types de projets. Portée par un dirigeant bénéficiant de plus de 15 ans d'expérience dans le secteur du coffrage et du gros œuvre, l'entreprise s'engage à fournir des solutions fiables, innovantes et performantes, répondant aux plus hauts standards de qualité et de sécurité.",
      kind: "text",
    },
    {
      value: "Vente de matériel",
      kind: "text",
    },
    {
      value: "Location de matériel",
      kind: "text",
    },
    {
      value: "Assistance technique",
      kind: "text",
    },
    {
      value: "Accompagnement chantier",
      kind: "text",
    },
    {
      value: "Coffrage Horizontal et Vertical",
      kind: "text",
    },
    {
      value: "Étaiement et Échafaudage",
      kind: "text",
    },
    {
      value: "Assistance Technique",
      kind: "text",
    },
    {
      value: "Études Techniques",
      kind: "text",
    },
    {
      value: "Suivi de Chantier",
      kind: "text",
    },
    {
      value: "Produits certifiés et de haute qualité",
      kind: "text",
    },
    {
      value: "Ingénierie européenne",
      kind: "text",
    },
    {
      value: "Étude & conseil technique sur chantier",
      kind: "text",
    },
    {
      value: "Solutions adaptées à chaque projet",
      kind: "text",
    },
    {
      value: "Assistance & montage durant le chantier",
      kind: "text",
    },
    {
      value: "Excellent rapport qualité/prix",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS propose des systèmes complets de coffrage pour les ouvrages horizontaux et verticaux, destinés aux projets résidentiels, commerciaux, industriels et de génie civil.",
      kind: "text",
    },
    {
      value: "Nos solutions au service de vos projets",
      kind: "text",
    },
    {
      value: "Bâtiments résidentiels",
      kind: "text",
    },
    {
      value: "Immeubles de bureaux",
      kind: "text",
    },
    {
      value: "Centres commerciaux",
      kind: "text",
    },
    {
      value: "Ouvrages industriels",
      kind: "text",
    },
    {
      value: "Génie civil",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS vous accompagne avec des solutions performantes, sûres et adaptées à tous vos chantiers.",
      kind: "text",
    },
    {
      value: "contact@sks-projets.ma",
      kind: "text",
    },
    {
      value: "+212 522 97 34 76",
      kind: "text",
    },
    {
      value: "+212 663 80 33 42",
      kind: "text",
    },
    {
      value: "www.sks-projets.ma",
      kind: "text",
    },
    {
      value:
        "Mega business centre 2, Lot 5i3d\n11 Bdir Aoua étage, M47 Sidi\nMaârouf, Casablanca",
      kind: "text",
    },
    {
      value: "Amine HARIR",
      kind: "text",
    },
    {
      value: "Directeur Général",
      kind: "text",
    },
    {
      value:
        "Depuis notre création, SKS PROJETS s'est donné pour mission d'accompagner les professionnels de la construction avec des solutions fiables en coffrage, étaiement et échafaudage métallique.",
      kind: "text",
    },
    {
      value:
        "Chaque jour, notre équipe met son savoir-faire au service de vos chantiers avec une exigence constante de qualité, de réactivité et de professionnalisme.",
      kind: "text",
    },
    {
      value:
        "Notre force réside dans notre capacité à conjuguer expertise technique, proximité et écoute.",
      kind: "text",
    },
    {
      value:
        "Au-delà des équipements que nous proposons en vente, location et importation, nous plaçons la relation humaine au cœur de notre métier. Nous sommes convaincus qu'un chantier réussi commence par un partenaire de confiance, capable de comprendre les besoins de ses clients et d'y répondre avec efficacité.",
      kind: "text",
    },
    {
      value:
        "Je remercie sincèrement nos clients pour leur confiance renouvelée ainsi que notre équipe pour son engagement, son professionnalisme et son esprit d'initiative.",
      kind: "text",
    },
    {
      value:
        "Ensemble, nous continuons de bâtir l'avenir, projet après projet.",
      kind: "text",
    },
    {
      value: "Retour au catalogue",
      kind: "text",
    },
    {
      value: "VOTRE PROJET · SKS PROJETS",
      kind: "text",
    },
    {
      value: "Demander un devis",
      kind: "text",
    },
    {
      value:
        "Décrivez votre besoin. Renseignez vos coordonnées et les informations de votre chantier.",
      kind: "text",
    },
    {
      value:
        "Cette référence est introuvable. Choisissez un produit dans le formulaire.",
      kind: "text",
    },
    {
      value: "Votre sélection et nos coordonnées",
      kind: "text",
    },
    {
      value: "VOTRE SÉLECTION",
      kind: "text",
    },
    {
      value: "Consulter la fiche produit",
      kind: "text",
    },
    {
      value: "UNE QUESTION ?",
      kind: "text",
    },
    {
      value: "Parlons de votre chantier.",
      kind: "text",
    },
    {
      value: "Vente, location et assistance technique au Maroc et en Afrique.",
      kind: "text",
    },
    {
      value:
        "Les tarifs et disponibilités seront à confirmer après étude de votre besoin.",
      kind: "text",
    },
    {
      value:
        "Veuillez accepter l’utilisation de vos informations pour traiter cette demande.",
      kind: "text",
    },
    {
      value: "Enregistrement indisponible.",
      kind: "text",
    },
    {
      value:
        "Connexion interrompue. Aucune confirmation reçue. Réessayez ultérieurement.",
      kind: "text",
    },
    {
      value: "Demande enregistrée",
      kind: "text",
    },
    {
      value: "Votre référence : ",
      kind: "text",
    },
    {
      value:
        "Votre demande sera étudiée. Elle ne constitue pas un devis ni une réservation.",
      kind: "text",
    },
    {
      value: "FORMULAIRE DE DEMANDE",
      kind: "text",
    },
    {
      value: "Les détails de votre projet",
      kind: "text",
    },
    {
      value: "Les champs marqués d’un astérisque sont obligatoires.",
      kind: "text",
    },
    {
      value: "Vos coordonnées",
      kind: "text",
    },
    {
      value: "Nom et prénom",
      kind: "text",
    },
    {
      value: "Votre nom complet",
      kind: "text",
    },
    {
      value: "Société",
      kind: "text",
    },
    {
      value: "Nom de votre entreprise",
      kind: "text",
    },
    {
      value: "Email",
      kind: "text",
    },
    {
      value: "Téléphone",
      kind: "text",
    },
    {
      value: "Votre besoin en matériel",
      kind: "text",
    },
    {
      value: "Sélectionnez un équipement",
      kind: "text",
    },
    {
      value: "Type de demande",
      kind: "text",
    },
    {
      value: "Vente",
      kind: "text",
    },
    {
      value: "Location",
      kind: "text",
    },
    {
      value: "Votre chantier",
      kind: "text",
    },
    {
      value: "Ville",
      kind: "text",
    },
    {
      value: "Adresse du chantier",
      kind: "text",
    },
    {
      value: "Adresse ou localisation du chantier",
      kind: "text",
    },
    {
      value: "Début souhaité",
      kind: "text",
    },
    {
      value: "Fin souhaitée",
      kind: "text",
    },
    {
      value:
        "Précisez les dimensions, l’utilisation prévue, le calendrier et les contraintes techniques…",
      kind: "text",
    },
    {
      value:
        "J’accepte que SKS PROJETS utilise ces informations pour traiter ma demande.",
      kind: "text",
    },
    {
      value: "Vérifiez les informations saisies.",
      kind: "text",
    },
    {
      value: "Votre demande sera transmise à l’équipe SKS PROJETS.",
      kind: "text",
    },
    {
      value:
        "L’envoi en ligne est indisponible pour le moment. Vous pouvez remplir le formulaire et télécharger votre demande, puis la transmettre par email.",
      kind: "text",
    },
    {
      value: "Enregistrement…",
      kind: "text",
    },
    {
      value: "Envoyer ma demande",
      kind: "text",
    },
    {
      value: "Télécharger ma demande",
      kind: "text",
    },
    {
      value: "À transmettre à ",
      kind: "text",
    },
    {
      value:
        "Demande préparée pour téléchargement. Aucune demande envoyée automatiquement.",
      kind: "text",
    },
    {
      value: "Les tarifs et les disponibilités restent à confirmer.",
      kind: "text",
    },
  ],
  formulaires: [
    {
      value: "Demande enregistrée",
      kind: "text",
    },
    {
      value: "Votre référence : ",
      kind: "text",
    },
    {
      value:
        "Conservez cette référence. Votre demande sera étudiée ; elle ne constitue pas un devis ni une réservation.",
      kind: "text",
    },
    {
      value:
        "Le service d’enregistrement n’est pas configuré. Vous pouvez préparer votre demande, mais son envoi est indisponible.",
      kind: "text",
    },
    {
      value: "Produit introuvable. Sélectionnez une référence ci-dessous.",
      kind: "text",
    },
    {
      value: "Vos coordonnées professionnelles",
      kind: "text",
    },
    {
      value: "Nom et prénom",
      kind: "text",
    },
    {
      value: "Société",
      kind: "text",
    },
    {
      value: "Téléphone",
      kind: "text",
    },
    {
      value: "Email",
      kind: "text",
    },
    {
      value: "Ville du chantier",
      kind: "text",
    },
    {
      value: "Adresse du chantier",
      kind: "text",
    },
    {
      value: "Produits et quantités",
      kind: "text",
    },
    {
      value: "Aucun produit disponible.",
      kind: "text",
    },
    {
      value: "Démonstration",
      kind: "text",
    },
    {
      value: "Quantité · ",
      kind: "text",
    },
    {
      value: "Type de demande",
      kind: "text",
    },
    {
      value: "Vente",
      kind: "text",
    },
    {
      value: "Location",
      kind: "text",
    },
    {
      value: "Début souhaité",
      kind: "text",
    },
    {
      value: "Fin souhaitée",
      kind: "text",
    },
    {
      value: "Message complémentaire",
      kind: "text",
    },
    {
      value: "Site internet",
      kind: "text",
    },
    {
      value:
        "Les tarifs, disponibilités et conditions de location seront confirmés après étude. Les références de démonstration restent identifiées comme telles. Vos coordonnées sont réservées à l’équipe habilitée pour traiter cette demande.",
      kind: "text",
    },
    {
      value: "Enregistrement…",
      kind: "text",
    },
    {
      value: "Envoyer ma demande",
      kind: "text",
    },
  ],
  autres: [
    {
      value: "Email professionnel",
      kind: "text",
    },
    {
      value: "Mot de passe",
      kind: "text",
    },
    {
      value: "ESPACE PROFESSIONNEL",
      kind: "text",
    },
    {
      value: "Ravi de vous retrouver.",
      kind: "text",
    },
    {
      value: "Accès réservé aux comptes autorisés par SKS PROJETS.",
      kind: "text",
    },
    {
      value:
        "Authentification non configurée. PostgreSQL et un secret local sont nécessaires. Aucun compte de démonstration ni accès automatique n’est fourni.",
      kind: "text",
    },
    {
      value: "← Retour au site",
      kind: "text",
    },
    {
      value: "VOTRE ESPACE PROFESSIONNEL",
      kind: "text",
    },
    {
      value: "Bienvenue, ",
      kind: "text",
    },
    {
      value: "Accéder à l’administration ↗",
      kind: "text",
    },
    {
      value:
        "La consultation détaillée des documents sera disponible à la prochaine étape.",
      kind: "text",
    },
    {
      value: "VOTRE PROJET B2B",
      kind: "text",
    },
    {
      value: "Demander un devis",
      kind: "text",
    },
    {
      value:
        "Vente ou location : précisez les équipements et les besoins de votre chantier.",
      kind: "text",
    },
    {
      value: "SKS PROJETS · PUBLICATIONS",
      kind: "text",
    },
    {
      value: "Articles",
      kind: "text",
    },
    {
      value: "Lire l’article →",
      kind: "text",
    },
    {
      value: "Aucun article publié pour le moment.",
      kind: "text",
    },
    {
      value: "Découvrir",
      kind: "text",
    },
    {
      value: "Liens utiles",
      kind: "text",
    },
    {
      value: "VOTRE PROCHAIN PROJET",
      kind: "text",
    },
    {
      value: "Vente • Location • Assistance Technique",
      kind: "text",
    },
  ],
  presentation: [
    {
      value: "QUI SOMMES-NOUS ?",
      kind: "text",
    },
    {
      value: "À propos de SKS PROJETS",
      kind: "text",
    },
    {
      value: "Spécialisée dans les solutions de coffrage et d’échafaudage",
      kind: "text",
    },
    {
      value:
        "Un dirigeant bénéficiant de plus de 15 ans d’expérience dans le secteur du coffrage et du gros œuvre.",
      kind: "text",
    },
    {
      value: "Nos services",
      kind: "text",
    },
    {
      value: "Nos expertises",
      kind: "text",
    },
    {
      value: "Nos Engagements",
      kind: "text",
    },
    {
      value: "Pourquoi choisir SKS PROJETS ?",
      kind: "text",
    },
    {
      value: "MOT DU DIRECTEUR GÉNÉRAL",
      kind: "text",
    },
    {
      value:
        "Ensemble, nous continuons de bâtir l’avenir, projet après projet.",
      kind: "text",
    },
    {
      value: "Consulter la présentation originale (PDF)",
      kind: "text",
    },
    {
      value: "Contact",
      kind: "text",
    },
    {
      value: "Projets",
      kind: "text",
    },
    {
      value: "Nos produits",
      kind: "text",
    },
    {
      value: "Présentation des domaines d’application · page 18 (PDF)",
      kind: "text",
    },
    {
      value: "Votre partenaire en coffrage, étaiement et échafaudage",
      kind: "text",
    },
    {
      value: "Expert en solutions de coffrage, d’étaiement et d’échafaudage",
      kind: "text",
    },
    {
      value: "Vente • Location • Assistance Technique",
      kind: "text",
    },
    {
      value: "Maroc | Afrique",
      kind: "text",
    },
    {
      value: "+15 ans d’expérience",
      kind: "text",
    },
    {
      value:
        "Depuis sa création, SKS PROJETS accompagne les professionnels du BTP avec des solutions de coffrage, d'étaiement et d'échafaudage adaptées à tous types de projets. Portée par un dirigeant bénéficiant de plus de 15 ans d'expérience dans le secteur du coffrage et du gros œuvre, l'entreprise s'engage à fournir des solutions fiables, innovantes et performantes, répondant aux plus hauts standards de qualité et de sécurité.",
      kind: "text",
    },
    {
      value: "Vente de matériel",
      kind: "text",
    },
    {
      value: "Location de matériel",
      kind: "text",
    },
    {
      value: "Assistance technique",
      kind: "text",
    },
    {
      value: "Accompagnement chantier",
      kind: "text",
    },
    {
      value: "Coffrage Horizontal et Vertical",
      kind: "text",
    },
    {
      value: "Étaiement et Échafaudage",
      kind: "text",
    },
    {
      value: "Assistance Technique",
      kind: "text",
    },
    {
      value: "Études Techniques",
      kind: "text",
    },
    {
      value: "Suivi de Chantier",
      kind: "text",
    },
    {
      value: "Produits certifiés et de haute qualité",
      kind: "text",
    },
    {
      value: "Ingénierie européenne",
      kind: "text",
    },
    {
      value: "Étude & conseil technique sur chantier",
      kind: "text",
    },
    {
      value: "Solutions adaptées à chaque projet",
      kind: "text",
    },
    {
      value: "Assistance & montage durant le chantier",
      kind: "text",
    },
    {
      value: "Excellent rapport qualité/prix",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS propose des systèmes complets de coffrage pour les ouvrages horizontaux et verticaux, destinés aux projets résidentiels, commerciaux, industriels et de génie civil.",
      kind: "text",
    },
    {
      value: "Nos solutions au service de vos projets",
      kind: "text",
    },
    {
      value: "Bâtiments résidentiels",
      kind: "text",
    },
    {
      value: "Immeubles de bureaux",
      kind: "text",
    },
    {
      value: "Centres commerciaux",
      kind: "text",
    },
    {
      value: "Ouvrages industriels",
      kind: "text",
    },
    {
      value: "Génie civil",
      kind: "text",
    },
    {
      value:
        "SKS PROJETS vous accompagne avec des solutions performantes, sûres et adaptées à tous vos chantiers.",
      kind: "text",
    },
    {
      value: "contact@sks-projets.ma",
      kind: "text",
    },
    {
      value: "+212 522 97 34 76",
      kind: "text",
    },
    {
      value: "+212 663 80 33 42",
      kind: "text",
    },
    {
      value: "www.sks-projets.ma",
      kind: "text",
    },
    {
      value:
        "Mega business centre 2, Lot 5i3d\n11 Bdir Aoua étage, M47 Sidi\nMaârouf, Casablanca",
      kind: "text",
    },
    {
      value: "Amine HARIR",
      kind: "text",
    },
    {
      value: "Directeur Général",
      kind: "text",
    },
    {
      value:
        "Depuis notre création, SKS PROJETS s'est donné pour mission d'accompagner les professionnels de la construction avec des solutions fiables en coffrage, étaiement et échafaudage métallique.",
      kind: "text",
    },
    {
      value:
        "Chaque jour, notre équipe met son savoir-faire au service de vos chantiers avec une exigence constante de qualité, de réactivité et de professionnalisme.",
      kind: "text",
    },
    {
      value:
        "Notre force réside dans notre capacité à conjuguer expertise technique, proximité et écoute.",
      kind: "text",
    },
    {
      value:
        "Au-delà des équipements que nous proposons en vente, location et importation, nous plaçons la relation humaine au cœur de notre métier. Nous sommes convaincus qu'un chantier réussi commence par un partenaire de confiance, capable de comprendre les besoins de ses clients et d'y répondre avec efficacité.",
      kind: "text",
    },
    {
      value:
        "Je remercie sincèrement nos clients pour leur confiance renouvelée ainsi que notre équipe pour son engagement, son professionnalisme et son esprit d'initiative.",
      kind: "text",
    },
    {
      value:
        "Ensemble, nous continuons de bâtir l'avenir, projet après projet.",
      kind: "text",
    },
  ],
};
