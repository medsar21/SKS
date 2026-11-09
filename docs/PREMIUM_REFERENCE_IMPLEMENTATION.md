# Refonte selon la maquette SKS PROJETS

Référence locale : `design-reference/sks-premium-reference.png` (copie de la maquette fournie). Travail local uniquement, aucun déploiement.

## Réalisation

- Accueil : navigation sombre superposée au héros, fond opaque au défilement, titre condensé, CTA jaune, bandeau d’engagements, trois services, six catégories, présentation et bandeau consultation.
- Catalogue : en-tête photographique, palette noir/jaune, cartes compactes, filtres, recherche, tri et pagination conservés.
- Fiches : galerie, caractéristiques techniques à côté de l’image sur ordinateur, tableaux lisibles, documentation réelle et préparation de consultation conservées.
- À propos, domaines, contact et connexion : styles harmonisés.
- Admin/client : styles du shell, navigation, tableaux, cartes, formulaires et états actifs harmonisés ; aucun accès privé contourné et aucune statistique ajoutée.
- CMS : ordre et visibilité des sections conservés, services reliés aux parcours configurables, engagements reliés aux paramètres existants, nouveaux textes enregistrés.
- Police locale Barlow Condensed, licence fournie ; aucune dépendance applicative ajoutée.
- Animations limitées aux apparitions, survols et transition du header, avec prise en compte de `prefers-reduced-motion`.

## Fichiers principaux modifiés

| Zone                   | Fichiers                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Accueil                | `src/features/home/home-page.tsx`, `home-page.module.css`, `content.ts`                                                        |
| Header et navigation   | `src/components/site-header.tsx`, `site-navigation.tsx`                                                                        |
| Styles partagés        | `src/app/globals.css`, `src/components/public-design.css`, `premium-workspace.css`                                             |
| Catalogue et fiches    | `src/features/catalog/catalog-page.tsx`, `product-detail.tsx`, `catalog.module.css`, `document-catalog.ts` (liens des images)  |
| Autres pages           | `src/features/company/company.module.css`, `src/app/(auth)/connexion/page.tsx`                                                 |
| Paramètres et contenus | `src/features/cms/validation.ts`, `copy-defaults.ts`                                                                           |
| Ressources             | `public/fonts/`, visuels extraits dans `public/images/presentation/`, `design-reference/`                                      |
| Tests adaptés          | `tests/e2e/homepage.spec.ts`, `catalog.spec.ts`, `design-system.spec.ts`, `smoke.spec.ts`, `construction-interactions.spec.ts` |

## Vérification

- Schéma Prisma validé, vérification TypeScript, lint et 89 tests unitaires réussis.
- 24 tests Playwright sur Chrome ordinateur et mobile : navigation clavier, menu mobile, header au défilement, catalogue, valeurs techniques, téléchargement du brouillon et redirections anonymes.
- Pages publiques contrôlées à 390, 768, 1024 et 1440 px, ainsi que socle RTL et mouvement réduit dans les tests existants ; aucun débordement détecté.
- Captures réelles comparées à la référence ; deuxième passe pour retirer les bandes du PDF des visuels et utiliser des extractions de meilleure définition.
- Build de production exécuté en mode présentation, avec `DATABASE_URL` vide et `SKS_CATALOGUE_SOURCE=document`.

## Captures réelles

- [Accueil ordinateur](../test-results/premium-home-1440.png)
- [Accueil mobile](../test-results/premium-home-390.png)
- [Héros ordinateur](../test-results/premium-hero-1440.png)
- [Héros mobile](../test-results/premium-hero-390.png)
- [Catalogue ordinateur](../test-results/premium-catalogue-1440.png)
- [Catalogue mobile](../test-results/premium-catalogue-390.png)
- [Fiche SKS PAL ordinateur](../test-results/premium-catalogue-sks-pal-1440.png)
- [Fiche SKS PAL mobile](../test-results/premium-catalogue-sks-pal-390.png)

Ces captures sont des sorties locales de vérification dans `test-results`, dossier ignoré par Git.

## Limites constatées

La photo exacte du héros et le bâtiment de la maquette ne sont pas fournis séparément. Les images utilisées proviennent du PDF fourni ; aucune image de siège social ou de réalisation client n’a été inventée. Le logo original est intact et présenté sur un fond clair pour rester lisible sur le header sombre.

Les catégories et données techniques du PDF priment sur les exemples de la maquette. Les 17 fiches et six catégories sont conservées ; aucune catégorie de sécurité, dimension, charge, certification supplémentaire ou donnée commerciale n’a été inventée.

PostgreSQL reste indisponible. Le rendu des espaces authentifiés et leurs écritures en base n’ont pas été validés dans un navigateur connecté ; seules les redirections anonymes et les vérifications statiques/unitaires ont été exécutées. Aucun compte n’a été créé. Le brouillon reste un téléchargement local et ne transmet pas automatiquement une demande.

Les paramètres CMS déjà publiés en base conservent leur priorité ; aucun contenu de base n’a été remplacé. La nouvelle disposition et la nouvelle palette sont les valeurs par défaut de la présentation locale.
