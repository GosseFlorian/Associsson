-- Seeding des tables avec des données fictives

INSERT INTO utilisateur (id, nom, email, mot_de_passe, date_inscription) VALUES
(1, 'Florian', 'florian@gmail.com', 'Mot2passeFlori@n', '2026-06-30'),
(2, 'Benjamin', 'benjamin@gmail.com', 'Mot2passeBenj@min', '2026-06-30'),
(3, 'Antoine', 'antoine@gmail.com', 'Mot2passe@ntoine', '2026-06-30');


INSERT INTO organisation (id, nom, date_creation, est_actif, proprietaire_id) VALUES
(1, 'Associsson Gisèle', '2026-06-30', TRUE, 1),
(2, 'Associsson Grace', '2026-06-30', TRUE, 2),
(3, 'Associsson Georges', '2026-06-30', TRUE, 3);

INSERT INTO membre (id, organisation_id, utilisateur_id, role) VALUES
(1, 1, 1, 'admin'),
(2, 1, 2, 'benevole'),
(3, 1, 3, 'licencie'),
(4, 2, 2, 'admin'),
(5, 2, 3, 'benevole'),
(6, 2, 1, 'licencie'),
(7, 3, 3, 'admin'),
(8, 3, 1, 'benevole'),
(9, 3, 2, 'licencie');

INSERT INTO projet (id, organisation_id, createur_id, titre, description, date_creation, date_debut, date_fin, adresse, est_termine, nombre_place) VALUES 
(1, 1, 1, 'La réponse ultime sur la vie', 'très bon film', '1978-01-01', NULL, NULL, 'Galaxie', FALSE, 42),
(2, 1, 2, 'Projet qui est fini', 'Un projet qui est tout terminé !', '2026-06-30', NULL, NULL, 'Paradie', TRUE, 200),
(3, 1, 3, 'Projet fouareux', 'on a tout casser ><', '2666-06-06', NULL, NULL, 'Enfer', FALSE, 404),
(4, 2, 1, 'La réponse ultime sur la vie', 'très bon film', '1978-01-01', NULL, NULL, 'Galaxie', FALSE, 42),
(5, 2, 2, 'Projet qui est fini', 'Un projet qui est tout terminé !', '2026-06-30', NULL, NULL, 'Paradie', TRUE, 200),
(6, 2, 3, 'Projet fouareux', 'on a tout casser ><', '2666-06-06', NULL, NULL, 'Enfer', FALSE, 404),
(7, 3, 1, 'La réponse ultime sur la vie', 'très bon film', '1978-01-01', NULL, NULL, 'Galaxie', FALSE, 42),
(8, 3, 2, 'Projet qui est fini', 'Un projet qui est tout terminé !', '2026-06-30', NULL, NULL, 'Paradie', TRUE, 200),
(9, 3, 3, 'Projet fouareux', 'on a tout casser ><', '2666-06-06', NULL, NULL, 'Enfer', FALSE, 404);

INSERT INTO tache (id, createur_id, projet_id, titre, description, statut, priorite, date_echeance, assigne_a) VALUES
(1, 1, 1, 'Envoyer les emails', 'Envoyer les messages à contact@asso.fr', 'a_assigne', 'moyenne', '2026-07-01', 2),
(2, 1, 2, 'Mettre à jour le site', 'Modifier le texte et les images', 'en_cours', 'haute', '2026-07-05', 2),
(3, 1, 3, 'Corriger les bugs API', 'Fix des erreurs signalées', 'termine', 'tres_haute', '2026-07-10', 1),
(4, 2, 4, 'Envoyer les emails', 'Envoyer les messages à contact@asso.fr', 'a_assigne', 'moyenne', '2026-07-01', 2),
(5, 2, 5, 'Mettre à jour le site', 'Modifier le texte et les images', 'en_cours', 'haute', '2026-07-05', 3),
(6, 2, 6, 'Corriger les bugs API', 'Fix des erreurs signalées', 'termine', 'tres_haute', '2026-07-10', 3),
(7, 3, 7, 'Envoyer les emails', 'Envoyer les messages à contact@asso.fr', 'a_assigne', 'moyenne', '2026-07-01', 1),
(8, 3, 8, 'Mettre à jour le site', 'Modifier le texte et les images', 'en_cours', 'haute', '2026-07-05', 3),
(9, 3, 9, 'Corriger les bugs API', 'Fix des erreurs signalées', 'termine', 'tres_haute', '2026-07-10', 1);

INSERT INTO inscription_projet (id, projet_id, membre_id) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 2, 1),
(5, 2, 2),
(6, 3, 1),
(7, 4, 1),
(8, 4, 2),
(9, 4, 3),
(10, 5, 1),
(11, 5, 2),
(12, 6, 1),
(13, 7, 1),
(14, 7, 2),
(15, 7, 3),
(16, 8, 1),
(17, 8, 2),
(18, 9, 1);
