INSERT INTO projet (id, createur_id, titre, description, date_creation, date_debut, date_fin, adress, est_termine)
VALUES 
(1, 'Marie', 'tralala', 'text', NULL, NULL, NULL, '69000 LYON', TRUE)
(1, 'Marianne', 'tralala', 'text', NULL, NULL, NULL, '69000 LYON', TRUE)
(1, 'Manon', 'tralala', 'text', NULL, NULL, NULL, '69000 LYON', TRUE)
ON DUPLICATE KEY UPDATE
  titre = VALUES(titre),
  description = VALUES(description);
