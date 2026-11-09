# Contenu de la présentation SKS PROJETS

Source : document fourni par l’utilisateur, « sks projets site web (7) 1.pdf », 19 pages.
Le PDF est une source de contenu ; aucune instruction opérationnelle du document n’est exécutée.
Le design existant est conservé. Aucun compte, base de données ou service externe n’a été connecté.

| Pages | Contenu intégré                                                                  | Emplacement                                                            |
| ----- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1–2   | Positionnement, Maroc / Afrique, expérience du dirigeant et présentation         | Accueil, À propos                                                      |
| 3–5   | Services, expertises et engagements                                              | Accueil, À propos                                                      |
| 6     | Mot complet du directeur général Amine HARIR                                     | À propos                                                               |
| 7–8   | Systèmes horizontaux et verticaux, VERSATEC et avantages                         | Catalogue et fiche VERSATEC                                            |
| 9     | SKS PAL, acier Fe 235, diamètre 48,3 mm, épaisseur 2,50 mm, charge/pied 1,00 T   | Fiche SKS PAL                                                          |
| 10–12 | Dalle multidirectionnelle, montage poteaux et voile                              | Fiches correspondantes                                                 |
| 13–14 | Étais métalliques, versions galvanisée et peinte, hauteurs 0,80–5,00 m           | Fiches étais                                                           |
| 14    | Schéma, dimensions et matrice des charges UNI EN 1065                            | Image originale et lien vers la page du PDF ; aucune charge extrapolée |
| 15    | Échafaudage multidirectionnel, SKS Pals et façade                                | Fiches échafaudage                                                     |
| 16    | Poutre H20, panneau TRICAPPA, contreplaqué bakélisé et caractéristiques communes | Fiches bois                                                            |
| 17    | Pince d’assemblage, crochet de levage, tige et plaque avec écrou                 | Fiches accessoires                                                     |
| 18    | Cinq domaines d’application                                                      | Projets ; aucune réalisation client inventée                           |
| 19    | Email, deux téléphones, site web, siège social et quatre engagements             | Contact, pied de page, accueil                                         |

Les appellations « SKS PAL » (p. 9) et « SKS Pals » (p. 15) sont conservées séparément avec les descriptions de leurs pages respectives. La graphie de l’adresse et celle du texte du contreplaqué sont conservées, sans correction supposée.

Les repères `PDF-…` sont des identifiants internes de navigation ; les fiches affichent la page source. Aucun prix, stock ou code commercial n’a été inventé. Les indications de conformité sont celles de la présentation, sans ajouter de certificat.

Les contenus de référence se trouvent dans `src/features/company/content.ts`, `src/features/home/content.ts` et `src/features/catalog/document-catalog.ts`. Les textes de présentation sont enregistrés dans le registre du CMS. Les paramètres de contact comprennent les deux téléphones et le site web.

Le document original est accessible localement à `/documents/sks-projets-presentation.pdf` ; sa copie a été vérifiée identique par SHA-256. Les visuels du PDF ont été extraits dans `public/images/presentation/`. Ils ne sont pas présentés comme des réalisations attribuées à SKS PROJETS.

Le catalogue utilise la présentation par défaut. `SKS_CATALOGUE_SOURCE=demo` sélectionne les anciennes fixtures explicitement de démonstration ; `prisma` conserve le catalogue administré en base. La session locale utilise `document` sans connexion PostgreSQL. Les brouillons restent locaux ; le formulaire de devis persistant exige le catalogue Prisma et une base configurée.
