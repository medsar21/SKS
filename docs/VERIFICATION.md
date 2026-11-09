# Vérification — Mission 02

Date : 18 octobre 2026. Vérifications locales, sans publication ni connexion à un compte réel.

## Résultats finaux réellement exécutés

| Commande                                                    | Résultat                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run db:validate`                                       | Réussi — schéma Prisma valide                                                                   |
| `npm run typecheck`                                         | Réussi — génération Prisma, types de routes Next.js et TypeScript strict                        |
| `npm run lint`                                              | Réussi — aucune erreur ni avertissement ESLint                                                  |
| `npm test`                                                  | Réussi — 2 fichiers, 4 tests unitaires                                                          |
| `npm run build`                                             | Réussi — compilation optimisée Next.js 16.4.2, vérification TypeScript et génération des routes |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- --workers=1` | Réussi — 10 tests sur 10, 25,2 secondes, Chrome desktop et émulation mobile                     |

Sous PowerShell, les commandes ont été exécutées avec `npm.cmd`. Pour Playwright : `$env:PLAYWRIGHT_CHANNEL='chrome'`. La passe finale a réutilisé le serveur local de production lancé avec `npm run start -- --hostname 127.0.0.1`, après le build final ; la configuration existante autorise cette réutilisation.

## Couverture navigateur

- Menu desktop et mobile complet, navigation vers le catalogue, état actif.
- Ouverture clavier, fermeture par Échap, restitution du focus et masquage du menu mobile.
- Lien d'évitement fonctionnel, un titre H1, repères principal/header/footer.
- Langue française, direction LTR, titre de page et `noindex, nofollow`.
- Vérification des quatre couleurs demandées sur les styles calculés.
- Accueil, catalogue et contact sans débordement horizontal à 320, 768 et 1440 px, en LTR et avec `dir="rtl"` injecté dans le navigateur pour contrôler le socle visuel.
- Mouvement réduit et absence d'erreur d'hydratation pendant ces parcours.
- Catalogue filtrable, fiches explicitement marquées de démonstration.
- Redirection des visiteurs anonymes depuis `/admin` et `/espace-client` vers la connexion.

Les captures finales de l'accueil et du catalogue ont été générées dans `test-results/`. Les captures desktop ont été inspectées visuellement ; une capture mobile de la première passe a également été examinée. Ces artefacts de tests sont ignorés par Git.

## Corrections issues des contrôles

Le lint a identifié un écouteur clavier sur l'élément non interactif `nav`. La gestion d'Échap utilise désormais un écouteur document installé uniquement pendant l'ouverture du menu, avec nettoyage.

Le test de mouvement réduit a révélé un défaut préexistant du composant `Reveal` : le style initial variait entre le serveur et le navigateur. Le rendu initial est maintenant identique et visible, et l'animation est déclenchée à l'entrée dans le viewport. La dernière passe ne détecte aucune erreur d'hydratation sur les parcours contrôlés. L'attribut `data-scroll-behavior="smooth"` requis pour l'ajustement du défilement Next.js 16 a aussi été ajouté.

## Incidents d'environnement et limites

Le disque C: était saturé lors du premier lancement Playwright : erreurs `ENOSPC`/Windows 112 dans Turbopack. Une passe suivante a terminé à 9/10, avec un échec d'écriture de trace faute d'espace. Ces passes ne constituent pas la validation finale.

Le contrôle automatique a refusé le nettoyage complet de `.next`. Le nettoyage a été réduit aux seuls sous-dossiers générés `.next/cache` et `.next/dev`, avec vérification des chemins absolus, sans toucher aux sources. Les validations ont ensuite été relancées. Pour éviter de saturer à nouveau le disque avec le cache de développement, la passe navigateur finale a utilisé le build de production local ; elle réussit à 10/10. Le disque reste peu disponible, environ 159 Mio lors du dernier relevé.

Les tests mobiles utilisent l'émulation Chrome, pas un appareil physique ni Safari. L'accessibilité est contrôlée par ESLint et des parcours clavier ciblés ; aucun audit complet avec lecteur d'écran n'a été réalisé. Le RTL est préparé et testé visuellement par direction ; les traductions complètes et la navigation multilingue restent hors périmètre.

Aucun compte autorisé n'a été créé. Les écrans privés authentifiés n'ont donc pas été inspectés dans le navigateur ; leurs layouts compilent et les protections anonymes sont testées. Les services serveur, le filtrage client existant, les schémas et les mutations sont inchangés. Aucune migration, seed, commande, CRUD ni nouvelle fonctionnalité de dashboard n'a été exécuté ou développé.

## Livraison

Voir [le Design System et l'arborescence des fichiers créés/modifiés](DESIGN_SYSTEM.md). Les dépendances et le lockfile sont conservés. Aucun commit ni déploiement n'a été effectué. L'étape suivante attend la validation de l'utilisateur.
