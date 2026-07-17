import { Button } from "../components/Button";
import { useState} from "react";
import "../style/pages/BenevolePage.css";
import { ProfilCard } from "../components/ProfilCard";
import { useLoginStore } from "../stores/loginStore";
import { ProjetCard } from "../components/ProjetCard";
import { TacheCard } from "../components/TacheCard";

export function BenevolePage() {
  const [sectionActive, setSectionActive] = useState("projets");

  const role = useLoginStore(
    (state) => state.role
  );
  if (role !== "benevole") {
    return (
      <p>Vous n'avez pas le role requis</p>
    )
  }

  return (
    <>
      <div className="benevole-selection">
      <Button text="Mon profil" action={() => setSectionActive("profil")} active={sectionActive === "profil"}/>
      <Button text="Projets" action={() => setSectionActive("projets")} active={sectionActive === "projets"}/>
      <Button text="Mes tâches" action={() => setSectionActive("taches")} active={sectionActive === "taches"}/>
      </div>
      <div>
        {sectionActive === "profil" && (
          <div>
            <ProfilCard/>
          </div>
        )}
        {sectionActive === "projets" && (
          <div>
            <ProjetCard />
          </div>
        )}
        {sectionActive === "taches" && (
          <div>
            <TacheCard />
          </div>
        )}
      </div>
    </>
  );
}
