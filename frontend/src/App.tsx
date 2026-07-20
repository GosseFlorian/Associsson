import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Organisation, Membre,} from './pages/Pages';
import { FormulaireOrganisation, FormulaireProjet, FormulaireTache } from "./pages/Formulaire";

function App() {
  return (
    <>
      <Routes>
        
        <Route path="/organisations" element={<Organisation/>} />
        <Route path="/organisations/membre" element={<Membre/>} />
        <Route path="/organisations/ListeFormulaire/formulaire-organisation" element={<FormulaireOrganisation />} />
        <Route path="/organisations/ListeFormulaire/formulaire-projet" element={<FormulaireProjet />} />
        <Route path="/organisations/ListeFormulaire/formulaire-tache" element={<FormulaireTache />} />
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;