# SKS Business Platform — MNH Technologie

- Monolithe Next.js App Router, TypeScript strict. Pas de serveur séparé.
- Français par défaut ; préparer fr/ar/en, RTL arabe, MAD, Africa/Casablanca.
- Aucun client, résultat commercial ou projet réel inventé. Toutes les fixtures sont explicitement de démonstration.
- Ne jamais publier, connecter des comptes réels ou utiliser des secrets sans autorisation explicite.
- Ne jamais committer .env, identifiants, données personnelles ou sorties de base.
- UI dans src/components et src/features ; services et accès Prisma exclusivement dans src/server.
- Toute lecture privée et mutation vérifie la session et le rôle côté serveur. L'accès client est filtré par userId/customerId issu de la session, jamais accepté du navigateur.
- Valider les entrées Zod, transactions pour écritures critiques, audit atomique et montants Decimal. Pas de any ni @ts-ignore.
- Aucun bouton ne doit laisser croire qu'une fonction absente est opérationnelle.
- Préférer les changements limités ; conserver le code existant.
- Avant livraison : npm run db:validate, typecheck, lint, test, build ; Playwright si navigateur disponible. Rapporter les limites réellement constatées.
- Le seed exige ALLOW_DEMO_SEED=true et refuse NODE_ENV=production. Ne crée aucun compte ni mot de passe par défaut.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
