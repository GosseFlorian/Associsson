-- Delete des données et Reset l'id de démarrage

TRUNCATE TABLE utilisateur CASCADE;
TRUNCATE TABLE membre CASCADE;
TRUNCATE TABLE organisation CASCADE;
TRUNCATE TABLE projet CASCADE;
TRUNCATE TABLE tache CASCADE;
TRUNCATE TABLE inscription_projet CASCADE;

ALTER SEQUENCE utilisateur_id_seq RESTART WITH 1;
ALTER SEQUENCE membre_id_seq RESTART WITH 1;
ALTER SEQUENCE organisation_id_seq RESTART WITH 1;
ALTER SEQUENCE projet_id_seq RESTART WITH 1;
ALTER SEQUENCE tache_id_seq RESTART WITH 1;
ALTER SEQUENCE inscription_projet_id_seq RESTART WITH 1;