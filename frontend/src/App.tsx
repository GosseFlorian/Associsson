import "./App.css";
import { Routes, Route } from "react-router-dom";
import { OrganisationPage } from "./pages/OrganisationsPage";
import { NavBar } from "./components/NavBar";
import { WorkSpacePage } from "./pages/WorkSpacePage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path=":idUtilisateurPath/organisations/:idOrganisation/:role" element={<WorkSpacePage />}/>
        <Route path="/:idUtilisateurPath/organisations" element={<OrganisationPage />} />
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;
