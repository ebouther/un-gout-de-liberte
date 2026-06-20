# Configuration pour la production (Vercel)

## Variables d'environnement requises

Pour que le système de blog fonctionne en production sur Vercel, vous devez configurer ces variables d'environnement :

### Variables existantes
```
STRIPE_PK=pk_live_...
STRIPE_SK=sk_live_...
ADMIN_PASSWORD=votre_mot_de_passe_admin
JWT_SECRET=votre_secret_jwt_très_long_et_sécurisé
```

### Nouvelles variables pour GitHub (OBLIGATOIRES en production)
```
GITHUB_TOKEN=ghp_votre_token_github
GITHUB_REPO=ebouther/un-gout-de-liberte
```

## Configuration du token GitHub

### 1. Créer un Personal Access Token GitHub

1. Allez sur https://github.com/settings/tokens
2. Cliquez sur "Generate new token (classic)"
3. Donnez un nom au token : "Vercel Blog Articles"
4. Sélectionnez les permissions :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `contents:write` (Write access to repository contents)
5. Cliquez sur "Generate token"
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après)

### 2. Configurer sur Vercel

1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez :
   - **Name**: `GITHUB_TOKEN`
   - **Value**: `ghp_votre_token_copié`
   - **Environments**: Production, Preview, Development

4. Ajoutez aussi :
   - **Name**: `GITHUB_REPO` 
   - **Value**: `ebouther/un-gout-de-liberte`
   - **Environments**: Production, Preview, Development

## Comment ça fonctionne

### En développement (local)
- Les articles sont sauvegardés directement dans le dossier `content/articles/`
- Vous pouvez les commiter manuellement avec git

### En production (Vercel)
- Les articles sont créés directement sur GitHub via l'API
- Chaque nouvel article fait un commit automatique
- Vercel redéploie automatiquement le site
- Les articles sont immédiatement visibles

## Workflow de déploiement

1. **Développement local** → Articles sauvés localement
2. **Commit & Push** → Code envoyé sur GitHub
3. **Vercel déploie** → Site mis à jour
4. **Création d'articles en prod** → GitHub API → Nouveau commit → Redéploiement automatique

## Conventions de commit

Les commits automatiques d'articles suivent la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `content(blog): add new article "slug-article"` - Nouvel article
- `content(blog): update article "slug-article"` - Modification d'article  
- `content(blog): remove article "slug-article"` - Suppression d'article
- `content(blog): rename article "ancien" to "nouveau"` - Changement de slug

## Sécurité

- Le token GitHub a accès uniquement à ce repository
- Les permissions sont limitées au strict nécessaire
- L'authentification admin est requise pour toute modification

## Dépannage

### Erreur "Configuration GitHub manquante"
- Vérifiez que `GITHUB_TOKEN` est configuré sur Vercel
- Vérifiez que `GITHUB_REPO` est correct

### Erreur "Unauthorized" avec GitHub
- Le token a peut-être expiré
- Vérifiez les permissions du token
- Régénérez un nouveau token si nécessaire

### Articles non visibles après création
- Vercel met ~30 secondes à redéployer
- Vérifiez que le commit apparaît sur GitHub
- Le cache peut prendre quelques minutes à se rafraîchir

## Migration des articles existants

Si vous avez des articles locaux à migrer :

```bash
# 1. Commiter tous les articles locaux
git add content/articles/
git commit -m "Migrer articles existants"
git push origin develop

# 2. Vercel redéploiera automatiquement avec tous les articles
```

## Test en local

Pour tester le système GitHub en local :

```bash
# Ajouter les variables dans .env.local
GITHUB_TOKEN=your_token
GITHUB_REPO=ebouther/un-gout-de-liberte
NODE_ENV=production

# Redémarrer le serveur
npm run dev
```
