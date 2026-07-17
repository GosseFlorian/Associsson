import "./App.css";
import { Routes, Route } from "react-router-dom";
import  Registerpage from "./pages/registerPage";

function App() {
  return (
    <Routes>
      {/* C'est ici que tu ajouteras tes futures pages, ex: <Route path="/board" element={<Board />} /> */}

      {/* Page erreur 404 */}
      <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />

       {/* register */}
      <Route path="/register" element={< Registerpage />} />


    </Routes>
  );
}

export default App;