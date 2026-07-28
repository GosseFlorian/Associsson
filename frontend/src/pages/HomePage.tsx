import { useEffect, useState } from "react";
import "../style/pages/HomePage.css";
import Logo from "../style/img/Logo.png";
import Logo2 from "../style/img/Logo2.png";

export function HomePage() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 60) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <header className={hidden ? "header-hidden" : ""}>
        <div className="logo">
          <img
            src={Logo2}
            alt="Logo2"
            draggable="false"
            style={{ width: 50, height: "auto" }}
          />
          <p>Associsson</p>
        </div>
        <div className="bouton">
          <button className="btnC">Connexion</button>
          <button className="btnI">Inscription</button>
        </div>
      </header>

      <main>
        <div id="accueil" className="Acceuil">
          <div className="image">
            <img src={Logo} alt="Logo" draggable="false"/>
          </div>
          <div className="texte">
            <h3>Une application pour les remplacer toutes.</h3>
            <br />
            <p>
              Faites travailler vos équipes sur une seule plateforme conçue pour gérer tout type de travail.
            </p>
          </div>
          <div className="bouton">
            <button className="btnC">Connection</button>
            <button className="btnI">Inscription</button>
          </div>
        </div>
      </main>
    </>
  );
}