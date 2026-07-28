import "./App.css";
import { Routes, Route } from "react-router-dom";
import { OrganisationPage } from "./pages/OrganisationsPage";
import { WorkSpacePage } from "./pages/WorkSpacePage";
import { Layout } from "./pages/Layout";
import { ProfilPage } from "./pages/ProfilPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { RequireAuth } from "./components/RequireAuth";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<h2>Page non trouvée 404 🔍</h2>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/:idUtilisateurPath" element={<Layout />}>
            <Route path="organisations" element={<OrganisationPage />} />
            <Route
              path="organisations/:idOrganisation/:role"
              element={<WorkSpacePage />}
            />
            <Route path="profilPage" element={<ProfilPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
