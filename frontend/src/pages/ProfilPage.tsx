import { useEffect } from 'react';
import { useUtilisateurStore } from '../stores/utilisateurStore';
import '../style/pages/ProfilPage.css';
import { useParams } from 'react-router-dom';

export function ProfilPage() {
  const { idUtilisateurPath } = useParams();
  const idUtilisateur = Number(idUtilisateurPath);

  const {
    utilisateur,
    fetchUtilisateurById,
    chargementUtilisateur,
    errorUtilisateur,
  } = useUtilisateurStore();

  useEffect(() => {
    fetchUtilisateurById(idUtilisateur);
  }, [idUtilisateur, fetchUtilisateurById]);

  if (chargementUtilisateur) {
    return <p>Chargement...</p>;
  }

  if (errorUtilisateur) {
    return <p>{errorUtilisateur}</p>;
  }

  if (!utilisateur) {
    return <p>Aucun utilisateur trouvé.</p>;
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  return (
    <section className="profilPage">
      <div className="profilPage-container">
        <h1 className="profilPage-title profilPageMargin">
          Profil utilisateur
        </h1>
        <p className="profilPage-name profilPageMargin">
          Nom : {utilisateur.nom}
        </p>
        <p className="profilPage-email profilPageMargin">
          Email : {utilisateur.email}
        </p>
        <p className="profilPage-inscription profilPageMargin">
          Date d'inscription : {formatDate(utilisateur.date_inscription)}
        </p>
      </div>
    </section>
  );
}
