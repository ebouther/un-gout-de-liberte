# 🚀 Déploiement Production avec Vercel et GitHub

## ✅ Système de gestion d'articles compatible Vercel

Le système a été conçu pour fonctionner parfaitement sur Vercel en utilisant l'API GitHub pour gérer les articles, évitant ainsi les limitations du système de fichiers en lecture seule de Vercel.

## 📋 Configuration requise

### 1. Token GitHub

Créez un Personal Access Token sur GitHub :

1. Allez sur https://github.com/settings/tokens
2. Cliquez "Generate new token" > "Generate new token (classic)"
3. Donnez un nom : "Blog Articles Management - Vercel"
4. Sélectionnez l'expiration (recommandé : 1 an)
5. Cochez les permissions :
   - `repo` (Full control of private repositories) OU `public_repo` (si repository public)
6. Cliquez "Generate token" et copiez-le

### 2. Variables d'environnement Vercel

Dans le dashboard Vercel de votre projet, ajoutez ces variables :

```
GITHUB_TOKEN=ghp_votre_token_github
GITHUB_REPO=ebouther/un-gout-de-liberte
STRIPE_SK=sk_live_votre_cle_stripe_production
STRIPE_PK=pk_live_votre_cle_stripe_production
ADMIN_PASSWORD=votre_mot_de_passe_admin_securise
JWT_SECRET=votre_secret_jwt_super_long_et_securise
HOST=https://votre-domaine.vercel.app
```

## 🔄 Comment ça fonctionne

### En développement (local)
- Les articles sont gérés via l'API GitHub
- Synchronisation automatique avec le repository
- Même comportement qu'en production

### En production (Vercel)
- Articles créés/modifiés via l'API GitHub
- Commits automatiques sur la branche `develop`
- Vercel redéploie automatiquement après chaque modification
- Système de fichiers en lecture seule contourné

## 📝 Workflow de publication

1. **Créer un article** dans l'admin `/admin`
2. **API crée le fichier** sur GitHub automatiquement
3. **Vercel détecte le changement** et redéploie
4. **Article disponible** sur le site en ~2 minutes

## ⚡ Avantages de ce système

- ✅ **Compatible Vercel** : Pas d'écriture locale de fichiers
- ✅ **Synchronisation automatique** : Tous les articles sont sur GitHub
- ✅ **Versioning** : Historique complet des modifications
- ✅ **Collaboration** : Plusieurs personnes peuvent modifier
- ✅ **Backup automatique** : GitHub est votre sauvegarde
- ✅ **Déploiement automatique** : Vercel redéploie à chaque modification

## 🔐 Sécurité

- Token GitHub avec permissions minimales (seulement `repo`)
- Authentification JWT pour l'admin
- Variables d'environnement sécurisées sur Vercel
- Branch protection possible sur `main`

## 📁 Structure des commits

Les commits automatiques suivent la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `content(blog): add new article "slug-article"`
- `content(blog): update article "slug-article"`
- `content(blog): remove article "slug-article"`
- `content(blog): rename article "ancien-slug" to "nouveau-slug"`

## 🐛 Dépannage

### "Configuration GitHub manquante"
- Vérifiez que `GITHUB_TOKEN` et `GITHUB_REPO` sont configurés dans Vercel
- Le token doit avoir les permissions `repo`

### "Article non trouvé" lors de la modification
- L'article existe dans le CMS mais pas sur GitHub
- Créez-le d'abord via l'interface admin

### Vercel ne redéploie pas
- Vérifiez que le webhook GitHub → Vercel fonctionne
- Regardez les logs de déploiement Vercel

## 🚀 Déploiement

1. **Pushez le code** sur GitHub
2. **Connectez le repository** à Vercel
3. **Configurez les variables** d'environnement
4. **Déployez** !

Le système est maintenant prêt pour la production ! 🎉
