# ADR 004 — Passage de JavaScript à TypeScript

Date : rédigé le 15/07/2026
Statut : Accepté

## Contexte

L'ADR 002 et 003 actait initialement React et Node.js en JavaScript.
Pour des raisons de sécurité et de gestion d'erreur en amont nous voulons choisir un langage avec un typage fort.

## Options considérées

1. Rester en JavaScript.
2. Passer à TypeScript.

## Décision

TypeScript :

- Cohérence de langage entre frontend et backend (un seul langage à maîtriser sur l'ensemble du projet)
- Détection des erreurs de typage à la compilation plutôt qu'à l'exécution
- Meilleure autocomplétion / navigation dans le code via l'IDE

## Conséquences

- Le typage doit être maintenu à jour sur les composants React, le state et les appels à l'API (types de requêtes/réponses)
- Temps de build légèrement supérieur à du JavaScript pur
- Nécessite une configuration TypeScript à maintenir (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`)
