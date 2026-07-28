import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  utilisateurId: number;
}

// Fabrique un bracelet
export function creerToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
}

// Vérifie un bracelet.
// ⚠️ PLANTE si le bracelet est mauvais : elle ne renvoie pas null.
export function verifierToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}
