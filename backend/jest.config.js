/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Cherche les tests dans un dossier /test à la racine (à adapter si besoin)
  roots: ["<rootDir>/tests"],
};
