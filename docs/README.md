# Documentation Associsson

> **À qui s'adresse ce dossier :** toute personne qui travaille sur le projet — développeuse, ops, ou reprise dans six mois.  
> **Principe :** [Diátaxis](https://diataxis.fr) — un document = un besoin = un type.

## Carte des documents

| Besoin | Type Diátaxis | Document |
|--------|---------------|----------|
| « Comment j'installe et je démarre pour coder ? » | Tutoriel | [README racine](../README.md) |
| « Comment je fais tourner le service et je vérifie qu'il vit ? » | Référence + guide pratique | [exploitation.md](./exploitation.md) |
| « Que faire à 2 h du matin quand ça casse ? » | Guide pratique (how-to) | [runbook.md](./runbook.md) |
| « Quel est le format exact de cette route ? » | Référence | [api.md](./api.md) |
| « Pourquoi le projet est structuré comme ça ? » | Explication | [architecture.md](./architecture.md) |
| « Pourquoi on a choisi X plutôt que Y ? » | Explication (décisions) | [adr/](./adr/) |

## Autres documents

| Document | Rôle |
|----------|------|
| [cadrage.md](./cadrage.md) | Objectifs, périmètre, rôles de l'équipe |
| [backlog.md](./backlog.md) | User stories et avancement |
| [erd.md](./erd.md) | Modèle de données (diagramme) |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guide de contribution |

## Règle Diátaxis en une phrase

Ne mélange pas l'installation, l'architecture, les routes API et les procédures d'incident dans le même fichier — chaque lectrice cherche une réponse précise, sous pression ou non.
