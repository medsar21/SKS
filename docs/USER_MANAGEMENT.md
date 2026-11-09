# Création des utilisateurs

Un administrateur connecté peut ouvrir **Administration → Utilisateurs** (`/admin/utilisateurs`) ou utiliser le raccourci de la vue d’ensemble. Renseigner le nom, l’email, le rôle, un mot de passe de 12 à 128 caractères et sa confirmation.

Les rôles disponibles sont Client, Commercial et Administrateur. Le rôle Client est sélectionné initialement. L’inscription publique reste fermée : seul un administrateur peut créer un compte. Les commerciaux et les clients n’ont accès ni à la liste privée ni à l’action de création, y compris par requête directe.

Le mot de passe est haché avec la fonction utilisée par Better Auth. Il n’est jamais retourné, inscrit dans l’audit ou proposé à la consultation après la création. Aucun email n’est envoyé : l’administrateur transmet les identifiants par un canal adapté. Un email déjà utilisé est refusé sans modifier l’utilisateur existant. La liste est paginée à 25 comptes.

La journalisation des arguments des Server Actions est désactivée dans Next.js, afin que les mots de passe saisis ne soient pas imprimés dans le terminal de développement.

La création du compte, du moyen de connexion et de son audit utilise une transaction. L’acteur de l’audit provient de la session, dont les droits sont vérifiés côté serveur et relus avant l’écriture. Aucun compte n’est créé au démarrage ou au seed. Aucun changement de schéma ou migration supplémentaire n’est nécessaire.

Les comptes créés hors production sont marqués `developmentOnly`. Le contrôle d’authentification existant interdit leur utilisation en production. Un administrateur de production autorisé crée des comptes de production. Créer un utilisateur Client n’associe pas automatiquement une entreprise ou des documents à ce compte.

La modification des utilisateurs, la réinitialisation des mots de passe et les invitations par email ne font pas partie de cette fonctionnalité.

## Validation

`npm run test` couvre notamment les droits ADMIN, la validation, les champs supplémentaires refusés, le hachage, les emails en double, la sélection limitée de la liste et l’audit.

Sur une base locale dédiée explicitement autorisée, avec la configuration de développement existante :

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npx playwright test tests/e2e/users.spec.ts --project=chromium --workers=1
```

Ce test crée des identités temporaires explicitement de démonstration pour les trois rôles, vérifie leur connexion, le hachage et l’audit en PostgreSQL, le refus des doublons et du rejeu de l’action par un visiteur, un commercial et un client. Il vérifie aussi l’absence de débordement à 320, 390 et 1440 px, en LTR et RTL. Les comptes temporaires sont supprimés en fin de test avec audit ; les comptes existants ne sont pas modifiés. Les traces, vidéos et captures sont désactivées pour ce scénario.
