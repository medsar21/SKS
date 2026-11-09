# Services et références

- `/services` contient les trois parcours de services, leurs photos et leurs liens de contact. Ils restent modifiables dans les paramètres du site, sous « Services (page Services) ». Le titre et la description de la page sont dans le référencement des pages.
- Les anciens liens de menu `/#vente-location` sont interprétés comme `/services`. L’ancien emplacement de cette section dans l’ordre de l’accueil devient « Nos références », en conservant sa visibilité et les autres sections.
- `/admin/references` permet d’ajouter, réordonner et retirer les logos, ainsi que modifier le titre et la description du bandeau. Téléverser d’abord les logos dans la médiathèque, puis les sélectionner dans chaque champ Image.
- Enregistrer un brouillon prépare les changements ; « Publier les modifications » affiche les logos. La publication des références est indépendante des paramètres généraux du site et conserve son propre historique et audit. Aucune référence client n’est fournie par défaut. Le bandeau est masqué tant qu’aucun logo n’est publié.
- Les logos défilent en boucle, avec pause au survol et commande Pause/Reprendre. Le mode de mouvement réduit affiche une liste statique sans doublons accessibles.
- Les navigations publiques entre pages repartent en haut. Les liens avec ancre conservent leur destination dans la page et les écrans d’édition admin conservent leur position pendant l’enregistrement.

Les tests navigateur couvrent la page Services et le défilement sur ordinateur/mobile, ainsi que l’ajout, le brouillon, la publication, l’animation, la pause et le retrait des références sur une base PostgreSQL isolée. Aucune migration SQL n’est nécessaire : les références utilisent le stockage de contenus existant.
