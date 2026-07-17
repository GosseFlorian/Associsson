import { useState } from "react";
import "../style/loginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Login = () => {
    // Appel API plus tard
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

        <button className="login-btn" onClick={Login}>
          Se connecter
        </button>

        <div className="signup-text">
          Pas de compte ? <a href="/register">S’inscrire</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
