# Runbook — Associsson

> **À qui :** astreinte, ops, ou toute personne sous pression qui doit **agir sans improviser**.  
> **Question :** « Symptôme X visible — que faire, dans quel ordre ? »  
> **Ce n'est pas :** une explication d'architecture (voir [architecture.md](./architecture.md)) ni un guide d'installation (voir [README racine](../README.md)).

> Un runbook non testé ne vaut rien. Jouez ces procédures au moins une fois en local avant de vous y fier.

---

## Contacts et escalade

| Rôle | Personne |
|------|----------|
| Référent projet | Florian Gosse |
| Back-end | Benjamin Correa |
| Front-end | Rachida Fofana |

---

## 1. Le service ne répond plus (site / API down)

### Symptômes

- Le frontend affiche une erreur réseau.
- `curl http://localhost:3000/health` ne répond pas ou timeout.
- Aucun log récent dans le terminal backend.

### Procédure

1. **Le processus tourne-t-il ?**

   ```bash
   # Linux / macOS
   lsof -i :3000

   # Windows (PowerShell)
   netstat -ano | findstr :3000
   ```

   - **Rien n'écoute le port** → le process est mort. Passer à l'étape 3.
   - **Un process écoute** → passer à l'étape 2.

2. **Le process répond-il ?**

   ```bash
   curl -v http://localhost:3000/health
   ```

   - **Timeout ou connexion refusée** → tuer le process zombie, passer à l'étape 3.
   - **503** → ce n'est pas le process, c'est la BDD. Aller à [§ 2](#2-base-de-données-injoignable).

3. **Relancer le backend**

   ```bash
   cd backend
   npm run dev
   ```

   Résultat attendu : `Le serveur est lancé sur : http://localhost:3000`

4. **Retester**

   ```bash
   curl -s http://localhost:3000/health
   ```

5. **Si échec au démarrage**, lire le message d'erreur :
   - `Missing env var` → `.env` incomplet. Voir [exploitation.md § Variables](./exploitation.md#variables-denvironnement).
   - `EADDRINUSE` → port déjà pris. Aller à [§ 4](#4-port-déjà-utilisé).
   - Erreur SQL au boot → BDD down ou migrations manquantes. Aller à [§ 2](#2-base-de-données-injoignable).

### Si ça ne marche toujours pas

- Copier les **20 dernières lignes** de logs.
- Noter l'heure exacte du début de l'incident.
- Escalader au référent projet.

---

## 2. Base de données injoignable

### Symptômes

- `GET /health` renvoie **503** avec `"db": "unreachable"`.
- Erreurs SQL dans les logs : `ECONNREFUSED`, `password authentication failed`, `database "…" does not exist`.

### Procédure

1. **PostgreSQL tourne-t-elle ?**

   ```bash
   # Linux / macOS
   pg_isready -h localhost -p 5432

   # Windows (si psql est dans le PATH)
   pg_isready -h localhost -p 5432
   ```

   - **`accepting connections`** → PostgreSQL est vivante. Passer à l'étape 2.
   - **`no response`** → démarrer PostgreSQL, puis retester `/health`.

2. **Les variables `.env` sont-elles correctes ?**

   Vérifier dans `backend/.env` :

   ```text
   PGHOST=localhost
   PGPORT=5432
   PGUSER=…
   PGPASSWORD=…
   PGDATABASE=associsson
   ```

3. **La base existe-t-elle ?**

   ```bash
   psql -h localhost -U postgres -l
   ```

   Si `associsson` n'apparaît pas :

   ```bash
   createdb associsson
   cd backend
   npm run db:migrate:up
   npm run db:seed:up
   ```

4. **Test direct hors de l'appli**

   ```bash
   psql -h localhost -U postgres -d associsson -c "SELECT 1;"
   ```

   - **OK** → le problème vient de l'appli (variables, pool). Relancer le backend.
   - **Échec** → problème PostgreSQL pur, pas l'appli.

5. **Retester**

   ```bash
   curl -s http://localhost:3000/health
   ```

### Si ça ne marche toujours pas

- Noter le message d'erreur exact de `psql` ou des logs.
- Escalader.

---

## 3. Requêtes lentes / service dégradé

### Symptômes

- `GET /health` renvoie **503** avec `"db": "connected"` et `dbLatencyMs` > 1000.
- L'interface met plusieurs secondes à charger.

### Procédure

1. **Confirmer la latence BDD**

   ```bash
   curl -s http://localhost:3000/health | jq '.dbLatencyMs'
   ```

2. **Mesurer PostgreSQL directement**

   ```bash
   time psql -h localhost -U postgres -d associsson -c "SELECT 1;"
   ```

   - **Lent aussi en direct** → problème PostgreSQL (disque plein, connexions saturées, machine surchargée).
   - **Rapide en direct, lent via l'appli** → pool de connexions ou requêtes lourdes côté API.

3. **Vérifier les ressources machine**

   ```bash
   # Linux / macOS
   df -h
   free -h   # ou vm_stat sur macOS
   ```

4. **Lire les logs** pour repérer des requêtes en erreur ou des timeouts.

5. **Relancer le backend** si le pool semble bloqué :

   ```bash
   cd backend
   # Ctrl+C puis
   npm run dev
   ```

### Si ça ne marche toujours pas

- Noter `dbLatencyMs` et l'heure.
- Escalader si la dégradation persiste > 30 min.

---

## 4. Port déjà utilisé

### Symptômes

- Au démarrage : `Error: listen EADDRINUSE: address already in use :::3000`
- Impossible de lancer un second backend.

### Procédure

1. **Identifier le process qui occupe le port**

   ```bash
   # Linux / macOS
   lsof -i :3000

   # Windows (PowerShell)
   netstat -ano | findstr :3000
   ```

2. **Arrêter le process concerné**

   ```bash
   # Linux / macOS (remplacer PID)
   kill PID

   # Windows (PowerShell)
   taskkill /PID PID /F
   ```

3. **Relancer**

   ```bash
   cd backend
   npm run dev
   ```

4. **Retester** `/health`.

> Ne jamais lancer deux instances du backend sur le même port.

---

## 5. Variable d'environnement manquante

### Symptômes

- Crash immédiat au démarrage.
- Message `Missing env var: JWT_SECRET` (ou autre variable).

### Procédure

1. **Copier le modèle**

   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Renseigner toutes les variables obligatoires** (voir [exploitation.md](./exploitation.md#variables-denvironnement)).

3. **Relancer** `npm run dev`.

4. **Retester** `/health`.

---

## 6. Échec de connexion utilisateur (401)

### Symptômes

- `POST /utilisateur/connexion` renvoie `401 Identifiants invalides`.
- Le frontend reste sur la page de login.

### Procédure

1. **Vérifier que le backend répond** (`/health` → 200).

2. **Vérifier que les seeds sont injectés**

   ```bash
   cd backend
   npm run db:seed:up
   ```

3. **Tester la connexion en direct**

   ```bash
   curl -s -X POST http://localhost:3000/utilisateur/connexion \
     -H "Content-Type: application/json" \
     -d '{"email":"EMAIL_DU_SEED","mot_de_passe":"MOT_DE_PASSE_DU_SEED"}'
   ```

4. **Si 401 persiste** → vérifier l'email/mot de passe dans `backend/src/config/seedUp.sql`.

> Ce n'est pas un incident d'infrastructure. Escalader au back-end si les identifiants seed ne fonctionnent plus.

---

## Post-mortem (après chaque incident réel)

Sans blâme, documenter :

1. **Quoi** s'est passé (symptôme, durée).
2. **Comment** on l'a détecté (health, utilisateur, CI).
3. **Quoi** on a fait (commandes, ordre).
4. **Quoi** on change (runbook, code, monitoring).

Mettre à jour ce runbook si une étape manquait ou était fausse.

---

## Liens

- [Exploitation (démarrage, variables, logs)](./exploitation.md)
- [Référence API](./api.md)
- [Architecture](./architecture.md)
