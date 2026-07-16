import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Organisation, Membre } from './pages/Pages';

function App() {
  return (
    <>
      <Routes>
        
        <Route path="/organisations" element={<Organisation/>} />
        <Route path="/organisations/membre" element={<Membre/>} />
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;