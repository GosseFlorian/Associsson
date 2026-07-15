# ADR 003 - Choix des technologie front

Date : 2026-06-17
Statut : Accepté

## Contexte

Nous devons definir les technologies que nous allons utiliser pour notre frontend

## Options considérées

1. JavaScript, React - composant, moderne, très productif
2. TypeScript, React - robuste, typé, plus exigeant
3. JavaScript vanilla - léger, vite limité

## Décision

JavaScript, React. Cette technologie sera un gain de temps dans notre travail, l'équipe connait déjà cette technologie.

## Conséquences

Maintenance continue — React évolue régulièrement, impliquant des mises à jour et adaptations.

## Mise à jour — 15/07/2026

⚠️ Écart constaté : le frontend/package.json et les fichiers tsconfig\*.json du dépôt montrent que le projet utilise en réalité React + TypeScript (option 2 de cette ADR), pas JavaScript comme écrit ci-dessus. C'est cohérent avec le choix backend (ADR 002, Node.js/TypeScript).

→ Résolu par ADR 004 — Passage de JavaScript à TypeScript, qui documente ce changement. Cette ADR-003 est laissée telle quelle pour garder la trace de la décision d'origine (JavaScript), conformément au principe qu'une ADR ne se réécrit pas a posteriori.
