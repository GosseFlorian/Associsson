# Projet Associsson – README individuel
## Apprenante : Fofana Hawa Rachida
## Soutenance S9 – Cadrage + V1

### 🎯 Objectif du projet
Associsson est une application destinée aux associations sportives pour centraliser :
- la gestion des membres,
- la création d’événements,
- l’auto‑inscription des bénévoles et licenciés,
- le suivi des tâches via un tableau Kanban.

L’objectif est de simplifier l’organisation et d’éviter l’éparpillement .

---

###  Ma contribution (V1)
Pour cette première version, j’ai travaillé sur **la gestion des tâches** :

- Création d’une tâche  
- Modification  
- Suppression  
- Changement de statut (À faire / En cours / Terminé)  
- Affichage de la liste des tâches  

Ce périmètre est volontairement réduit pour livrer une fonctionnalité complète et démontrable.

---

### 🧭 Priorisation (MoSCoW)
**Must have :** CRUD tâche, statut, liste  
**Should have :** priorité, assignation  
**Could have :** date d’échéance, filtres  
**Won’t have :** notifications, dashboard, multi‑équipes

---

### Architecture utilisée
- **Front :** React 19, TypeScript, Vite, React Router, Zustand  
- **Back :** Node.js, Express 5, TypeScript, driver `pg`  
- **Base de données :** PostgreSQL  
- **Table principale :** `tache_sportive` (id, titre, description, statut, priorité)

---

###  État de la V1 (réel)
 Fonctionnel :  
- créer une tâche  
- modifier  
- supprimer  

 En cours :  
- priorité  
- assignation  

Non développé dans la V1 :  
- authentification  
- rôles (Admin / Bénévole / Licencié / Parent)  
- création d’organisation  
- création d’événements sportifs  
- auto‑inscription  
- calendrier global  
- historique d’activité  

👉 Ma V1 se concentre sur **une seule fonctionnalité complète : la gestion des tâches**.

---

### 🧠 Choix technique défendu
J’ai choisi un **modèle de tâche simple** pour :
- livrer une fonctionnalité complète en 9 semaines,
- garder une interface claire pour les bénévoles,
- faciliter l’intégration future avec les événements sportifs.

---

### 🔗 Liens utiles
- Dépôt GitHub : https://github.com/GosseFlorian/Associsson
