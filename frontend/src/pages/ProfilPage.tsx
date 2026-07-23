import { useEffect } from "react";
import { useUtilisateurStore } from "../stores/utilisateurStore";
import "../style/pages/ProfilPage.css"
import { useParams } from "react-router-dom";

export function ProfilPage() {
  const { idUtilisateurPath } = useParams();
  const idUtilisateur = Number(idUtilisateurPath);

  const {
    utilisateur,
    fetchUtilisateurById,
    chargementUtilisateur,
    errorUtilisateur
  } = useUtilisateurStore();

  useEffect(() => {
    fetchUtilisateurById(idUtilisateur);
  }, [idUtilisateur, fetchUtilisateurById]);

  if (chargementUtilisateur) {
    return <p>Chargement...</p>;
  }

  if (errorUtilisateur) {
    return (
      <p>{errorUtilisateur}</p>
    );
  }

  if (!utilisateur) {
    return <p>Aucun utilisateur trouvé.</p>;
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR");
  }

  return (
    <>
      <h1>Profil</h1>
      <p>{utilisateur.nom}</p>
      <p>{utilisateur.email}</p>
      <p>{ formatDate(utilisateur.date_inscription)}</p>
    </>
  )
}
