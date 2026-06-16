# Associsson

> Application web qui permet au association d'avoir une plateforme de gestion de projets et de suivi de taches.

## Contexte & problème

De nombreuses association ont des problemes d'organisation, de suivi des membres actif et de suivi d'evenement.
Résultat : perte de temps pour regrouper tout les informations, manque de communication entre les différents partie et difficulté du maintien du calendrier.

## Objectif & critères de succès

**Objectif.** Permettre à une association de créer, suivre ces projets/événements et permettre au benevole de s'y inscrire et de suivre l'avancement facilement.

Le projet est réussi si, à la fin de la période :

- Une association peut créer un projet
- Un bénévole peut contribuer à un projet
- un bénévole peut créer des taches pour un projet
- licencié peut s'inscrire à des projets
- l'interface en format kanban lisible
- au moins une démo de bout en bout fonctionne sans bug bloquant.

## Périmètre

**Inclus (in)**

- Création de compte et connexion
- Création de role (Admin, bénévole, licenciés)
- Création d'organisation
- Invitation de membre et leurs assignée des roles
- Créer un projet (role admin)
- Créer une tache (role admin ou bénévole)
- Interface visuel d'un calendrier
- Interface visuel format kanban des projets/taches
- Contribution possible des bénévoles au projet
- Inscription possible des licenciés au projet

**Exclu (out)**

- Autre role (ex: parent licencié)
- Système de communication collaboratif (Messagerie interne)
- Application mobile native
- Séparation des projets par catégorie

> Le « out » est aussi important que le « in » : il protège l'équipe contre l'élargissement non décidé du projet.

## Rôles & responsabilités

| Rôle              | Personne   | Responsable de                                      |
| ----------------- | ---------- | --------------------------------------------------- |
| Référent·e projet | _Florian_  | Suivi du planning, lien avec le ou la formateur·ice |
| Front-end         | _Rachida_  | Interfaces, intégration responsive                  |
| Back-end          | _Benjamin_ | API, base de données                                |
| Design / UX       | _Antoine_  | Maquettes, parcours utilisateur                     |

> Un rôle ne veut pas dire « la seule personne qui touche à ce sujet », mais « la personne responsable que ce sujet avance ».

## Conventions de travail

- **Dépôt :** GitHub — `https://github.com/GosseFlorian/Associsson`
- **Branches :** `main` (stable), une branche par fonctionnalité nommée `feat/nom-fonctionnalite`
- **Commits :** un message clair au présent (ex. `ajoute le formulaire de publication de trajet`)
- **Rituel d'équipe :** point de 15 min en début de chaque séance pour répartir le travail (obligatoire) et point de 15 min en fin de chaque séance pour faire le point sur l'avancement de chacun (optionnel)
- **Outils :** code sur VS Code, maquettes sur Figma/Penpot, suivi des tâches sur un Kanban partagé (Notion)
