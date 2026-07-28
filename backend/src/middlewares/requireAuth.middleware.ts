import { Request, Response, NextFunction } from "express";
import { verifierToken } from "../lib/jwt";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const entete = req.headers.authorization;

  if (!entete?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token manquant" });
    return;
  }

  const token = entete.slice(7);

  try {
    req.utilisateur = verifierToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré" });
    return;
  }
}
