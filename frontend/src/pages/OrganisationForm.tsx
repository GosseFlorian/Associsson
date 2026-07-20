import React, { useState } from "react";
import "../style/organisationForm.css";


interface OrganisationFormData {
  nom: string;
  dateCreation: string;
  estActive: boolean;
  proprietaireId: number;
}

export default function OrganisationForm() {
  const [form, setForm] = useState<OrganisationFormData>({
    nom: "",
    dateCreation: "",
    estActive: false,
    proprietaireId: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("Organisation créée :", form);
  };

  return (
  <div className="organisation-wrapper">
    <div className="organisation-card">

      <h2 className="title">Nouvelle organisation</h2>

      <form onSubmit={handleSubmit}>

        <div className="input-row">
     <label>Nom</label>
  <input
    name="nom"
    value={form.nom}
    onChange={handleChange}
  />
  </div>

<button className="organisation-btn" type="submit">
          Créer
        </button>

      </form>
    </div>
  </div>
);

}
