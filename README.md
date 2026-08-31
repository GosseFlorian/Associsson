# Associsson

[![CI](https://github.com/GosseFlorian/Associsson/actions/workflows/ci.yml/badge.svg)](https://github.com/GosseFlorian/Associsson/actions/workflows/ci.yml)

Application web qui permet aux associations d'avoir une plateforme de gestion de projets et de suivi de tâches.

## Sommaire

- [Démarrage rapide](#démarrage-rapide)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Utilisation](#utilisation)
- [Comptes de test (dev)](#comptes-de-test-dev)
- [Tests](#tests)
- [Documentation](#documentation)
- [Auteur](#auteur)

## Démarrage rapide

Parcours complet pour partir de zéro et avoir l'application qui tourne en local :

```bash
# 1. Cloner et installer
git clone https://github.com/GosseFlorian/Associsson
cd Associsson
cd backend && npm install
cd ../frontend && npm install

# 2. Configurer l'environnement backend
cd ../backend
cp .env.example .env
# → éditer .env (PostgreSQL + JWT_SECRET)

# 3. Créer la base et initialiser les données
createdb associsson          # adapter si PGDATABASE diffère dans .env
npm run db:migrate:up
npm run db:seed:up

# 4. Lancer les deux serveurs (deux terminaux)
npm run dev                  # terminal 1 — backend → http://localhost:3000
cd ../frontend && npm run dev  # terminal 2 — frontend → http://localhost:5173

# 5. Vérifier
curl http://localhost:3000/health
# → 200 { "status": "ok", "db": "connected", "dbLatencyMs": … }
```

Ouvrir [http://localhost:5173](http://localhost:5173) et se connecter avec un [compte de test](#comptes-de-test-dev).

> Le détail de chaque étape se trouve dans les sections ci-dessous.

## Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) version **24** recommandée (minimum 18) — nécessaire pour le frontend **et** le backend
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
cp .env.example .env
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

Une fois PostgreSQL installé et le fichier `backend/.env` renseigné, tout se pilote depuis `backend/` via des scripts npm qui exécutent les fichiers `.sql` situés dans `backend/src/config/` à travers le pool de connexion `pg` (`backend/src/config/client.ts`).

```bash
cd backend
```

1. **Créer la base PostgreSQL** (une seule fois) :

   ```bash
   createdb associsson
   ```

   > Le nom doit correspondre à `PGDATABASE` dans ton `.env`.

2. **Créer les tables** (migration) :

   ```bash
   npm run db:migrate:up
   ```

3. **Injecter un jeu de données de test** (seed) :

   ```bash
   npm run db:seed:up
   ```

Ordre typique pour partir d'une base vide et prête à l'emploi :

```bash
createdb associsson
npm run db:migrate:up
npm run db:seed:up
```

**Autres commandes utiles :**

- Supprimer les tables (rollback complet) : `npm run db:migrate:down`
- Vider le jeu de données de test : `npm run db:seed:down`

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

**Vérifier que tout fonctionne :**

```bash
curl http://localhost:3000/health
```

Réponse attendue :

```json
{ "status": "ok", "db": "connected", "dbLatencyMs": 4 }
```

Puis ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

## Comptes de test (dev)

Après `npm run db:seed:up`, des utilisateurs fictifs sont disponibles pour se connecter **en développement uniquement** :

| Email | Mot de passe |
|-------|--------------|
| `florian@gmail.com` | `Mot2passeFlori@n` |
| `benjamin@gmail.com` | `Mot2passeBenj@min` |
| `antoine@gmail.com` | `Mot2passe@ntoine` |

> ⚠️ Ces comptes ne doivent **jamais** être déployés en production. Liste complète dans `backend/src/config/seedUp.sql`.

## Tests

Le backend utilise Jest (`ts-jest`), avec les tests dans `backend/tests/` :

```bash
cd backend
npm test
```

Le frontend n'a pas encore de suite de tests configurée à ce jour.

## Documentation

La documentation est organisée selon le cadre [Diátaxis](https://diataxis.fr) — un document par besoin :

| Besoin | Document |
|--------|----------|
| Installer et démarrer (ce fichier) | [README.md](./README.md) |
| Faire tourner le service, vérifier, relancer | [docs/exploitation.md](./docs/exploitation.md) |
| Procédures d'incident (runbook) | [docs/runbook.md](./docs/runbook.md) |
| Référence des endpoints API | [docs/api.md](./docs/api.md) |
| Architecture et choix techniques | [docs/architecture.md](./docs/architecture.md) |
| Décisions d'architecture (ADR) | [docs/adr/](./docs/adr/) |

Index complet : [docs/README.md](./docs/README.md)

Autres documents : [cadrage](./docs/cadrage.md) · [backlog](./docs/backlog.md) · [modèle de données](./docs/erd.md) · [contribution](./docs/CONTRIBUTING.md)

## Auteur

Florian Gosse — [profil GitHub](https://github.com/GosseFlorian)<br>
Benjamin Correa — [profil GitHub](https://github.com/ben-25)<br>
Antoine Lau — [profil GitHub](https://github.com/antoineLAU)<br>
Fofana Hawa Rachida — [profil GitHub](https://github.com/fofanahawarachida)
