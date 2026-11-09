# SKS Business Platform

Plateforme B2B pour SKS PROJETS · développement et intégration MNH Technologie.

## Hébergement en production

Voir le [guide de déploiement](deploy/PRODUCTION.md) : configuration HTTPS/PostgreSQL, migrations, premier administrateur et import du PDF depuis le dashboard. Les variables requises sont dans `.env.production.example`. La production utilise exclusivement le catalogue en base.

## Démarrage local

Pour consulter le site avec le contenu du PDF SKS PROJETS sans PostgreSQL :

```sh
npm run dev:presentation
```

Sous PowerShell, utiliser `npm.cmd run dev:presentation`. Ce mode conserve les fichiers `.env` et les bases existantes. Les pages `/a-propos`, `/projets`, `/catalogue` et `/contact` reprennent la présentation fournie. Voir [la correspondance avec les pages du PDF](docs/PDF_CONTENT_MAPPING.md). Les sections historiques ci-dessous décrivent les premières missions du projet.

Node.js 22.20+ et npm. Sous PowerShell, utiliser `npm.cmd` si `npm.ps1` est bloqué.

```sh
npm ci
npm run db:generate
npm run dev
```

Ouvrir http://localhost:3000. L'accueil, le catalogue illustratif filtrable et la page de préparation de projet fonctionnent sans base. L'inscription est fermée. Ni demande de devis ni CRUD n'est annoncé comme opérationnel.

## PostgreSQL et authentification

1. Copier `.env.example` vers `.env` localement et configurer une base PostgreSQL dédiée.
2. Générer un secret avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` et le placer dans `BETTER_AUTH_SECRET`. Ne jamais le committer.
3. Définir `BETTER_AUTH_URL=http://localhost:3000` (origine exacte du navigateur).
4. Exécuter `npm run db:deploy` pour appliquer la migration initiale.
5. Pour le catalogue de test uniquement, définir `ALLOW_DEMO_SEED=true`, exécuter `npm run db:seed`, puis remettre la valeur à `false`. Seed idempotent et transactionnel, ne remplace pas les données existantes, crée uniquement des références identifiées DÉMO et un événement d'audit.

Aucun compte par défaut. Le provisionnement sécurisé de l'administrateur et la récupération de compte font partie de P0 suivant. Ne pas ouvrir temporairement l'inscription pour obtenir un administrateur. Le layout `/admin` autorise uniquement ADMIN et SALES ; `/espace-client` filtre la lecture par utilisateur connecté. Sans configuration, les visiteurs privés sont redirigés vers la connexion, dont le formulaire est désactivé.

Les cookies sont `secure` en production : un serveur lancé avec `npm start` exige HTTPS pour une connexion persistante ; utiliser `npm run dev` pour la connexion locale HTTP. Le serveur de production local sert aussi à vérifier les pages publiques sans secrets.

## Commandes

```sh
npm run db:validate
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm start
```

Tests navigateur : `npx playwright install chromium` puis `npm run test:e2e`. Avec Chrome déjà installé, utiliser `PLAYWRIGHT_CHANNEL=chrome` (PowerShell : `$env:PLAYWRIGHT_CHANNEL='chrome'`) avant `npm run test:e2e` pour éviter le téléchargement. Les tests e2e utilisent un environnement local de démonstration, jamais des comptes réels. Les tests d'intégration PostgreSQL et les parcours authentifiés seront ajoutés lors du provisionnement P0 suivant.

## État fonctionnel

- Livré : structure modulaire, UI publique responsive française, catalogue statique filtrable explicitement démo, configuration de connexion Better Auth, layouts privés et contrôles serveur, lecture client isolée, Prisma, seed, outillage de qualité.
- Préparé : dictionnaires fr/ar/en, MAD, Africa/Casablanca, modèles commerciaux et audit.
- À implémenter : provisionnement administrateur, CRUD, demande de devis persistée, transitions métier, commandes, dashboard connecté, traductions complètes.
- Aucun déploiement, secret réel, donnée personnelle ni coordonnées commerciales inventées.

Mission 02 : palette BTP bleu nuit/orange, composants partagés, navigation desktop/mobile et habillage commun des espaces Admin/Client. Aucun nouveau parcours métier ni dépendance ajoutée.

Voir [architecture](docs/ARCHITECTURE.md), [Design System et fichiers de la mission 02](docs/DESIGN_SYSTEM.md), [roadmap](docs/ROADMAP.md) et [rapport de vérification](docs/VERIFICATION.md).
