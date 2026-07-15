import { useState } from "react";
import "../style/login.css";


const LoginSimple = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const Login = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember me:", remember);
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

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label>Remember me</label>
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

export default LoginSimple;
