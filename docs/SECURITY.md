# Périmètre de sécurité du socle

## Contrôles présents

- Better Auth, inscription publique désactivée, sessions en base, expiration huit heures, cookies protégés et secure en production.
- Contrôle de session côté serveur dans chaque layout privé et contrôle de rôle au point d'accès administratif. Les futurs services de mutation doivent répéter ces vérifications ; un layout seul ne protège pas une server action.
- Lecture des données client filtrée par l'utilisateur de la session ; pas de customerId libre accepté du navigateur.
- Validation Zod du formulaire de connexion et des futurs produits ; refus des montants négatifs et de la précision monétaire excessive.
- Rate limiting Better Auth activé même en développement, stockage PostgreSQL, règle spécifique de connexion.
- Audit transactionnel du seed ; aucun endpoint métier de mutation exposé à cette étape.
- En-têtes nosniff, DENY, Referrer-Policy et Permissions-Policy, HSTS en production.

## Conditions de mise en service

Tester les sessions, la révocation, l'isolation inter-clients et les rôles contre PostgreSQL, puis tester les quotas par requêtes concurrentes. Valider le schéma Better Auth pour la version verrouillée et les migrations sur une base vide. Provisionner les comptes autorisés par un canal sécurisé ; aucune identité réelle ne doit servir de fixture.

Limiter l'accès direct au serveur derrière le reverse proxy. Configurer l'en-tête IP de confiance et faire écraser les en-têtes transmis par le proxy pour éviter de contourner les quotas. Le déploiement n'étant pas défini, aucune adresse de proxy n'est inventée ici.

Activer HTTPS, définir une origine de confiance exacte, utiliser un secret aléatoire de minimum 32 caractères, vérifier la politique de rotation, interdire les secrets dans les logs et protéger les sauvegardes. Ajouter CSP à nonces et politique de rétention des données/audits. Définir les permissions par mutation : SALES ne doit pas recevoir automatiquement les droits de gestion des utilisateurs.

Les tests unitaires des prédicats d'autorisation ne constituent pas une preuve d'isolation sur base ou de sécurité globale. Les tests navigateur anonymes couvrent seulement les redirections. Les parcours métier, mutations et tests d'intégration restent planifiés dans ROADMAP.md.
