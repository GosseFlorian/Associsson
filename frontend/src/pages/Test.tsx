import { Button } from "../components/Button";
import { ProfilCard } from "../components/ProfilCard";
import { ProjetCard } from "../components/ProjetCard";
import { TacheCard } from "../components/TacheCard";

export function Test() {

  function test() {
    console.log("test");
  }

  return (
    <>
      <p>Pages test</p>
      <Button text={"Mon profil"} action={test} active={true} />
      <Button text={"Mes Tâches"} action={test} active={false} />
      <ProfilCard id={2} />
      <TacheCard />
      <ProjetCard />
    </>
  );
}
