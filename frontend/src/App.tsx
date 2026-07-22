import "./App.css";
import { Routes, Route } from "react-router-dom";
import { OrganisationPage } from "./pages/OrganisationsPage";
import { WorkSpacePage } from "./pages/WorkSpacePage";
import { Layout } from "./pages/Layout";
import { ProfilPage } from "./pages/ProfilPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/:idUtilisateurPath" element={<Layout />}>
          <Route path="organisations" element={<OrganisationPage />} />
          <Route path="organisations/:idOrganisation/:role" element={<WorkSpacePage />} />
          <Route path="profilPage" element={<ProfilPage/>}/>
          <Route path="organisations/:idOrganisation/:role/profilPage" element={<ProfilPage/>}/>
        </Route>
        <Route path="/*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;
