# Mise en route Supabase (10 minutes)

## 1. Créer le projet
1. Sur supabase.com → **New project** (région au choix, mot de passe de base de données à conserver).
2. **SQL Editor → New query** → coller tout le contenu de `supabase/schema.sql` → **Run**.
   Cela crée : les coordonnées, les actualités/projets, les visites, les règles de sécurité et le stockage des images.

## 2. Créer le compte administrateur
1. **Authentication → Users → Add user → Create new user** : e-mail + mot de passe, cocher *Auto Confirm User*.
2. **Authentication → Sign In / Providers** (ou Settings) : **désactiver « Allow new users to sign up »**.
   Tout compte connecté étant administrateur, personne d'autre ne doit pouvoir s'inscrire.

## 3. Relier le site
1. **Project Settings → API** : copier *Project URL* et la clé *anon public*.
2. Les coller dans `public/assets/config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Cette clé est publique par conception.
3. Déployer le site (Vercel). Le tableau de bord est sur **votre-domaine/admin**.

## Ce que fait l'administration
- **Visiteurs** : pages vues, visiteurs uniques, courbe par jour, pages, langues, appareils, sources (7/30/90 jours).
- **Actualités / Projets** : titre + texte en FR/EN/AR/ES (le français est obligatoire, les autres langues retombent sur le français), image **facultative**, publier/masquer, modifier, supprimer.
- **Coordonnées** : e-mail, WhatsApp, téléphones. Les changements s'appliquent sur tout le site (4 langues, en-tête, pied de page, boutons, formulaires).
