import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/pages/RegisterPage.css";

const RegisterPage = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const navigate = useNavigate();

  const Register = async () => {
    setErreur(null);

    const response = await fetch("http://localhost:3000/utilisateur", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, mot_de_passe: motDePasse }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErreur(data.message ?? "Erreur lors de l'inscription");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h1 className="title">Créer un compte</h1>

        <div className="input-group">
          <label>Nom</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="Votre mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>

        {erreur && <p className="erreur-text">{erreur}</p>}

        <button className="register-btn" onClick={Register}>
          S'inscrire
        </button>

        <div className="login-text">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
