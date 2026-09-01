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

**Routes publiques** (pas de JWT) : `GET /health`, `POST /utilisateur`, `POST /utilisateur/connexion`.

Toutes les autres routes exigent un JWT valide (`requireAuth`). Un token manquant ou invalide répond **401**. Un accès à une ressource d'un autre compte ou d'une autre organisation répond **403** (IDOR).

---

## Codes HTTP communs

| Code | Signification |
|------|---------------|
| 200 | Succès (lecture, mise à jour, suppression logique) |
| 201 | Ressource créée |
| 400 | Paramètres ou corps invalides |
| 401 | Token manquant, invalide, ou identifiants incorrects |
| 403 | Accès refusé (ressource d'un autre utilisateur / rôle insuffisant) |
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

Liste tous les utilisateurs (annuaire, sans mot de passe). **JWT requis.**

**Réponses :** 200 → tableau d'utilisateurs (sans mot de passe).

### `GET /utilisateur/:id`

**Authentification :** JWT. L'id doit être celui du compte authentifié.

**Paramètres :** `id` (entier > 0)

**Réponses :** 200 | 400 | 403 | 404 | 500

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

**Authentification :** JWT. Un utilisateur ne peut modifier que son propre compte.

**Corps :** champs partiels (`nom`, `email`, `mot_de_passe`)

**Réponses :** 200 | 400 | 403 | 404 | 500

### `DELETE /utilisateur/:id`

**Authentification :** JWT. Un utilisateur ne peut supprimer que son propre compte.

**Réponses :** 200 | 400 | 403 | 404 | 500

---

## Organisation

Préfixe : `/organisation` — **JWT requis**

| Méthode | Route | Droits |
|---------|-------|--------|
| GET | `/organisation` | Membres : organisations auxquelles on appartient |
| GET | `/organisation/:id` | Membre de l'organisation |
| POST | `/organisation` | Tout utilisateur authentifié (`proprietaire_id` = JWT) |
| PUT | `/organisation/:id` | Admin de l'organisation |
| DELETE | `/organisation/:id` | Propriétaire |

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

Préfixe : `/membre` — **JWT requis**

| Méthode | Route | Droits |
|---------|-------|--------|
| GET | `/membre` | Membres des organisations auxquelles on appartient |
| GET | `/membre/:id` | Membre de la même organisation |
| POST | `/membre` | Admin ou propriétaire de l'organisation |
| PUT | `/membre/:id` | Admin ou propriétaire (rôle uniquement) |
| DELETE | `/membre/:id` | Admin ou propriétaire |

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

Préfixe : `/projet` — **JWT requis**

| Méthode | Route | Droits |
|---------|-------|--------|
| GET | `/projet` | Membres : projets des organisations auxquelles on appartient |
| GET | `/projet/:id` | Membre de l'organisation |
| POST | `/projet` | Admin (`createur_id` = membre authentifié) |
| PUT | `/projet/:id` | Admin |
| DELETE | `/projet/:id` | Admin |

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

Préfixe : `/tache` — **JWT requis**

| Méthode | Route | Auth | Droits |
|---------|-------|------|--------|
| GET | `/tache` | Oui | Membres : tâches des organisations auxquelles on appartient |
| GET | `/tache/:id` | Oui | Membre de l'organisation du projet |
| POST | `/tache` | Oui | Admin ou bénévole (`createur_id` = membre authentifié) |
| PUT | `/tache/:id` | Oui | Admin ou bénévole |
| DELETE | `/tache/:id` | Oui | Admin ou bénévole |

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
  -d '{"projet_id":1,"titre":"Ma tâche","statut":"a_assigne","priorite":"moyenne"}'

# Lister les projets (avec token)
curl -s http://localhost:3000/projet \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## Liens

- [Exploitation](./exploitation.md)
- [Runbook](./runbook.md)
- [Architecture](./architecture.md)
- [Modèle de données (ERD)](./erd.md)
