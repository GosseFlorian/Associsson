import "../style/pages/HomePage.css";
import { useState } from 'react'

export function HomePage() {
    const [nomPrenom, setNomPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [objet, setObjet] = useState("");
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    return (
        <>
            <header>
                <div>
                    <img src="logo" alt="logo de Associsson" />
                </div>
                <div className="bouton">
 
                    <div className="nav-wrapper">
                        <nav className={`navbar ${isVisible ? 'nav-exit' : 'nav-enter' }`}>
                            <a href="#accueil">Accueil</a>
                            <a href="#equipe">Équipe</a>
                            <a href="#contact">Contact</a>
                        </nav>

                        <button className="arrow-btn" onClick={() => setIsVisible(!isVisible)}>
                            {isVisible ? '▶' : '◀'  }
                        </button>
                    </div>
                    <br />
                    <button>Connexion</button>
                    <button>Inscription</button>
                </div>
            </header>
            <main>
                <div id="accueil" className="Acceuil">
                    <div className="titre">
                        <h1>Bienvenue à Associsson</h1>
                        <br />
                        <h3>Une application pour les remplacer toutes</h3>
                        <br />
                        <p>Faites travailler vos équipes sur une seule plateforme conçue pour gérer tout type de travail.</p>
                    </div>
                    <br />
                    <div className="liste">
                        <button>Voir la liste des associations</button>
                    </div>                        
                </div>
                
                <div id="equipe" className="Equipe">
                    <h2>Notre équipe</h2>
                </div>

                <div id="contact" className="Contact">
                    <div>
                        <form>
                            <h3>Envoyez-nous un message</h3>
                            <div>
                                <div className="nomPrenom">
                                    <label htmlFor='nomPrenom'>Nom et Prénom</label><br />
                                    <input 
                                    type="text"
                                    value={nomPrenom}
                                    onChange={(e) => setNomPrenom(e.target.value)}
                                    />
                                </div>
                                <div className="email">
                                    <label htmlFor='email'>Email</label><br />
                                    <input 
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="objet">
                                    <label htmlFor='objet'>objet</label><br />
                                    <input 
                                    type="text"
                                    value={objet}
                                    onChange={(e) => setObjet(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="message">
                                    <label htmlFor='message'>Message</label><br />
                                    <textarea
                                        id="description"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="btnValidation">
                                <button type="submit">Envoyer le message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}