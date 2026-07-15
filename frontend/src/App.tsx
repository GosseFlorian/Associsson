import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Organisation } from './pages/Pages';

function App() {
  return (
    <>
      <Routes>
        {/* futures pages ici */}
        <Route path="/organisations" element={<Organisation/>} />
        <Route path="*" element={<h2>Page non trouvée 404 🔍</h2>} />
      </Routes>
    </>
  );
}
export default App;