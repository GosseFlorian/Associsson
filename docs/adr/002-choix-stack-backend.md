# ADR 002 — Choix de la stack backend

Date : 2026-06-17
Statut : Accepté

## Contexte

Nous devons choisir la stack utilisé pour le backend, pour gérer l'accès aux données et la communication entre le frontend et la base de données

## Options considérées

1. Node.js / Express — Simple, rapide et evolutif, même langage que le frontend
2. Java / Spring Boot — programmation orienté objet
3. PHP — Flexible, programmation orienté objet

## Décision

Node.js. L'équipe à déjà de l'expérience avec Node.js.
Il utilise le même langage de programmation que le frontend choisi.
Il support les requêtes JSON
Java est écarté car même si l'on est en cours d'apprentissage de ce langage, l'équipe n'est pas encore à l'aise.
PHP est écarté car non vu, manque de temps pour l'apprendre et l'utiliser efficacement.

## Conséquences

- Pas de typisation forte :
  → Possible faille de sécurité
  → Le manque de forte vérification de type statique augmente les possibles erreurs de programmation.
- Performance single-thread
  → Pas bon pour les calculs lourds
