# Déployer SKS PROJETS sur Vercel

Le dépôt est préparé pour le preset **Next.js**, à la racine du projet, avec **Node.js 24.x**. `vercel.json` définit `npm ci --include=dev` (les outils Prisma et TypeScript sont nécessaires au build) et `npm run build:vercel`. Laisser le répertoire de sortie par défaut ; ne pas sélectionner un export statique. Vercel n’utilise ni Docker Compose ni `npm start`.

## Variables à renseigner avant le déploiement

Dans **Settings → Environment Variables**, définir ces valeurs pour l’environnement Production :

| Variable                | Valeur attendue                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | URL PostgreSQL accessible depuis Vercel, de préférence avec pooler, et SSL selon le fournisseur   |
| `DIRECT_URL`            | URL PostgreSQL directe pour les migrations ; facultative si `DATABASE_URL` accepte les migrations |
| `BETTER_AUTH_URL`       | Origine HTTPS exacte, par exemple `https://votre-projet.vercel.app`, puis le domaine définitif    |
| `BETTER_AUTH_SECRET`    | Secret aléatoire d’au moins 32 caractères, généré localement et jamais committé                   |
| `SKS_CATALOGUE_SOURCE`  | `prisma`                                                                                          |
| `ALLOW_DEMO_SEED`       | `false`                                                                                           |
| `ALLOW_DEV_SETUP`       | `false`                                                                                           |
| `ALLOW_ADMIN_BOOTSTRAP` | `false`                                                                                           |

Une base `localhost`, le service Docker `db` ou le fichier `.env.local` du poste ne sont pas disponibles dans Vercel. Utiliser les URL fournies par votre hébergeur PostgreSQL. Les secrets restent exclusivement dans les variables serveur ; ne pas les préfixer par `NEXT_PUBLIC_`.

Le build vérifie les variables, génère Prisma Client, applique `prisma migrate deploy`, puis compile Next.js. Une configuration manquante ou une migration échouée bloque le déploiement. Aucun seed ni compte n’est créé pendant le build.

Configurer une **base distincte pour Preview** avant d’activer ces déploiements : la commande de build applique les migrations à la base configurée pour cet environnement. Ne jamais attribuer la base Production aux déploiements Preview. Pour tester la connexion sur une Preview, définir `BETTER_AUTH_URL` à son origine HTTPS exacte et redéployer ; les domaines de connexion ne sont pas autorisés par un joker.

## Premier administrateur et contenu

Après les migrations, utiliser depuis un poste de confiance les mêmes variables PostgreSQL dans un fichier `.env.production` privé et ignoré par Git. La commande exige une activation temporaire explicite et refuse de modifier un administrateur existant.

PowerShell :

```powershell
$env:NODE_ENV = 'production'
$env:ALLOW_ADMIN_BOOTSTRAP = 'true'
npm.cmd run admin:create
$env:ALLOW_ADMIN_BOOTSTRAP = 'false'
```

Le mot de passe est demandé avec saisie masquée ; il n’existe aucun identifiant par défaut. Ne pas activer ce drapeau sur Vercel. Se connecter ensuite à `/connexion`, ouvrir `/admin` et utiliser **Initialiser les contenus du site** pour importer les 17 produits, six catégories, images et textes du document fourni.

## Médias et fichiers

Les médias administrateur sont stockés en PostgreSQL et persistent entre les déploiements. Les images sources nécessaires au favicon et à l’import admin sont incluses dans les fonctions par `outputFileTracingIncludes`. Le PDF source est servi comme fichier statique depuis `public/documents`.

Les nouveaux téléversements sont limités à **3 Mo** dans le navigateur et sur le serveur pour rester sous la limite de requête Vercel de 4,5 Mo, y compris l’encodage multipart. Il n’y a aucune écriture persistante sur le disque des fonctions. Le favicon suit le logo publié dans les paramètres du site.

## Contrôles après le déploiement

- `/api/health` : processus disponible.
- `/api/ready` : 200 après migrations et publication des paramètres ; 503 avant initialisation ou si la base est indisponible.
- Vérifier la connexion admin, l’import, une photo téléversée, une publication et une demande de devis.
- Mettre à jour `BETTER_AUTH_URL` et redéployer si le domaine change.

Le build local et les tests ne prouvent pas l’accès à votre future base ni le déploiement Vercel : ces vérifications doivent être faites avec les variables réelles dans le projet Vercel. Aucun envoi d’email SMTP n’est configuré.

Sources : [Node.js sur Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [fichiers dans les fonctions](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions), [limite des requêtes](https://vercel.com/docs/errors/function_payload_too_large), [Prisma 7 avec Next.js et Vercel](https://www.prisma.io/docs/guides/v7/frameworks/nextjs).
