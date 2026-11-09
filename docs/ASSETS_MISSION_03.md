# Mission 03 — Provenance du visuel

## Actif livré

- Fichier utilisé : `public/images/construction-demo.webp`.
- Dimensions : 1672 × 940 pixels ; poids : 265 690 octets, environ 259,5 Kio.
- Origine : génération avec l'outil intégré imagegen ; aucun compte externe ni secret API utilisé.
- Le PNG généré a été encodé en WebP, qualité 80, avec Sharp déjà disponible. Aucune nouvelle dépendance.
- Le fichier WebP est copié dans le projet et servi localement via `next/image`, avec `fill`, `sizes` et préchargement du hero. Aucun hébergeur d'images tiers n'est sollicité au chargement.
- Ce visuel synthétique n'est ni une photographie d'une réalisation SKS PROJETS, ni une représentation des produits MECANOFLEX, ECOFORM ou VMC.
- Mention visible : « Visuel généré · chantier illustratif ». Le texte alternatif indique également l'origine générée et l'absence de lien avec une réalisation SKS PROJETS.

Les graphismes M/E/V des cartes solutions sont des repères typographiques décoratifs en CSS, masqués aux lecteurs d'écran. Ils ne représentent aucune configuration produit. Les illustrations du catalogue sont les SVG de principe déjà présents, associés aux références de démonstration existantes.

## Prompt final utilisé

Outil : imagegen intégré, mode génération, fond opaque. Aucun modèle ni API de remplacement utilisé.

```text
Use case: photorealistic-natural. Asset type: wide landscape construction photograph for a premium French B2B formwork equipment homepage, 3:2 or 16:9 landscape. Create a realistic editorial architectural photograph of a generic concrete building under construction, metal slab formwork, orderly steel shoring props and concrete columns, one tower crane, shot from ground level with wide architecture lens. No people, no logos, no text, no branding, no recognisable landmark, no implication of an actual company project. Late afternoon warm light, sophisticated architectural photography, rich midnight-blue shadows, warm sandy concrete, small industrial orange safety details. The main building occupies the right two thirds, tall columns and repetitive structural rhythm. Real construction textures, credible geometry, premium photographic craft, restrained natural colors, no glossy CGI, no surreal structure. This is an explicitly labelled synthetic demonstration visual, not a real SKS project. No typography in the image.
```
