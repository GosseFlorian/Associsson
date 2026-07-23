-- Création des tables

CREATE TYPE statut AS ENUM (
	'a_assigne',
	'en_cours',
	'termine'
);

CREATE TYPE priorite AS ENUM (
	'faible',
	'moyenne',
	'haute',
	'tres_haute'
);

CREATE TYPE role AS ENUM (
	'admin',
	'benevole',
	'licencie'
);

CREATE TABLE IF NOT EXISTS utilisateur (
	id SERIAL PRIMARY KEY,
	nom VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	mot_de_passe VARCHAR(255) NOT NULL,
	date_inscription TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organisation (
	id SERIAL PRIMARY KEY,
	nom VARCHAR(255) NOT NULL,
	date_creation TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	est_actif BOOLEAN NOT NULL DEFAULT TRUE,
	proprietaire_id INTEGER NOT NULL,
	CONSTRAINT fk_organisation_utilisateur
		FOREIGN KEY (proprietaire_id) REFERENCES utilisateur(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS membre (
	id SERIAL PRIMARY KEY,
	organisation_id INTEGER NOT NULL,
	utilisateur_id INTEGER NOT NULL,
	role role NOT NULL,
	CONSTRAINT fk_membre_organisation
		FOREIGN KEY (organisation_id) REFERENCES organisation(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_membre_utilisateur
		FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS projet (
	id SERIAL PRIMARY KEY,
	organisation_id INTEGER NOT NULL,
	createur_id INTEGER NOT NULL,
	titre VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	date_creation TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	date_debut TIMESTAMPTZ,
	date_fin TIMESTAMPTZ,
	adresse VARCHAR(255),
	est_termine BOOLEAN NOT NULL DEFAULT FALSE,
	nombre_place INTEGER,
	CONSTRAINT fk_projet_organisation
		FOREIGN KEY (organisation_id) REFERENCES organisation(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_projet_utilisateur
		FOREIGN KEY (createur_id) REFERENCES membre(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS tache (
	id SERIAL PRIMARY KEY,
	createur_id INTEGER NOT NULL,
	projet_id INTEGER NOT NULL,
	titre VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	statut statut NOT NULL,
	priorite priorite NOT NULL,
	date_echeance TIMESTAMPTZ,
	assigne_a INTEGER,
	CONSTRAINT fk_tache_membre
		FOREIGN KEY (createur_id) REFERENCES membre(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_tache_projet
		FOREIGN KEY (projet_id) REFERENCES projet(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_tache_assigne
		FOREIGN KEY (assigne_a) REFERENCES membre(id)
		ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS inscription_projet(
	id SERIAL PRIMARY KEY,
	projet_id INTEGER NOT NULL,
	membre_id INTEGER NOT NULL,
	CONSTRAINT fk_inscription_projet_projet
		FOREIGN KEY (projet_id) REFERENCES projet(id)
		ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_inscription_projet_membre
		FOREIGN KEY (membre_id) REFERENCES membre(id)
		ON DELETE CASCADE ON UPDATE CASCADE
);