import "../style/pages/AdminPage.css"
import { useLoginStore } from "../stores/loginStore";


export function AdminPage() {
  const role = useLoginStore(
    (state) => state.role
  );

  if (role !== "admin") {
    return (
      <p>Vous n'avez pas le role requis</p>
    )
  }
  return (
    <p>AdminPage</p>
  )
}
