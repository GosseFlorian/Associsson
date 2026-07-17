import "../style/pages/WorkSpacePage.css"
import { useParams } from "react-router-dom";
import { AdminPage } from "./AdminPage";
import { BenevolePage } from "./BenevolePage";
import { LicenciePage } from "./LicenciePage";

export function WorkSpacePage() {
  const { role } = useParams();
  if (role === "admin") {
    return (<AdminPage />)
  } else if (role === "benevole") {
    return (<BenevolePage/>)
  } else if (role === "licencie") {
    return (<LicenciePage/>)
  }
  return (
    <>
      <p>Vous n'avez pas de role dans cette association</p>
    </>
  )
}
