import { useLoginStore } from "../stores/loginStore";
import "../style/components/NavBar.css"
import { useLocation } from "react-router-dom"

export function NavBar() {

  const idUtilisateur = useLoginStore(
    (state) => state.idUtilisateur
  );

  const location = useLocation();
  let Orga = <p className="orga-p">Organisations</p>;

  if(location.pathname !== "/organisations") {
    Orga = <a className="navBar-a orga" href={`/${idUtilisateur}/organisations`}>Revenir au choix des Organisations</a>
  }

  return (
    <>
      <header>
        <p className="logo-home">Associsson</p>
        {Orga}
        <a href="/profilPage" className="navBar-a">Mon Profil</a>
      </header>
    </>
  )
}
