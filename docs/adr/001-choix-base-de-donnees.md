# ADR 001 — Choix de la base de données

Date : 2026-06-17
Statut : Accepté

## Contexte

Nous devons choisir une base de données relationnelle
pour stocker les données de la plateforme (utilisateurs, organisation, membres, projets, tâches).

## Options considérées

1. PostgreSQL — robuste, open source, SQL standard
2. MySQL — répandu, bonne documentation
3. SQLite — simple, pas de serveur nécessaire

## Décision

PostgreSQL. L'équipe a déjà de l'expérience avec PostgreSQL.
Il est compatible avec Node.js

## Conséquences

- Nécessite une instance PostgreSQL locale pour le dev
  → Documenté dans le README et .env.exemple
