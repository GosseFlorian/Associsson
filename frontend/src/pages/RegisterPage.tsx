import { useState } from "react";
import "../style/pages/RegisterPage.css";

const RegisterPage = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const Register = () => {
    console.log("Nom :", nom);
    console.log("Email :", email);
    console.log("Mot de passe :", motDePasse);

    
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
