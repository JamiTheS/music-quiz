# Comment ajouter des musiques ?

Le jeu charge automatiquement tous les fichiers `.json` présents dans le dossier `src/data`.

## Étape 1 : Créer un fichier de données

1.  Allez dans le dossier `src/data` de votre projet (`square-savior/src/data`).
2.  Copiez le fichier `template_songs.json` ou créez un nouveau fichier (ex: `mes_chansons.json`).

## Étape 2 : Remplir les informations

Ouvrez votre fichier et ajoutez vos musiques en respectant ce format :

```json
[
    {
        "title": "Titre de la chanson",
        "artist": "Nom de l'artiste",
        "year": 2024,
        "youtubeId": "VIDEO_ID",
        "startTime": 30
    }
]
```

### Détails des champs :
*   `title` : Le titre exact de la chanson (affiché aux joueurs).
*   `artist` : Le nom de l'artiste.
*   `year` : L'année de sortie (utilisé pour les catégories/indices).
*   `youtubeId` : L'identifiant unique de la vidéo YouTube.
    *   *Exemple* : Pour `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, l'ID est `dQw4w9WgXcQ`.
*   `startTime` : (Optionnel) Seconde à laquelle commence l'extrait (pour éviter les intros longues). Mettez `0` par défaut.

## Étape 3 : C'est tout !
Sauvegardez le fichier. Le jeu détectera automatiquement les nouvelles musiques au prochain redémarrage ou rafraîchissement de la page.
