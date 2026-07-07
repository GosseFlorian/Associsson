EXERCICE

Exercice de la matinée : trouver tous les codes HTTP, les expliquer en vulgarisant et pour les codes d'erreur, expliquer ce qu'il faut faire ou regarder pour trouver la solution

1) Codes HTTP
- 1xx → Informations
- 2xx → Succès
- 3xx → Redirections
- 4xx → Erreurs côté client
- 5xx → Erreurs côté serveur

2) Explications en vulgarisant les codes d’erreurs et solution
- Code 200 OK → Tout s’est bien passé.
- Code 404 Not Found → Ce que tu cherches n’existe pas.
- Code 400 Bad Request → Ta requête est mal faite (vérifier JSON mal formé, champs manquants, mauvais format).
- Code 500 Internal Server Error → Le serveur a explosé (vérifier : erreur SQL, exception backend, variable d’environnement manquante).
- Code 401 Unauthorized → Tu n’es pas connecté (vérifier token).
- Code 403 Forbidden → Tu n’as pas la permission (vérifier rôles).
- Code 405 Method Not Allowed → Tu utilises la mauvaise méthode http (vérifier : GET / POST / PUT / DELETE).
