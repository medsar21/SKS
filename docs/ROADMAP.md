# Livraison MVP — horizon 24 heures

Les créneaux sont des estimations de travail, pas des garanties de livraison.

## P0 — socle et parcours essentiels

- Mission actuelle (H0–H4) : dépôt, outillage, architecture, schéma/migration initiale, fixtures, accueil/catalogue démo, layouts protégés et connexion, tests et build.
- H4–H8 : PostgreSQL local, application de la migration, provisionnement sécurisé d'un administrateur, tests de session, rôles et isolation inter-clients sur vraie base.
- H8–H13 : CRUD catégories/produits/clients, validations Zod + RHF, tableaux TanStack, transactions et audit, tests d'autorisation sur chaque mutation.
- H13–H18 : demande de devis persistée, lignes et totaux serveur, statuts contrôlés, espace client limité à ses documents, conversion devis accepté vers commande.
- H18–H24 : dashboard Recharts alimenté par agrégations réelles, QA parcours complets, accessibilité, responsive, revue sécurité et démo reproductible.

## P1 — consolidation

Tests d'intégration PostgreSQL, tests d'abus/CSRF/limitation, MFA administrateur, récupération d'accès, invitations, PDF devis et emails transactionnels avec consentement et configuration autorisée. Traductions complètes ar/en, RTL, CSP avec nonces, sauvegardes/restauration, observabilité, rétention audit et validation de la charte et des contenus SKS.

## P2 — extension métier

Location (réservations, retours, cautions), mouvements de stock et entrepôts, intégration ERP via adaptateurs et outbox transactionnelle, listes de prix et conditions commerciales. Pas de microservices avant besoin mesuré.

## Conditions avant production

Contenus et mentions légales approuvés, secrets de production dédiés, HTTPS, comptes autorisés, sauvegardes testées, isolation et RBAC testés sur base, politique de données validée, accord explicite de publication. Aucun déploiement dans cette mission.
