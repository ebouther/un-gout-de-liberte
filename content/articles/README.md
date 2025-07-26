# 📝 Structure du Blog - Dossier `content/articles`

## 📁 Organisation des fichiers

Tous les articles du blog sont stockés dans le dossier `content/articles/` au format Markdown (`.md`).

### 📄 Structure d'un article

Chaque article doit suivre cette structure avec le front matter YAML :

```markdown
---
title: "Titre de l'article"
description: "Description courte pour le SEO et les aperçus"
date: "2025-07-26"
category: "recettes|astuces|actualités"
status: "published|draft"
author: "Justine DUMESNIL"
image: "/chemin/vers/image.jpg"
slug: "slug-de-l-article"
---

# Contenu de l'article en Markdown

Votre contenu ici...
```

## 🏷️ Champs obligatoires

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `title` | String | Titre de l'article | "Comment réussir ses confitures" |
| `description` | String | Description SEO (150-160 chars) | "Découvrez tous nos secrets..." |
| `date` | String | Date au format ISO | "2025-07-26" |
| `category` | String | Catégorie de l'article | "recettes", "astuces", "actualités" |
| `status` | String | Statut de publication | "published" ou "draft" |
| `author` | String | Auteur de l'article | "Justine DUMESNIL" |
| `image` | String | Image de couverture | "/logo.png" |
| `slug` | String | Identifiant URL unique | "reussir-confitures-maison" |

## 🎯 Catégories disponibles

- **`recettes`** : Recettes et instructions de cuisine/pâtisserie
- **`astuces`** : Conseils et techniques professionnelles  
- **`actualités`** : Nouvelles de l'entreprise, événements, nouveautés

## 🔒 Gestion des permissions

### Articles publiés (`status: "published"`)
- ✅ Visibles sur `/blog` (liste publique)
- ✅ Accessibles via `/blog/[slug]` (page individuelle)
- ✅ Inclus dans l'API publique `/api/blog/articles`

### Articles brouillons (`status: "draft"`)
- ❌ **NON visibles** publiquement
- ✅ Visibles uniquement dans l'admin authentifié
- ✅ Accessibles via `/api/admin/blog/articles` (avec auth)

## 📂 Exemples de fichiers

### Article publié
```
content/articles/reussir-confitures-maison.md
```

### Article brouillon
```
content/articles/secrets-biscottes-brouillon.md
```

## 🚀 Publication d'un article

1. **Création** : Créer le fichier `.md` avec `status: "draft"`
2. **Rédaction** : Compléter le contenu en markdown
3. **Révision** : Vérifier dans l'interface admin
4. **Publication** : Changer `status: "published"`
5. **Déploiement** : Push vers GitHub pour mise en ligne

## ⚠️ Bonnes pratiques

- **Slug unique** : Chaque article doit avoir un slug différent
- **Images optimisées** : Utiliser des formats web (WebP, JPG optimisé)
- **Description SEO** : 150-160 caractères maximum
- **Markdown valide** : Tester le rendu avant publication
- **Dates cohérentes** : Format ISO YYYY-MM-DD

## 🔧 APIs associées

### APIs Publiques (sans authentification)
- `GET /api/blog/articles` - Liste des articles publiés
- `GET /api/blog/articles/[slug]` - Article individuel publié

### APIs Admin (authentification requise)
- `GET /api/admin/blog/articles` - Tous les articles
- `POST /api/admin/blog/articles` - Créer un article
- `PUT /api/admin/blog/articles/[slug]` - Modifier un article  
- `DELETE /api/admin/blog/articles/[slug]` - Supprimer un article

---

*Toutes les APIs utilisent exclusivement le dossier `content/articles/` via l'API GitHub pour la compatibilité Vercel.*
