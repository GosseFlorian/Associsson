import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Test } from "./pages/Test";
// On importe les pages depuis notre dossier pages/

function App() {
  return (
    <Routes>
      {/* C'est ici que tu ajouteras tes futures pages, ex: <Route path="/board" element={<Board />} /> */}
      <Route path="/Test" element={<Test />}/>
      {/* Page erreur 404 */}
      <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
    </Routes>
  );
}

export default App;
