# Associsson

Application web qui permet au association d'avoir une plateforme de gestion de projets et de suivi de taches.

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Utilisation](#utilisation)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Auteur](#auteur)

## Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [React](https://fr.react.dev/) Version 19 ou supérieure
- [Node.js](https://nodejs.org/) version 18 ou supérieure
- [PostgreSQL](https://www.postgresql.org/) version 14 ou supérieure
- npm (installé automatiquement avec Node.js)

## Installation

Ces étapes mettent le projet en route **en local**, pour le développement.

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/GosseFlorian/Associsson
   ```

## Variables d'environnement

Copier le fichier d'exemple, puis renseigner tes propres valeurs :

```bash
cp .env.example .env
```

> ⚠️ Le fichier `.env` contient des informations sensibles : il ne doit **jamais** être versionné avec Git. Il est déjà listé dans le `.gitignore`. On documente ici le **nom** et le **rôle** des variables, jamais leurs valeurs réelles.

| Variable       | Description                   | Obligatoire | Exemple                            |
| -------------- | ----------------------------- | ----------- | ---------------------------------- |
| `DATABASE_URL` | URL de connexion à PostgreSQL | Oui         | `postgres://localhost:5432/taches` |
| `PORT`         | Port d'écoute du serveur      | Non (3000)  | `8080`                             |

## Utilisation

Lancer l'application en mode développement :

```bash
npm start
```

L'application est ensuite accessible sur `http://localhost:3000`.

## Technologies utilisées

- **Front-end** : HTML, CSS, JavaScript
- **Back-end** : Node.js, Express
- **Base de données** : PostgreSQL

## Structure du projet

```
associsson/
├── associsson-frontend/
|   ├── src/
|       ├──
|   ├── index.html
├── backend/
|   ├── src/
|       ├──
├── .gitignore
├── .env.example    # Modèle de variables d'environnement
└── README.md       # Ce fichier
```

## Auteur

Florian Gosse — [profil GitHub](https://github.com/GosseFlorian)<br>
Benjamin <br>
Antoine LAU <br>
Rachida <br>
