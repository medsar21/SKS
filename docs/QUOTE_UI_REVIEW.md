# Retours UI : logo, formulaire de devis, cartes et chargement

- Fond blanc retiré du logo de la navbar et du footer. Le PNG original est conservé ; ses traits sombres sont adaptés au fond sombre par un filtre SVG d’affichage, avec transparence et jaune conservés.
- `/contact?produit=systeme-versatec` affiche un formulaire complet : nom, société, email, téléphone, produit prérempli, quantité, vente/location, adresse, ville, dates de location, précisions et accord de traitement.
- Formulaire validé avec le schéma Zod existant. En mode Prisma configuré, il utilise l’action serveur de devis existante et sa référence réelle. En mode présentation, il exporte un brouillon local et affiche clairement l’absence d’envoi ; aucune confirmation commerciale n’est simulée.
- Cartes produit : visuel encadré, titres et espacements alignés, boutons regroupés, bordures et survols retravaillés, grille compacte conservée.
- Introduction `BrandIntro` rétablie avec le composant `BrandLoading` existant : logo et engin animé, 1,7 seconde à l’ouverture. Le chargement des routes est conservé.

Vérifications : Prisma, TypeScript, lint, 89 tests unitaires, parcours navigateur ordinateur/mobile et build en mode présentation. Les cas de location refusent une période inversée et le test d’export vérifie qu’aucun POST n’est émis en mode local. Les tests de téléchargement historiques ont été adaptés aux coordonnées obligatoires.

Les captures locales sont dans `test-results/quote-final-1440.png`, `quote-final-390.png`, `cards-final-1440.png`, `cards-final-390.png` et `restored-loading.png`.

Limite conservée : PostgreSQL est indisponible. Aucun envoi réel ni parcours privé connecté n’a été validé. Aucun compte, secret ou service de messagerie n’a été ajouté.
