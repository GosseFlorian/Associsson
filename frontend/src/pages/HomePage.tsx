import { useEffect, useState } from "react";
import "../style/pages/HomePage.css";
import Logo2 from "../style/img/Logo2.png";
import Image from "../style/img/image.png";

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
         <div className="texte" style={{ position: "relative" }}>
            <img
              src={Image}
              alt="Image"
              draggable="false"
              style={{ width: "70%", display: "block" }}
            />
            <div className="message">
              <h3>Une application pour les remplacer toutes.</h3>
              <p>
                Faites travailler vos équipes sur une seule plateforme conçue pour gérer tout type de travail.
              </p>
              <div className="bouton">
                <button className="btnC">Connexion</button>
                <button className="btnI">Inscription</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}