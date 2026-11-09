# SKS Business Platform

Première mission : socle exécutable, pas l'intégralité du MVP.

## Choix

Monolithe modulaire Next.js App Router / React / TypeScript strict, Tailwind 4, composants shadcn locaux, Lucide et Motion. PostgreSQL / Prisma 7 avec adaptateur pg. Better Auth pour sessions persistées et mots de passe hachés. Zod à la frontière métier ; React Hook Form préparé pour les prochaines mutations ; TanStack Table et Recharts réservés aux vrais écrans métier. Vitest et Playwright.

Versions stables résolues à l'installation puis verrouillées par package-lock.json. Node 22.20 observé. Aucun hébergement ni compte externe utilisé.

Versions vérifiées : Next.js 16.4.2, React 19.3.1, Prisma 7.10.1, Better Auth 1.7.10, TypeScript 6.0.3 et Tailwind 4.3.3. Le manifeste fixe les versions exactes. Le lint utilise ESLint + typescript-eslint, React Hooks et jsx-a11y. `eslint-config-next` a été retiré parce que sa dépendance transitive `braces` présente une vulnérabilité sans correctif publié ; les règles spécifiques Next ne sont donc pas activées. Le build Next et TypeScript contrôlent la compatibilité du framework.

## Modules et flux

- `src/app/(public)` : accueil et catalogue explicitement de démonstration, fonctionnent sans base.
- `src/app/(auth)/connexion` : connexion locale réelle si PostgreSQL et secret configurés, inscription publique désactivée.
- `src/app/(admin)/admin` : contrôle serveur ADMIN ou SALES avant tout rendu. Écran de socle sans faux indicateurs.
- `src/app/(customer)/espace-client` : session obligatoire, contrôle d'appartenance dans la couche serveur.
- `src/app/api/auth` : intégration Better Auth, CSRF/origines et rate limiting de la bibliothèque.
- `src/server` : Prisma singleton, authentification, autorisation, accès métier et audit.
- `src/features` : fixtures explicites, validations et UI par domaine.
- `src/lib` : fonctions pures, formats monétaires et dictionnaires fr/ar/en.

Les services serveur importent `server-only`. Aucune base ni secret n'est nécessaire au rendu public ou à la compilation. Les routes privées refusent l'accès si l'authentification n'est pas configurée ; aucun mode bypass.

## Données

User, Session, Account, Verification suivent le modèle Better Auth. Customer lie un utilisateur à une entreprise. Category / Product forment le catalogue. Quote / QuoteLine gardent un instantané du libellé, prix, quantité et TVA ; Order / OrderLine gardent leur propre instantané. Identifiants opaques, références uniques, Decimal pour montants, devise MAD, index par client et statut. Suppression restreinte des documents commerciaux ; désactivation/archivage à privilégier. AuditLog conserve acteur, action, entité et horodatage. Les extensions location, inventaire et ERP feront l'objet de migrations dédiées.

## Sécurité et limites

Cookies httpOnly, SameSite et secure en production via Better Auth, secret obligatoire, trustedOrigins explicites, inscription fermée. RBAC côté serveur et filtrage client à partir de la session. Les futures mutations devront passer par un service validé et une transaction contenant l'audit. Les API métier ne sont pas exposées à cette étape.

Better Auth utilise une limitation persistée en base (RateLimit), adaptée à plusieurs instances. Le modèle Account peut contenir des jetons sensibles : ne pas exporter ni journaliser ces lignes. Prévoir politique de rétention et chiffrement des sauvegardes avant production. CSP stricte à définir avec nonces lors du durcissement P1 ; en-têtes de base déjà configurés. Les rôles sont définis côté base, jamais acceptés à l'inscription.

## Hypothèses

Mission 02 : palette bleu nuit `#101D2E`, orange industriel `#F59E0B`, blanc `#FFFFFF`, gris clair `#F5F7FA`. Les composants existants sont conservés et complétés par Container, SectionHeading, ProductCard, une navigation mobile et un shell Admin/Client partagé. Voir [le Design System et l'arborescence](DESIGN_SYSTEM.md).

Pas de photo, adresse, coordonnées, fiches techniques ou tarifs confirmés fournis ; illustrations vectorielles originales et références produits de démonstration étiquetées. Aucun prix, stock, client ou résultat réel annoncé. Les langues arabe et anglaise sont préparées dans un registre mais l'interface reste française. Ni devis, ni commandes, ni CRUD complet ne sont présentés comme livrés.

## Mission 05 — demandes de devis B2B

Le parcours `/catalogue` → `/demande-de-devis?produit=slug` → PostgreSQL → `/admin/devis` réutilise Quote/QuoteLine, sans nouvelle entité commerciale. Le formulaire contact historique reste un brouillon local. Les observations des missions précédentes ci-dessus décrivent leur périmètre initial ; les demandes de devis sont désormais implémentées, sous réserve de configuration et de validation d’intégration.

Quote accepte maintenant un client non rattaché : la soumission publique ne crée aucun compte ni Customer, et conserve les coordonnées et le chantier sur la demande. Aucun rattachement n’est déduit d’un email fourni par le navigateur. Les lignes conservent les libellés et prix lus en base ; prix et TVA inconnus restent null, sans zéro inventé. Les demandes contenant un produit de démonstration sont identifiées comme telles. Les anciens devis liés à Customer restent consultables.

`src/server/quote-service.ts` est la frontière métier : Zod, produits actifs vérifiés en PostgreSQL, référence UUID unique, statut SUBMITTED et audit dans une transaction. L’entrée publique est l’exception intentionnelle à l’authentification des mutations, nécessaire à ce formulaire ; elle n’accepte ni prix ni customerId. Les Server Actions bénéficient du contrôle Origin/Host de Next.js. Un champ piège et les quotas persistants RateLimit limitent les soumissions valides à 5 par email et 100 au total par fenêtre d’une heure. Les compteurs sont consommés dans une transaction séparée : un rejet ultérieur ne les annule pas. Le verrou PostgreSQL commun sérialise la détection des doublons identiques sur 15 minutes, y compris entre instances. Aucun en-tête IP non vérifié n’est utilisé. Les emails des clés de quotas sont hachés, jamais journalisés.

Les lectures d’administration et chaque mutation vérifient la session ADMIN/SALES dans le service. Liste paginée par 20, recherche bornée, filtre de statut, détail et audit sont privés. Les transitions permises sont définies dans `src/features/quotes/validation.ts` ; les mises à jour conditionnelles sur le statut courant empêchent les écrasements concurrents et leur audit est atomique. Une modification de statut n’envoie aucun email. Aucun nouveau parcours commande, facture ou paiement.

Le catalogue par défaut reste illustratif. Pour le parcours connecté, configurer explicitement `SKS_CATALOGUE_SOURCE=prisma` et des produits actifs ; aucune fixture mémoire ne remplace un produit absent en base. La migration `202610180002_quote_requests` est additive, hormis les champs désormais facultatifs pour accueillir les demandes publiques et les prix inconnus. Elle doit être appliquée sur une base autorisée avant utilisation.

Voir [le protocole et les résultats de validation de la mission 05](MISSION_05.md). Aucune réussite de persistance ni d’authentification ne peut être déduite des tests unitaires avec doublures.

## Mission 06 — configuration et comptes de développement

Prisma et les outils hors Next chargent désormais `.env.local` avec la même priorité que l’application, via `scripts/load-env.ts` et `@next/env`. Aucune URL de secours ne remplace une connexion absente. `db:status` et `db:diagnose` vérifient l’état sans réinitialisation ; `db:deploy` reste le mécanisme d’application non destructive des migrations.

Un provisionnement distinct du seed, `dev:provision`, exige une autorisation explicite et une base PostgreSQL locale dédiée confirmée. Il crée des identités aléatoires ADMIN/CUSTOMER, des mots de passe hachés par Better Auth et un produit de démonstration, avec audit atomique. Aucun compte n’est créé au démarrage ou par défaut. Le champ User.developmentOnly et les contrôles Better Auth/DAL empêchent l’utilisation de ces comptes en production. Les rôles sont relus en base sur les lectures privées, afin de respecter les révocations même avec une session existante.

L’instance PostgreSQL locale détectée écoute au port 5440, mais les accès du projet restent absents à la fin de l’intervention. Aucune migration, création de compte ou persistance SQL n’est annoncée comme vérifiée. Voir [les résultats et les étapes exactes de déblocage](MISSION_06.md).

## Références

- https://nextjs.org/docs/app/getting-started/installation
- https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference
- https://www.better-auth.com/docs/integrations/next
- https://www.better-auth.com/docs/concepts/rate-limit
