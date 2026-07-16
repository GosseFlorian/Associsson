import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Test } from "./pages/Test";
import { Organisation, Membre } from './pages/Pages';
// On importe les pages depuis notre dossier pages/
//
function App() {
  return (
    <>
      <Routes>
        <Route path="/Test" element={<Test />}/>
        <Route path="/organisations" element={<Organisation/>} />
        <Route path="/organisations/membre" element={<Membre/>} />
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;
