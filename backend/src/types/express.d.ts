import "express";

declare global {
  namespace Express {
    interface Request {
      utilisateur?: {
        utilisateurId: number;
      };
    }
  }
}

export {};
