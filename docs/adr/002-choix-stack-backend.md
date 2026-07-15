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
  → ⚠️ **Mise à jour 15/07/2026** : ce point n'est plus d'actualité. Voir [`ADR 004 — Passage de JavaScript à TypeScript`](./004-passage-de-javascript-a-typescript.md), qui documente l'adoption de TypeScript côté frontend **et** backend, apportant la vérification de type statique qui manquait ici. Je laisse la ligne d'origine barrée logiquement plutôt que supprimée, pour garder la trace du raisonnement au moment de la décision.
- Performance single-thread
  → Pas bon pour les calculs lourds

## Mise à jour — 15/07/2026

Le choix Node.js/Express reste valable et n'est pas remis en cause. Seule la conséquence "pas de typisation forte" est caduque depuis le passage du projet à TypeScript (backend et frontend), documenté dans [`ADR 004`](./004-passage-de-javascript-a-typescript.md). La "performance single-thread" reste une contrainte réelle de Node.js, TypeScript n'y change rien (c'est un typage statique qui disparaît à la compilation, pas un runtime différent).
