# Architecture — Associsson

> **À qui :** développeuses qui reprennent le projet, réviseuses, ou toute personne qui veut **comprendre pourquoi** c'est structuré ainsi.  
> **Question :** « Comment les pièces s'assemblent, et pourquoi ? »  
> **Ce n'est pas :** un guide d'installation (voir [README racine](../README.md)) ni une liste d'endpoints (voir [api.md](./api.md)).

Pour les décisions détaillées (PostgreSQL, Express, React, TypeScript), voir les [ADR](./adr/).

---

## Vue d'ensemble

Associsson est une **application web monorepo** composée de deux applications indépendantes :

```text
┌─────────────────┐         HTTP/JSON          ┌─────────────────┐
│    Frontend     │  ───────────────────────►  │     Backend     │
│  React + Vite   │         localhost:3000       │  Express + TS   │
│  localhost:5173 │                              │                 │
└─────────────────┘                              └────────┬────────┘
                                                          │ pg (Pool)
                                                          ▼
                                                 ┌─────────────────┐
                                                 │   PostgreSQL    │
                                                 └─────────────────┘
```

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | React 19, TypeScript, Vite, React Router, Zustand | Interface utilisateur (SPA) |
| Backend | Node.js, Express 5, TypeScript | API REST, authentification JWT |
| Base de données | PostgreSQL 14+ | Persistance (SQL brut, pas d'ORM) |
| Tests | Jest / ts-jest | Tests unitaires backend |

---

## Structure du dépôt

```text
associsson/
├── frontend/                          # Application web (React + TypeScript, Vite)
│   ├── public/                        # Assets statiques (favicon, images…)
│   ├── src/
│   │   ├── components/                # Composants UI réutilisables
│   │   ├── pages/                     # Écrans / routes de l'application
│   │   ├── stores/                    # État global (Zustand)
│   │   ├── lib/                       # Utilitaires (ex. apiFetch)
│   │   ├── style/                     # Styles partagés
│   │   ├── types/                     # Types TypeScript côté front
│   │   ├── App.tsx                    # Composant racine, routeur
│   │   └── main.tsx                   # Point d'entrée DOM
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                           # API REST (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── routes/                    # Déclare les endpoints HTTP
│   │   ├── controllers/               # Reçoit la requête, formate la réponse HTTP
│   │   ├── services/                  # Logique métier et validations
│   │   ├── repositories/              # Requêtes SQL brutes (pg)
│   │   ├── middlewares/               # requireAuth, etc.
│   │   ├── config/                    # Pool DB, migrations, seeds
│   │   ├── lib/                       # JWT, utilitaires
│   │   ├── types/                     # Interfaces TypeScript partagées
│   │   └── app.ts                     # Point d'entrée Express
│   ├── tests/                         # Tests unitaires Jest
│   └── package.json
│
├── docs/                              # Documentation (Diátaxis)
│   ├── adr/                           # Architecture Decision Records
│   ├── api.md                         # Référence endpoints
│   ├── architecture.md                # Ce fichier
│   ├── exploitation.md                # Mode d'emploi ops
│   ├── runbook.md                     # Procédures d'incident
│   ├── erd.md                         # Modèle de données
│   ├── cadrage.md                     # Périmètre produit
│   └── backlog.md                     # User stories
│
└── README.md                          # Tutoriel d'installation
```

Il n'y a **pas de `package.json` à la racine** : frontend et backend s'installent et se lancent séparément.

---

## Architecture backend (couches)

Le backend suit un pattern **routes → controllers → services → repositories** :

```text
Requête HTTP
    │
    ▼
 routes/          Déclare le verbe et le chemin, branche le controller
    │
    ▼
 controllers/     Valide les paramètres HTTP, choisit le code de réponse
    │
    ▼
 services/        Règles métier, validations, orchestration
    │
    ▼
 repositories/    SQL brut via pool pg
    │
    ▼
 PostgreSQL
```

**Exemple concret** — créer une tâche :

1. `POST /tache` → `tache.route.ts` → `postTacheController`
2. Le controller vérifie le corps, appelle `postTacheService`
3. Le service valide les champs obligatoires, appelle `postTacheRepository`
4. Le repository exécute `INSERT INTO tache …` via `pool.query`

Chaque couche a sa responsabilité. Les tests unitaires couvrent controllers, services et repositories séparément (`backend/tests/`).

---

## Modèle de données

Cinq entités principales, liées entre elles :

```text
Utilisateur ──► Organisation (propriétaire)
     │                │
     └── Membre ◄─────┘
           │
           ├──► Projet (créateur)
           │        │
           │        └──► Tâche (assignée à un membre)
           │
           └──► InscriptionProjet
```

Diagramme complet : [erd.md](./erd.md)

| Entité | Rôle |
|--------|------|
| **Utilisateur** | Compte avec email/mot de passe (bcrypt) |
| **Organisation** | Association gérée par un propriétaire |
| **Membre** | Lien utilisateur ↔ organisation avec un rôle |
| **Projet** | Événement ou initiative d'une organisation |
| **Tâche** | Unité de travail dans un projet (statut, priorité, assignation) |

**Rôles membre :** `admin`, `benevole`, `licencie`

---

## Authentification et autorisation

### Authentification (AuthN)

- Login via `POST /utilisateur/connexion` (email + mot de passe).
- Mot de passe hashé avec **bcryptjs** en base.
- Succès → JWT signé avec `JWT_SECRET` (lib `jsonwebtoken`).
- Le frontend stocke le token (Zustand) et l'envoie en header `Authorization: Bearer …`.

### Autorisation (AuthZ)

- Middleware `requireAuth` vérifie la validité du JWT.
- Actuellement appliqué sur **`POST /tache`** uniquement.
- **Limitation connue :** la plupart des routes CRUD ne vérifient pas encore que l'utilisateur a le droit d'accéder à *cette* ressource (risque IDOR — voir OWASP A01). C'est une dette technique assumée en phase de formation.

---

## Sécurité

| Mesure | Implémentation |
|--------|----------------|
| En-têtes HTTP | `helmet` |
| CORS | Origine autorisée : `http://localhost:5173` |
| Rate limiting | 100 req / 15 min sur `/login` |
| Hash mots de passe | bcryptjs |
| JWT | Signature HMAC, vérification via `requireAuth` |
| Variables sensibles | `.env` (non versionné), validé par `dotenv-safe` |

Points **non encore traités** (dette documentée) :

- Autorisation fine par ressource / propriétaire (OWASP A01).
- Protection de toutes les routes mutantes par JWT.
- Retrait des comptes de démo en production (OWASP A05).

Les logs structurés (pino + pino-http) sont en place — voir [exploitation.md § Logs](./exploitation.md#logs).

---

## Migrations et seeds

Les scripts SQL vivent dans `backend/src/config/` :

| Script npm | Fichier TS | Fichier SQL | Action |
|------------|------------|-------------|--------|
| `db:migrate:up` | `migrationUp.ts` | `migrationUp.sql` | Crée les tables |
| `db:migrate:down` | `migrationDown.ts` | `migrationDown.sql` | Supprime les tables |
| `db:seed:up` | `seedUp.ts` | `seedUp.sql` | Injecte des données de test |
| `db:seed:down` | `seedDown.ts` | `seedDown.sql` | Vide les données de test |

Pas d'ORM : les repositories écrivent du SQL paramétré directement.

---

## Frontend

- **SPA** montée par Vite sur `index.html`.
- **Routing** via React Router (`App.tsx`).
- **État global** via Zustand (`stores/loginStore.ts` pour le token).
- **Appels API** via `lib/api.ts` (`apiFetch`) — base URL hardcodée `http://localhost:3000`.

---

## CI / qualité

GitHub Actions (`.github/workflows/ci.yml`) sur chaque push/PR vers `main` :

| Job | Actions |
|-----|---------|
| Backend | `npm ci`, lint, audit (high), tests Jest |
| Frontend | `npm ci`, lint, audit (high) |

---

## Décisions d'architecture (ADR)

| ADR | Sujet |
|-----|-------|
| [001](./adr/001-choix-base-de-donnees.md) | Choix PostgreSQL |
| [002](./adr/002-choix-stack-backend.md) | Choix Node.js / Express |
| [003](./adr/003-choix-front.md) | Choix React / Vite |
| [004](./adr/004-passage-de-javascript-a-typescript.md) | Migration TypeScript |

---

## Liens

- [Référence API](./api.md)
- [Exploitation](./exploitation.md)
- [Runbook](./runbook.md)
- [Modèle de données (ERD)](./erd.md)
- [Cadrage produit](./cadrage.md)
- [Installation (README racine)](../README.md)
