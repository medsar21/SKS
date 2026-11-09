# Vérification de la préparation à l’hébergement

Les contrôles suivants ont réussi sur le poste de développement : validation Prisma, typecheck, lint, 89 tests unitaires et compilation Next.js en mode production.

Une base PostgreSQL 17 isolée a permis de vérifier l’application des cinq migrations et la création explicite du premier administrateur. Le test navigateur `managed-cms.spec.ts` valide la connexion, l’import idempotent des 17 produits et six catégories, le téléversement d’une image, l’enregistrement d’un brouillon sans effet public, la publication du titre et de la bannière, la modification d’une photo de catégorie et d’une description produit, puis la réception d’une demande de devis dans l’administration. Les identités et contenus de ce test sont explicitement de démonstration et restent dans la base isolée.

Les tests publics ciblés vérifient aussi le formulaire hors ligne, l’accueil responsive, les filtres de catégories et les liens des services.

Après mise à jour de `fast-uri`, `npm audit --omit=dev` ne signale aucune vulnérabilité. L’audit incluant les outils de développement signale sept alertes modérées liées à `minimatch` via `typescript-eslint` ; aucune mise à jour majeure forcée n’a été appliquée.

La configuration Docker, PostgreSQL et Caddy est fournie avec le [guide de mise en production](../deploy/PRODUCTION.md). Docker n’est pas disponible sur ce poste : la construction Linux des images et l’obtention du certificat HTTPS devront être vérifiées sur le serveur cible. Aucun déploiement externe n’a été effectué. Les variables et secrets réels de l’hébergement restent à renseigner. L’envoi d’emails SMTP et les traductions complètes ne sont pas configurés.

Les anciens rapports présents dans `docs/` décrivent les étapes historiques du projet ; ce document précise le périmètre des contrôles de préparation à l’hébergement.
