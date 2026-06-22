```mermaid
erDiagram
    Utilisateur }o--o{ Membre : ""
    Utilisateur ||--o{ Organisation : ""
    Organisation ||--o{ Membre : ""
    Organisation ||--o{ Projet : ""
    Projet ||--o{ Tache : ""
    Tache }o..o{ avancement : ""
    Tache }o..o{ priorite : ""
    Utilisateur {
        integer id PK
        text name
        text email UK
        text mdp
    }
    Organisation{
        integer id PK
        interger id_owner FK
        text name
    }
    Membre {
        integer id_utilisateur FK
        integer id_organisation FK
        text role
    }
    Projet{
        integer id PK
        integer id_association FK
        text Name
        text Description
        timestamp Date_debut
        timestamp Date_fin
        timestamp Date_evenement
        text lieu
        boolean is_done
    }
    Tache{
        integer id PK
        integer id_projet FK
        text name
        text description
        enums avancement 
        enums Priorite
    }
    avancement{
        enums pas_commencer
        enums en_cours
        enums fini
    }
    priorite{
        enums faible
        enums moyenne
        enums haute
        enums tres_haute
    }
