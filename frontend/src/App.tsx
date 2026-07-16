import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Test } from "./pages/Test";
import { OrganisationPage } from "./pages/OrganisationsPage";
import { NavBar } from "./components/NavBar";
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/organisations" element={<OrganisationPage />} />
        <Route path="/Test" element={<Test />}/>
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;
