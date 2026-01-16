# Déployer sur GitHub Pages

Votre projet est maintenant configuré pour être déployé automatiquement sur GitHub Pages !

## Étape 1 : Créer le dépôt sur GitHub

1.  Rendez-vous sur [github.com/new](https://github.com/new).
2.  Nommez votre dépôt (ex: `music-quiz`).
3.  Laissez-le **Public** (recommandé pour la gratuité simple) ou Privé.
4.  **Ne cochez pas** "Add a README file" ou .gitignore (votre projet les a déjà).
5.  Cliquez sur **Create repository**.

## Étape 2 : Envoyer votre code

Ouvrez un terminal dans le dossier `square-savior` et lancez ces commandes (en remplaçant l'URL par la vôtre) :

```bash
git add .
git commit -m "Configuration déploiement"
git branch -M main
git remote add origin https://github.com/VOTRE_PSEUDO/NOM_DU_DEPOT.git
git push -u origin main
```

## Étape 3 : Activer GitHub Pages

1.  Allez dans les **Settings** de votre dépôt sur GitHub.
2.  Dans le menu de gauche, cliquez sur **Pages**.
3.  Sous **Build and deployment** > **Source**, choisissez **GitHub Actions**.
4.  C'est tout ! GitHub va lancer le workflow automatiquement.

## Étape 4 : Vérifier

1.  Allez dans l'onglet **Actions** de votre dépôt pour voir le déploiement en cours.
2.  Une fois terminé (point vert), retournez dans **Settings > Pages**.
3.  Vous verrez l'URL de votre site en haut (ex: `https://votre-pseudo.github.io/music-quiz/`).

## Dépannage
Si vous voyez une erreur **"Get Pages site failed"** ou **"Not Found"** dans l'onglet Actions :
1.  Retournez dans **Settings > Pages**.
2.  Vérifiez absolument que **Source** est réglé sur **GitHub Actions** (et non "Deploy from a branch").
3.  Si ce n'était pas le cas, changez-le.
4.  Retournez dans **Actions**, cliquez sur l'échec, puis sur le bouton **Re-run jobs** en haut à droite.
