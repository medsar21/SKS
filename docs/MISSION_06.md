# Mission 06 — backend et authentification

## État réel au 19 octobre 2026

La finalisation du code et les outils de provisionnement sont préparés. **Le parcours connecté n’est pas validé : les accès PostgreSQL du projet manquent.** Aucun compte n’a été créé et aucune migration n’a été appliquée dans cet environnement.

Le service Windows `postgresql-x64-18` est RUNNING. PostgreSQL 18 écoute au port **5440** et `pg_isready` confirme qu’il accepte les connexions. Sa configuration existante exige SCRAM-SHA-256 sur les connexions locales. Aucun fichier d’authentification PostgreSQL n’a été modifié, aucun mot de passe n’a été deviné et aucune base n’a été réinitialisée. Docker Desktop n’est pas joignable ; il n’est pas nécessaire pour cette instance PostgreSQL native.

`DATABASE_URL`, les variables de connexion PG* et la configuration Better Auth sont absentes. Aucun `.env.local` contenant une connexion utilisable n’a été trouvé. La présence d’un serveur à l’écoute ne prouve ni un accès authentifié ni la possibilité d’écrire.

## Modifications

- `scripts/load-env.ts` et dépendance directe `@next/env` fixée à la version de Next : priorité des variables identique à Next.js, y compris `.env.local`, sans afficher les valeurs. Utilisé par Prisma, le seed, Playwright et les processus de vérification. Aucun secret n’est préfixé NEXT_PUBLIC_.
- `prisma.config.ts` : suppression de la fausse connexion de secours ; sans DATABASE_URL, les migrations échouent explicitement, alors que validation et génération restent possibles.
- `prisma/schema.prisma` et `202610190001_development_accounts/migration.sql` : ajout non destructif de `User.developmentOnly`, false pour les utilisateurs existants.
- `src/server/auth.ts` : Better Auth conservé, inscription publique fermée, rôle et marqueur de développement non acceptés depuis le navigateur. Refus de création de session d’un compte de développement en production.
- `src/server/authorization.ts` : relecture du rôle et du marqueur en PostgreSQL pour chaque contrôle de session privée, y compris avec une session préexistante. Un rôle révoqué ou un utilisateur supprimé n’obtient pas d’accès via une ancienne valeur de session.
- `src/server/db.ts` : délai de connexion borné à cinq secondes.
- `src/server/cli/diagnose.ts` : diagnostic sans URL, mot de passe ni contenu de base dans la sortie. Si une connexion est fournie, il vérifie SELECT 1, la présence de l’historique Prisma et une écriture dans une table temporaire supprimée à la fin de la transaction. Ce diagnostic ne remplace pas le test de persistance d’un devis.
- `src/server/cli/provision-development.ts`, `local-configuration.ts` et `src/lib/development-policy.ts` : provisionnement explicitement autorisé uniquement hors production, sur une base PostgreSQL de boucle locale dont le nom exact est confirmé par SKS_DEV_DATABASE. Les bases système et les autres moteurs sont refusés. Identités ADMIN/CUSTOMER et mots de passe aléatoires, hachage Better Auth, marqueur developmentOnly, produit actif explicitement de démonstration, audit transactionnel. Les collisions avec des comptes ou produits existants sont refusées ; aucun mot de passe existant n’est remplacé. Le seed reste sans compte par défaut.
- `.env.local` n’est écrit par ce provisionnement qu’après vérification de l’accès et du schéma. Les secrets restent dans ce fichier ignoré par Git, dont les permissions Windows sont restreintes avant écriture ; ils ne sont jamais imprimés. Une panne ultérieure peut laisser des identités préparées dans le fichier sans compte créé : relancer le même provisionnement après correction, sans annoncer de création avant son succès.
- `src/features/auth/login-form.tsx` : méthode POST explicite, évitant une soumission GET avant hydratation.
- `tests/unit/authorization.test.ts`, `development-policy.test.ts` : refus anonyme, contrôle du rôle réel, révocation, compte supprimé, comptes de développement en production et garde-fous du provisionnement.
- `tests/e2e/quotes.spec.ts` et `src/server/testing/verify-quote.ts` : vraie connexion Better Auth par son endpoint public, cookies reçus normalement, aucun jeton fabriqué ; vérification PostgreSQL indépendante après création et après modification du statut, contrôle de l’acteur et de l’historique. Refus d’accès aux routes et de rejeu de la mutation pour visiteur anonyme et utilisateur CUSTOMER. Vérification de l’inscription publique désactivée. Les secrets ne sont pas saisis dans le DOM ; traces, captures et vidéos sont désactivées pour ce scénario.
- `package.json`, `package-lock.json`, `.env.example`, `playwright.config.ts`, `prisma/seed.ts` et documentation : dépendance, commandes et configuration associées.

Aucun développement supplémentaire de commande, facture, paiement ou module location.

## Actions exactes pour débloquer

1. Un administrateur PostgreSQL autorisé doit fournir un rôle de connexion et une base locale dédiée au développement sur `127.0.0.1:5440`. Le rôle doit pouvoir créer et modifier le schéma de cette base pour les migrations. Ne pas cibler une base de production ou une base métier existante sans vérifier son état. Ne modifier ni pg_hba.conf ni le mot de passe d’un compte existant pour contourner l’accès.
2. Renseigner **localement** DATABASE_URL dans `.env.local`, avec le nom de cette base et les identifiants autorisés. Ne pas transmettre cette URL dans le chat. Renseigner SKS_DEV_DATABASE avec le nom exact de la base. BETTER_AUTH_URL doit valoir `http://127.0.0.1:3000` pour les tests fournis ; le provisionnement peut générer le secret Better Auth manquant sans l’afficher.
3. Exécuter `npm run db:diagnose`, puis `npm run db:status`. Si une base contient déjà des tables sans historique Prisma, arrêter et examiner cet état : aucun baselining, reset ou db push automatique n’est prévu. Les migrations présentes sont `202610180001_initial`, `202610180002_quote_requests` et `202610190001_development_accounts` ; leur application réelle dépend de l’historique de la base cible.
4. Sur la base autorisée et compatible, appliquer `npm run db:deploy`, puis relancer `npm run db:status` et `npm run db:diagnose`. Aucune commande migrate reset n’est nécessaire.
5. Exécuter explicitement `dev:provision` avec ALLOW_DEV_SETUP=true, puis retirer cette autorisation de l’environnement courant. Sous PowerShell :

   ```powershell
   $env:ALLOW_DEV_SETUP = "true"
   npm run dev:provision
   Remove-Item Env:ALLOW_DEV_SETUP
   ```

   Le script prépare les deux identités aléatoires et un produit de démonstration ; il renseigne les variables DEV_ADMIN_ID, DEV_CUSTOMER_ID, QUOTE_E2E_EMAIL/PASSWORD, QUOTE_E2E_CUSTOMER_EMAIL/PASSWORD, QUOTE_E2E_PRODUCT_SLUG, QUOTE_E2E=true et SKS_CATALOGUE_SOURCE=prisma dans `.env.local`. Ne pas ouvrir ni copier ces valeurs dans une sortie partagée. Une configuration partielle d’identité est refusée : ses trois variables ID/email/password doivent rester cohérentes. Le script ne transforme pas un utilisateur existant en administrateur.

6. Vérifier que le port 3000 n’est pas occupé par un ancien serveur compilé avec une autre configuration. Lancer `npm run dev -- --hostname 127.0.0.1`, puis `npm run test:e2e:postgres` depuis un autre terminal. Si le navigateur Playwright n’est pas installé, définir PLAYWRIGHT_CHANNEL=msedge pour utiliser Edge existant. Les comptes developmentOnly sont refusés par l’application en mode production : utiliser le serveur de développement pour ce test authentifié, pas `next start`.
7. Le scénario doit réussir intégralement : catalogue connecté, demande enregistrée, lecture indépendante Quote/QuoteLine/AuditLog, dashboard et détail authentifiés, statut REQUESTED conservé après rechargement, audit unique avec acteur, refus des accès et mutations anonymes/CUSTOMER. Les demandes explicitement de démonstration restent dans la base dédiée ; aucune sortie de base n’est produite. Sans les prérequis, le scénario est ignoré avec son motif, ce qui ne constitue pas une réussite.

La suite publique historique utilise le catalogue mémoire de démonstration ; elle se lance séparément avec SKS_CATALOGUE_SOURCE=demo et `--grep-invert @postgres`. Le scénario PostgreSQL utilise SKS_CATALOGUE_SOURCE=prisma. Ne pas exécuter des tests publics supposant sept fixtures mémoire sur un catalogue PostgreSQL différent.

## Résultats de cette mission

- `pg_isready -h 127.0.0.1 -p 5440` : serveur joignable, accepte des connexions.
- `npm run db:diagnose` : blocage confirmé, DATABASE_URL absente ; aucune connexion SQL ni écriture vérifiée. Espace disque disponible très faible (environ 146 Mio après suppression du seul cache Next généré), à surveiller avant migrations et tests réels.
- `npm run db:status` et `npm run db:deploy` : exécutés, échec explicite faute de datasource.url. Aucun reset, aucune migration appliquée.
- `dev:provision` avec ALLOW_DEV_SETUP=true : exécuté, refus faute de connexion locale confirmée. Aucun compte, produit ou secret créé.
- `npm run db:validate` : réussi.
- `npm run typecheck` : réussi.
- `npm run lint` : réussi, aucune alerte.
- `npm run test` : **25 tests réussis**, 6 fichiers.
- `npm run build` : réussi.
- Playwright sous Edge existant, desktop et mobile, sur le build final : **22 tests publics réussis, 2 variantes du scénario PostgreSQL ignorées**, faute d’accès et d’identités locales. Commande Windows exécutée : `set PLAYWRIGHT_CHANNEL=msedge&& npm run test:e2e -- --workers=2 --trace=off`. Les tests authentifiés ne sont donc pas validés.

La mission reste bloquée sur l’accès authentifié à PostgreSQL. Les tests unitaires et publics ne prouvent pas la création du compte, le hachage en base, les cookies authentifiés ni la persistance réelle du devis. Aucun de ces résultats n’est simulé ou annoncé comme acquis.
