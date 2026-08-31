# Référence API — Associsson

> **À qui :** développeuses qui intègrent le frontend, testent avec curl/Postman, ou consultent un format exact.  
> **Question :** « Quelle route, quel verbe, quel corps, quelle réponse ? »  
> **Ce n'est pas :** un tutoriel (voir [README racine](../README.md)) ni une explication de choix techniques (voir [architecture.md](./architecture.md)).

**Base URL (dev) :** `http://localhost:3000`  
**Format :** JSON (`Content-Type: application/json`)

---

## Authentification

La connexion renvoie un **JWT**. Pour les routes protégées, envoyer :

```http
Authorization: Bearer <token>
```

| Route protégée | Middleware |
|----------------|------------|
| `POST /tache` | `requireAuth` |

> La plupart des routes ne sont pas encore protégées — voir [architecture.md § Sécurité](./architecture.md#sécurité).

---

## Codes HTTP communs

| Code | Signification |
|------|---------------|
| 200 | Succès (lecture, mise à jour, suppression logique) |
| 201 | Ressource créée |
| 400 | Paramètres ou corps invalides |
| 401 | Token manquant, invalide, ou identifiants incorrects |
| 404 | Ressource introuvable |
| 500 | Erreur interne serveur |
| 503 | Service dégradé (health check uniquement) |

Corps d'erreur type : `{ "message": "…" }`

---

## Santé du service

### `GET /health`

Vérifie que le processus et PostgreSQL répondent.

**Authentification :** non

**Réponses**

| Code | Corps |
|------|-------|
| 200 | `{ "status": "ok", "db": "connected", "dbLatencyMs": 4 }` |
| 503 | `{ "status": "degraded", "db": "unreachable", "dbLatencyMs": … }` |
| 503 | `{ "status": "degraded", "db": "connected", "dbLatencyMs": 1500 }` _(latence > 1000 ms)_ |

---

## Utilisateur

Préfixe : `/utilisateur`

### `POST /utilisateur/connexion`

Authentifie un utilisateur.

**Corps**

```json
{
  "email": "string",
  "mot_de_passe": "string"
}
```

**Réponses**

| Code | Corps |
|------|-------|
| 200 | `{ "token": "…", "utilisateur": { "id", "nom", "email", "date_inscription" } }` |
| 400 | `{ "message": "Identifiants manquants" }` |
| 401 | `{ "message": "Identifiants invalides" }` |

> Rate limiting appliqué sur le préfixe `/login` dans `app.ts` — la route réelle est `/utilisateur/connexion`.

### `GET /utilisateur`

Liste tous les utilisateurs.

**Réponses :** 200 → tableau d'utilisateurs (sans mot de passe).

### `GET /utilisateur/:id`

**Paramètres :** `id` (entier > 0)

**Réponses :** 200 | 400 | 404 | 500

### `POST /utilisateur`

Crée un utilisateur.

**Corps**

```json
{
  "nom": "string",
  "email": "string",
  "mot_de_passe": "string"
}
```

**Réponses :** 201 | 400 | 500

### `PUT /utilisateur/:id`

**Corps :** champs partiels (`nom`, `email`, `mot_de_passe`)

**Réponses :** 200 | 400 | 404 | 500

### `DELETE /utilisateur/:id`

**Réponses :** 200 | 400 | 404 | 500

---

## Organisation

Préfixe : `/organisation`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/organisation` | Liste toutes les organisations |
| GET | `/organisation/:id` | Détail d'une organisation |
| POST | `/organisation` | Crée une organisation |
| PUT | `/organisation/:id` | Met à jour une organisation |
| DELETE | `/organisation/:id` | Supprime une organisation |

**Corps POST / PUT (exemple)**

```json
{
  "nom": "string",
  "est_actif": true,
  "proprietaire_id": 1
}
```

**Réponse GET (détail)** inclut `nomProprietaire`.

---

## Membre

Préfixe : `/membre`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/membre` | Liste tous les membres |
| GET | `/membre/:id` | Détail d'un membre |
| POST | `/membre` | Ajoute un membre à une organisation |
| PUT | `/membre/:id` | Met à jour le rôle |
| DELETE | `/membre/:id` | Supprime un membre |

**Corps POST (exemple)**

```json
{
  "organisation_id": 1,
  "utilisateur_id": 2,
  "role": "benevole"
}
```

**Rôles possibles :** `admin` | `benevole` | `licencie`

**Réponse GET (détail)** inclut `nomUtilisateur`, `nomOrganisation`.

---

## Projet

Préfixe : `/projet`

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/projet` | Liste tous les projets |
| GET | `/projet/:id` | Détail d'un projet |
| POST | `/projet` | Crée un projet |
| PUT | `/projet/:id` | Met à jour un projet |
| DELETE | `/projet/:id` | Supprime un projet |

**Corps POST (exemple)**

```json
{
  "organisation_id": 1,
  "createur_id": 1,
  "titre": "string",
  "description": "string",
  "date_debut": "2026-01-01T00:00:00.000Z",
  "date_fin": "2026-06-01T00:00:00.000Z",
  "adresse": "string",
  "est_termine": false,
  "nombre_place": 50
}
```

**Réponse GET (détail)** inclut `nomOrganisation`, `nomCreateur`, `nombreInscrit`.

---

## Tâche

Préfixe : `/tache`

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/tache` | Non | Liste toutes les tâches |
| GET | `/tache/:id` | Non | Détail d'une tâche |
| POST | `/tache` | **Oui** | Crée une tâche |
| PUT | `/tache/:id` | Non | Met à jour une tâche |
| DELETE | `/tache/:id` | Non | Supprime une tâche |

**Corps POST (exemple)**

```json
{
  "createur_id": 1,
  "projet_id": 1,
  "titre": "string",
  "description": "string",
  "statut": "a_assigne",
  "priorite": "moyenne",
  "date_echeance": "2026-03-01T00:00:00.000Z",
  "assigne_a": 2
}
```

**Statuts :** `a_assigne` | `en_cours` | `termine`  
**Priorités :** `faible` | `moyenne` | `haute` | `tres_haute`

**Réponse GET (détail)** inclut `nomProjet`, `nomAssigneA`, `nomCreateur`.

---

## Types partagés

Définis dans `backend/src/types/types.ts` :

| Type | Champs principaux |
|------|-------------------|
| `Utilisateur` | `id`, `nom`, `email`, `date_inscription` |
| `Organisation` | `id`, `nom`, `date_creation`, `est_actif`, `proprietaire_id` |
| `Membre` | `id`, `organisation_id`, `utilisateur_id`, `role` |
| `Projet` | `id`, `organisation_id`, `createur_id`, `titre`, `est_termine`, … |
| `Tache` | `id`, `projet_id`, `createur_id`, `titre`, `statut`, `priorite`, `assigne_a` |

Modèle relationnel complet : [erd.md](./erd.md)

---

## Exemples curl

```bash
# Health check
curl -s http://localhost:3000/health

# Connexion
curl -s -X POST http://localhost:3000/utilisateur/connexion \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","mot_de_passe":"secret"}'

# Créer une tâche (avec token)
curl -s -X POST http://localhost:3000/tache \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{"createur_id":1,"projet_id":1,"titre":"Ma tâche","statut":"a_assigne","priorite":"moyenne"}'

# Lister les projets
curl -s http://localhost:3000/projet
```

---

## Liens

- [Exploitation](./exploitation.md)
- [Runbook](./runbook.md)
- [Architecture](./architecture.md)
- [Modèle de données (ERD)](./erd.md)
