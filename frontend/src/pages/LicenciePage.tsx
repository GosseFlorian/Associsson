import "../style/pages/LicenciePage.css"
import { useLoginStore } from "../stores/loginStore";


export function LicenciePage() {
  const role = useLoginStore(
    (state) => state.role
  );

  if (role !== "licencie") {
    return (
      <p>Vous n'avez pas le role requis</p>
    )
  }
  return (
    <p>LicenciePage</p>
  )
}
