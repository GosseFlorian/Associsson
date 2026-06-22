# Guide de contribution

Merci de votre intérêt pour ce projet !

Ce document explique comment contribuer au projet, signaler des problèmes, proposer des améliorations et soumettre du code.

---

## Sommaire

- [Signaler un bug](#signaler-un-bug)
- [Proposer une fonctionnalité](#proposer-une-fonctionnalité)
- [Préparer son environnement](#préparer-son-environnement)
- [Organisation des branches](#organisation-des-branches)
- [Conventions de code](#conventions-de-code)
- [Conventions de commits](#conventions-de-commits)
- [Processus de Pull Request](#processus-de-pull-request)
- [Revue et validation](#revue-et-validation)
- [Règles de fusion](#règles-de-fusion)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Signaler un bug

Avant de créer une issue, vérifiez qu'un signalement similaire n'existe pas déjà.

Lors de la création d'une issue, indiquez :

- Un titre clair et descriptif.
- Une description du problème rencontré.
- Les étapes permettant de reproduire le bug.
- Le comportement attendu.
- Le comportement observé.
- Des captures d'écran si nécessaire.

### Exemple

**Titre :**

```text
Impossible de publier un trajet sans photo
```

**Description :**

```text
Étapes pour reproduire :

1. Se connecter.
2. Ouvrir la page de publication.
3. Remplir le formulaire sans ajouter de photo.
4. Cliquer sur "Publier".

Résultat attendu :
Le trajet est publié.

Résultat observé :
Une erreur apparaît.
```

---

## Proposer une fonctionnalité

Les suggestions d'amélioration sont les bienvenues.

Pour proposer une fonctionnalité, créez une issue contenant :

- Le besoin ou problème identifié.
- La solution proposée.
- Les éventuelles alternatives envisagées.
- Toute information complémentaire utile.

### Exemple

**Titre :**

```text
Ajouter un système de favoris
```

**Description :**

```text
Les utilisateurs pourraient enregistrer leurs trajets favoris afin de les retrouver plus rapidement.
```

---

## Préparer son environnement

### Cloner le dépôt

```bash
git clone <url-du-depot>
cd <nom-du-projet>
```

### Récupérer les dernières modifications

```bash
git switch main
git pull origin main
```

---

## Organisation des branches

La branche principale du projet est :

- `main` : version stable du projet.

⚠️ La branche `main` est protégée.

- Il est impossible d'y développer directement.
- Toute modification doit être réalisée dans une branche dédiée.
- Toute modification doit être proposée via une Pull Request.

### Convention de nommage

Pour une fonctionnalité :

```text
feat/nom-fonctionnalite
```

Pour une correction :

```text
fix/nom-du-bug
```

### Exemples

```text
feat/publication-trajet
feat/gestion-utilisateurs
fix/correction-authentification
fix/erreur-formulaire
```

### Créer une branche

Depuis `main` :

```bash
git switch main
git pull origin main
git switch -c feat/publication-trajet
```

Vérifier sa branche actuelle :

```bash
git branch
```

---

## Conventions de code

Merci de respecter les conventions suivantes :

- Écrire un code clair et lisible.
- Utiliser des noms explicites.
- Éviter les abréviations ambiguës.
- Respecter le style déjà présent dans le projet.
- Supprimer le code inutilisé.
- Commenter uniquement lorsque cela apporte une réelle valeur.

---

## Conventions de commits

Les messages de commit doivent être :

- Courts.
- Explicites.
- Rédigés au présent.
- Décrire précisément la modification réalisée.

### Exemples de bons commits

```text
ajoute le formulaire de publication de trajet
corrige la validation des emails
ameliore l affichage des reservations
supprime le code inutilise
```

### Exemples à éviter

```text
update
modifications
fix
travail du jour
```

---

## Processus de Pull Request

Une fois votre travail terminé :

### 1. Vérifier les modifications

```bash
git status
```

### 2. Envoyer la branche sur GitHub

```bash
git push origin feat/publication-trajet
```

### 3. Créer une Pull Request

Depuis GitHub :

1. Ouvrir le dépôt.
2. Cliquer sur **Compare & pull request**.
3. Vérifier que la branche cible est `main`.
4. Ajouter un titre clair.
5. Décrire les modifications réalisées.
6. Soumettre la Pull Request.

### Exemple de titre

```text
Ajout du formulaire de publication de trajet
```

### Exemple de description

```text
Cette Pull Request ajoute :

- le formulaire de publication de trajet ;
- la validation des champs ;
- l'affichage des erreurs.

Issue liée : #12
```

---

## Revue et validation

Une Pull Request ne peut pas être fusionnée directement par son auteur.

Après sa création :

1. Un ou plusieurs membres du projet examinent les modifications.
2. Des changements peuvent être demandés.
3. Une fois approuvée, la Pull Request pourra être fusionnée par une personne autorisée.

### Modifier une Pull Request après création

Si des corrections sont demandées :

```bash
git add .
git commit -m "corrige les remarques de revue"
git push
```

Les nouveaux commits apparaîtront automatiquement dans la Pull Request existante.

---

## Règles de fusion

La branche `main` est protégée :

- Les développements ne doivent jamais être réalisés directement sur `main`.
- Toute modification doit passer par une Pull Request.
- Une Pull Request doit être relue et validée avant sa fusion.
- La fusion est réalisée uniquement par les personnes autorisées.

---

## Bonnes pratiques

### À faire

- Créer une branche par fonctionnalité ou correction.
- Réaliser des commits fréquents et cohérents.
- Tester ses modifications avant de les envoyer.
- Relire son code avant de créer une Pull Request.
- Créer de petites Pull Requests faciles à relire.
- Décrire clairement ses issues et Pull Requests.

### À éviter

- Développer directement sur `main`.
- Mélanger plusieurs fonctionnalités dans une même Pull Request.
- Créer des commits avec des messages vagues.
- Soumettre du code non testé.
- Ignorer les remarques faites lors de la revue de code.

---

Merci pour votre contribution !
