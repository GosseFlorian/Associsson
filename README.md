# Associsson

Application web qui permet aux associations d'avoir une plateforme de gestion de projets et de suivi de tâches.

## Sommaire

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Auteur](#auteur)

## Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) version 18 ou supérieure (nécessaire pour le frontend **et** le backend)
- [PostgreSQL](https://www.postgresql.org/) version 14 ou supérieure
- npm (installé automatiquement avec Node.js)

## Installation

Le projet est composé de **deux applications distinctes** (`frontend/` et `backend/`), chacune avec son propre `package.json`. Il n'y a pas de `package.json` à la racine.

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/GosseFlorian/Associsson
   cd Associsson
   ```

2. Installer les dépendances du backend :

   ```bash
   cd backend
   npm install
   ```

3. Installer les dépendances du frontend :

   ```bash
   cd ../frontend
   npm install
   ```

## Variables d'environnement

Le fichier d'environnement se trouve **côté backend uniquement** (`backend/.env`) :

```bash
cd backend
cp .env.exemple .env
```

> ⚠️ Le fichier `.env` contient des informations sensibles : il ne doit **jamais** être versionné avec Git. Il est déjà listé dans le `.gitignore`. On documente ici le **nom** et le **rôle** des variables, jamais leurs valeurs réelles.

| Variable     | Description                                                 | Obligatoire | Exemple                          |
| ------------ | ----------------------------------------------------------- | ----------- | -------------------------------- |
| `PORT`       | Port d'écoute du serveur Express                            | Non (3000)  | `3000`                           |
| `PGHOST`     | Hôte du serveur PostgreSQL                                  | Oui         | `localhost`                      |
| `PGPORT`     | Port du serveur PostgreSQL                                  | Oui         | `5432`                           |
| `PGUSER`     | Utilisateur PostgreSQL                                      | Oui         | `postgres`                       |
| `PGPASSWORD` | Mot de passe PostgreSQL                                     | Oui         | `motdepasse`                     |
| `PGDATABASE` | Nom de la base de données                                   | Oui         | `associsson`                     |
| `JWT_SECRET` | Clé secrète utilisée pour signer les JWT (authentification) | Oui         | `une_chaine_longue_et_aleatoire` |

Le frontend n'a pas de fichier `.env` pour l'instant (pas d'appel API configuré via variable d'environnement à ce jour).

## Base de données

Une fois PostgreSQL installé et le fichier `backend/.env` renseigné (avec une base déjà créée, ex. `createdb associsson`), tout se pilote depuis `backend/` via des scripts npm qui exécutent les fichiers `.sql` situés dans `backend/src/config/` (`migrationUp.sql`, `migrationDown.sql`, `seedUp.sql`, `seedDown.sql`) à travers le pool de connexion `pg` (`backend/src/config/client.ts`).

```bash
cd backend
```

- Créer les tables (migration) :

  ```bash
  npm run db:migrate:up
  ```

- Supprimer les tables (rollback complet) :

  ```bash
  npm run db:migrate:down
  ```

- Injecter un jeu de données de test (seed) :

  ```bash
  npm run db:seed:up
  ```

- Vider le jeu de données de test :

  ```bash
  npm run db:seed:down
  ```

Ordre typique pour partir d'une base vide et prête à l'emploi :

```bash
npm run db:migrate:up
npm run db:seed:up
```

> Ces scripts npm exécutent respectivement `backend/src/config/migrationUp.ts`, `migrationDown.ts`, `seedUp.ts` et `seedDown.ts`, qui lisent chacun le fichier `.sql` correspondant et l'envoient à la base via `pool.query`.

## Utilisation

Lancer le backend en mode développement (`http://localhost:3000` par défaut) :

```bash
cd backend
npm run dev
```

Lancer le frontend en mode développement, dans un second terminal (`http://localhost:5173` par défaut, port par défaut de Vite) :

```bash
cd frontend
npm run dev
```

## Tests

Le backend utilise Jest (`ts-jest`), avec les tests dans `backend/tests/` :

```bash
cd backend
npm test
```

Le frontend n'a pas encore de suite de tests configurée à ce jour

## Technologies utilisées

- **Front-end** : React 19, TypeScript, Vite, React Router, Zustand (état global)
- **Back-end** : Node.js, Express 5, TypeScript, driver `pg`, `bcryptjs` (hash de mots de passe), `jsonwebtoken` (authentification JWT)
- **Base de données** : PostgreSQL
- **Tests** : Jest / ts-jest (backend)

## Structure du projet

```
associsson/
├── frontend/                          # Application web (React + TypeScript, Vite)
│   ├── public/                        # Assets statiques servis tels quels (favicon, images...)
│   ├── src/
│   │   ├── components/                # Composants UI réutilisables (boutons, cartes, formulaires...)
│   │   ├── pages/                     # Écrans / routes de l'application
│   │   ├── stores/                    # État global partagé entre composants (Zustand)
│   │   ├── lib/                       # Fonctions utilitaires côté front
│   │   ├── style/                     # Styles partagés
│   │   ├── types/                     # Interfaces et types TypeScript partagés côté front
│   │   ├── App.tsx                    # Composant racine, monte le routeur et les providers
│   │   ├── main.tsx                   # Point d'entrée, injecte App dans le DOM
│   │   └── index.css / App.css
│   ├── index.html                     # Page HTML unique (SPA), point d'ancrage de Vite
│   ├── vite.config.ts
│   ├── eslint.config.js
│   ├── tsconfig.json / .app.json / .node.json
│   └── package.json
│
├── backend/                           # API REST (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/                    # Déclare les endpoints HTTP et les relie aux controllers
│   │   ├── controllers/               # Reçoit la requête HTTP, valide les paramètres, formate la réponse
│   │   ├── services/                  # Logique métier (règles, validations, orchestration)
│   │   ├── repositories/              # Accès direct à PostgreSQL (requêtes SQL brutes via pg)
│   │   ├── middlewares/               # Middlewares Express (ex. requireAuth pour les routes protégées)
│   │   ├── config/                    # Connexion DB (client.ts), scripts de migration et de seed
│   │   │   ├── client.ts              # Pool de connexion PostgreSQL (pg)
│   │   │   ├── migrationUp.ts / .sql  # Création des tables
│   │   │   ├── migrationDown.ts / .sql# Suppression des tables
│   │   │   ├── seedUp.ts / .sql       # Injection d'un jeu de données de test
│   │   │   └── seedDown.ts / .sql     # Suppression du jeu de données de test
│   │   ├── types.ts                   # Interfaces TypeScript partagées côté back
│   │   └── app.ts                     # Point d'entrée : instancie Express, branche les routes, lance le serveur
│   ├── tests/                         # Tests unitaires (Jest), un fichier par couche et par entité
│   ├── jest.config.js
│   ├── tsconfig.json
│   ├── .env / .env.exemple            # Variables d'environnement (jamais commit le .env réel)
│   └── package.json
│
├── docs/                              # Documentation projet
│   ├── adr/                           # Décisions d'architecture (ADR)
│   ├── backlog.md                     # Backlog produit (user stories, état d'avancement)
│   ├── cadrage.md                     # Objectifs, périmètre, rôles de l'équipe
│   ├── erd.md                         # Modèle de données (diagramme entité-relation)
│   └── CONTRIBUTING.md                # Guide de contribution
│
├── .github/
│   └── CODEOWNERS
├── .gitignore
└── README.md                          # Ce fichier
```

## Auteur

Florian Gosse — [profil GitHub](https://github.com/GosseFlorian)<br>
Benjamin Correa — [profil GitHub](https://github.com/ben-25)<br>
Antoine Lau — [profil GitHub](https://github.com/antoineLAU)<br>
Fofana Hawa Rachida — [profil GitHub](https://github.com/fofanahawarachida)
