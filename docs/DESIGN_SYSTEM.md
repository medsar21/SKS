# Mission 02 — Structure frontend et Design System

## Principes

Le socle existant est conservé : Next.js App Router, TypeScript strict, Tailwind 4, Radix Slot, CVA, Lucide et Motion. Aucune dépendance ajoutée. Aucune mutation métier, commande, CRUD ou nouveau tableau de bord.

La version française reste active. Les dictionnaires `fr/ar/en`, les formats MAD et Africa/Casablanca sont conservés. Le layout racine utilise la langue et la direction du registre i18n. Les propriétés CSS logiques préparent le RTL ; les traductions complètes et le changement de langue restent à développer. Aucun sélecteur de langue inactif n'est affiché.

## Tokens

Source unique : `src/app/globals.css`, exposée aux utilitaires Tailwind par `@theme inline`.

| Usage                                   | Variable                    | Valeur    |
| --------------------------------------- | --------------------------- | --------- |
| Bleu nuit, texte et actions principales | `--primary`, `--foreground` | `#101D2E` |
| Accent industriel                       | `--accent`                  | `#F59E0B` |
| Surfaces                                | `--surface`                 | `#FFFFFF` |
| Fond général                            | `--background`              | `#F5F7FA` |
| Texte secondaire                        | `--muted-foreground`        | `#526175` |
| Accent lisible sur fond clair           | `--accent-strong`           | `#925900` |
| Bordures                                | `--border`                  | `#D7DFE9` |

L'orange vif reçoit du texte bleu nuit. Les petits textes sur fond clair utilisent l'accent foncé. Typographie système sans téléchargement externe ; titres fluides, cartes arrondies de 12 px, ombres discrètes. Les conteneurs sont limités à 1240 px, avec marges adaptées au viewport.

## Composants et responsabilités

| Composant                  | Fichier                                      | Contrat                                                                                                                                     |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Header et marque existants | `src/components/site-header.tsx`             | Structure serveur et identité partagée                                                                                                      |
| Navigation                 | `src/components/site-navigation.tsx`         | Liste unique desktop/mobile ; état actif ; panneau repliable sous 1100 px                                                                   |
| Footer existant            | `src/components/site-footer.tsx`             | Liens publics et mention explicite de démonstration                                                                                         |
| Button existant            | `src/components/ui/button.tsx`               | Variantes `default/accent/outline/ghost`, tailles `default/sm/icon`, composition `asChild` ; `type="button"` par défaut, `submit` explicite |
| Container                  | `src/components/ui/container.tsx`            | Marges et largeur partagées, `asChild` conserve la sémantique du `main` ou de la `section`                                                  |
| SectionHeading             | `src/components/ui/section-heading.tsx`      | Titre de niveau 1, 2 ou 3, surtitre, description, action et identifiant facultatifs                                                         |
| ProductCard                | `src/features/catalog/product-card.tsx`      | Carte typée des références de démonstration ; ni prix ni disponibilité inventés                                                             |
| WorkspaceShell             | `src/components/layouts/workspace-shell.tsx` | Habillage commun Admin/Client, navigation vers les seules routes existantes                                                                 |

`ProductIllustration` conserve les SVG existants ; ses variantes sont limitées à `panel/prop/accessory`. Les catégories définissent leur illustration explicitement, sans dépendre d'un tableau parallèle.

## Layouts

- Public : `(public)/layout.tsx` conserve `SiteHeader`, le contenu de page et `SiteFooter`.
- Admin : `(admin)/admin/layout.tsx` appelle toujours `requireAdmin()` avant `WorkspaceShell area="admin"`.
- Client : `(customer)/espace-client/layout.tsx` appelle toujours `requireSession()` avant `WorkspaceShell area="customer"`.
- Les vérifications propres aux pages et le filtrage serveur par session sont conservés. Le shell est uniquement visuel et ne constitue pas une frontière d'autorisation.

## Accessibilité et référencement

Navigation mobile en panneau non modal : bouton nommé, `aria-expanded`, `aria-controls`, liens masqués retirés du parcours clavier, fermeture par Échap avec retour au bouton. Les cibles principales mesurent au moins 44 px, les focus sont visibles. Le lien d'évitement cible les `main` publics et privés ; les illustrations décoratives sont masquées aux lecteurs d'écran. Les sections ont des titres et les fiches du catalogue des titres de niveau 2.

La préférence de mouvement réduit est conservée. `Reveal` garde un rendu initial visible identique côté serveur et navigateur, puis anime l'entrée dans le viewport ; cela corrige le décalage d'hydratation observé avec le mouvement réduit. Les métadonnées du catalogue et de la page de préparation du projet sont précisées. Le site conserve `noindex, nofollow`, car il s'agit d'une démonstration sans domaine officiel fourni ; aucun domaine, client, tarif ou résultat commercial n'est inventé.

## Arborescence concernée

`+` : créé pendant la mission ; `~` : modifié ; `=` : conservé.

```text
src/
  app/
    globals.css                              ~
    layout.tsx                               ~
    (public)/
      layout.tsx                             =
      page.tsx                               ~
      catalogue/page.tsx                     ~
      contact/page.tsx                       ~
    (admin)/admin/
      layout.tsx                             ~
      page.tsx                               =
    (customer)/espace-client/
      layout.tsx                             ~
      page.tsx                               ~
  components/
    site-header.tsx                          ~
    site-navigation.tsx                      +
    site-footer.tsx                          ~
    product-illustration.tsx                 ~
    reveal.tsx                               ~
    layouts/workspace-shell.tsx              +
    ui/
      button.tsx                             ~
      container.tsx                          +
      section-heading.tsx                    +
  features/catalog/
    data.ts                                  ~
    product-card.tsx                         +
tests/e2e/design-system.spec.ts               +
docs/DESIGN_SYSTEM.md                        +
docs/VERIFICATION.md                         +
docs/ARCHITECTURE.md                         ~
README.md                                    ~
```

Les services, schémas Prisma, routes API, dépendances et fichiers de verrouillage restent inchangés. Le client Prisma et les types Next.js peuvent être régénérés par les commandes de validation.
