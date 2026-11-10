# Protection de la connexion — Cloudflare Turnstile

1. Dans Cloudflare, ouvrez Turnstile et créez un widget en mode Managed.
2. Autorisez `www.sks-projets.ma`, `sks-projets.ma` et `sksprojet.vercel.app` si cette adresse reste utilisée. Chaque domaine de preview utilisé doit aussi être autorisé explicitement.
3. Dans Vercel → Settings → Environment Variables, ajoutez `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Site key) et `TURNSTILE_SECRET_KEY` (Secret key) pour les environnements concernés.
4. Redéployez : la clé publique est intégrée au build. Ne placez jamais la clé secrète dans le dashboard de contenu ni dans Git.
5. Vérifiez la connexion sur le domaine autorisé. Après un échec de connexion, le widget génère un nouveau jeton.

Sans les deux clés, la protection reste désactivée. Une configuration partielle bloque la connexion et le contrôle de production. Avec les clés, l’API refuse un jeton absent, expiré, refusé, provenant d’un autre domaine ou d’une autre action. Une indisponibilité Cloudflare refuse la tentative. La limitation des tentatives et les contrôles d’origine existants sont conservés.

Documentation : https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
