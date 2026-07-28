import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../stores/loginStore";
import "../style/pages/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  const navigate = useNavigate();
  const setIdUtilisateur = useLoginStore((state) => state.setIdUtilisateur);
  const setToken = useLoginStore((state) => state.setToken);

  const Login = async () => {
    setErreur(null);

    const response = await fetch(
      "http://localhost:3000/utilisateur/connexion",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: password }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      setErreur(data.message ?? "Erreur de connexion");
      return;
    }

    const { token, utilisateur } = await response.json();
    setToken(token);
    setIdUtilisateur(utilisateur.id);
    navigate(`/${utilisateur.id}/organisations`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="title">Welcome Association</h1>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {erreur && <p className="erreur-text">{erreur}</p>}

        <button className="login-btn" onClick={Login}>
          Se connecter
        </button>

        <div className="signup-text">
          Pas de compte ? <a href="/register">S'inscrire</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
