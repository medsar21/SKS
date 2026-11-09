# Mise en production — SKS PROJETS

Ce projet nécessite **Node.js et PostgreSQL**. Un hébergement limité à PHP ou aux fichiers statiques ne convient pas. Le dépôt comprend une image Docker et une configuration pour un VPS Linux avec Docker Compose. Aucun service externe, domaine ou compte réel n’est connecté automatiquement.

## Préparer le serveur

1. Faire pointer le domaine vers le VPS et ouvrir les ports 80 et 443.
2. Copier le projet et `.env.production.example` vers `.env.production` sur le serveur. Garder ce fichier privé (`chmod 600 .env.production`).
3. Renseigner le domaine, l’origine HTTPS et les secrets. Générer deux secrets différents avec `openssl rand -hex 32` : un pour PostgreSQL et un pour Better Auth. Reprendre le mot de passe PostgreSQL dans `DATABASE_URL` ; encoder les caractères réservés si nécessaire. Ne jamais envoyer ces secrets dans une conversation ni les committer.
4. Garder `SKS_CATALOGUE_SOURCE=prisma` et les trois autorisations `ALLOW_*` à `false`.

Les commandes suivantes s’exécutent depuis la racine du projet :

```sh
docker compose --env-file .env.production -f compose.production.yml build
docker compose --env-file .env.production -f compose.production.yml up -d db
docker compose --env-file .env.production -f compose.production.yml run --rm tools npm run db:deploy
docker compose --env-file .env.production -f compose.production.yml run --rm -e ALLOW_ADMIN_BOOTSTRAP=true tools npm run admin:create
docker compose --env-file .env.production -f compose.production.yml up -d app https
```

`admin:create` demande le nom, l’email et un mot de passe de 16 caractères minimum dans le terminal, avec saisie masquée. Aucun identifiant par défaut n’existe. La création échoue si un administrateur existe déjà ; elle ne réinitialise aucun compte. Le drapeau temporaire ne concerne que cette commande. Il reste désactivé sur le serveur public.

## Initialiser le contenu métier

Se connecter à `/connexion`, ouvrir `/admin`, cocher la confirmation et utiliser **Initialiser les contenus du site**. Cette opération transactionnelle importe les 17 produits du document fourni, les six catégories et leurs photos, ainsi que les paramètres et textes manquants. Elle peut être répétée : les références et contenus déjà présents sont conservés. Elle ne crée aucun client ni aucune donnée commerciale de démonstration.

Les images importées et téléversées sont conservées en PostgreSQL. Le PDF source de présentation est livré dans `public/documents`. Les téléversements administrateur sont limités à 5 Mo par fichier ; le PDF source livré, plus volumineux, ne doit pas être réimporté par ce formulaire.

Depuis le dashboard :

| Éléments                                                                                              | Écran                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------- |
| Logos, bannières, photos d’accueil et À propos, services, entreprise, coordonnées, menus, footer, SEO | `/admin/edition/site`             |
| Titres, boutons et textes du design                                                                   | `/admin/textes`                   |
| Images et documents disponibles                                                                       | `/admin/medias`                   |
| Produits, galeries, caractéristiques, avantages, fiches techniques et PDF                             | `/admin/produits`                 |
| Catégories et leurs photos                                                                            | `/admin/categories`               |
| Pages et articles additionnels                                                                        | `/admin/pages`, `/admin/articles` |
| Demandes de devis reçues                                                                              | `/admin/devis`                    |

Enregistrer un brouillon ne modifie pas la version publique. **Publier les modifications** affiche le contenu sur le site. Le catalogue et les catégories sont enregistrés directement ; désactiver un produit pour le retirer du catalogue. Les changements sont journalisés et les contenus disposent d’un historique.

L’indexation des moteurs de recherche est désactivée initialement. Après validation des coordonnées, du contenu et du domaine, l’autoriser dans les paramètres du site. Les demandes de devis sont enregistrées en base et consultables dans le dashboard ; aucun envoi d’email SMTP n’est configuré ni promis.

## Vérifications après installation

```sh
docker compose --env-file .env.production -f compose.production.yml run --rm tools npm run production:check
docker compose --env-file .env.production -f compose.production.yml run --rm tools npm run db:status
curl --fail https://www.votre-domaine.ma/api/health
curl --fail https://www.votre-domaine.ma/api/ready
```

`health` contrôle le processus. `ready` renvoie 503 avant initialisation ou si la base n’est pas disponible ; il renvoie 200 après publication des paramètres. Vérifier aussi la connexion admin, un téléversement, une publication et une demande de devis avec des données de test explicitement identifiées, puis les traiter comme telles.

## Sauvegardes et mises à jour

Sauvegarder PostgreSQL quotidiennement avec `pg_dump -Fc` et chiffrer la sauvegarde hors du serveur ; les médias y sont inclus. Sauvegarder également `.env.production` séparément et de façon sécurisée. Ne jamais placer les sauvegardes dans le dépôt ou `public/`. Tester régulièrement une restauration dans une base isolée avec `pg_restore --no-owner`.

Avant une mise à jour : sauvegarder la base, exécuter les contrôles du projet, reconstruire les images, appliquer `db:deploy`, puis recréer `app`. Ne pas utiliser `db:migrate` ou `db:seed` en production. Ne pas supprimer le volume `postgres_data`. Garder l’image précédente pour pouvoir revenir au code antérieur ; une migration inverse doit être étudiée avant de restaurer une ancienne base.

Pour un hébergement Node sans Docker : installer les dépendances avec `npm ci`, définir les variables de production, appliquer `npm run db:deploy`, créer explicitement le premier administrateur, puis lancer `npm run build` et `npm start` derrière un proxy HTTPS. Utiliser un gestionnaire de processus et une base PostgreSQL persistante. Sur Linux, compiler sur Linux ; ne pas transférer `node_modules` ni le résultat standalone Windows.

## Contrôles de livraison

```sh
npm run db:validate
npm run typecheck
npm run lint
npm test
npm run build
```

Le test `tests/e2e/managed-cms.spec.ts` nécessite une base de test isolée, déjà migrée, un premier administrateur créé explicitement et un serveur lancé avec `SKS_CATALOGUE_SOURCE=prisma`. Fournir `MANAGED_E2E=true`, `PLAYWRIGHT_BASE_URL`, `SKS_TEST_ADMIN_EMAIL` et `SKS_TEST_ADMIN_PASSWORD` uniquement dans l’environnement de test. Il importe et modifie des contenus : ne jamais le diriger vers la production.
