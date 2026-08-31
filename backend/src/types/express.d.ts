import 'express';
import type { Logger } from 'pino';

declare global {
  namespace Express {
    interface Request {
      log: Logger;
      utilisateur?: {
        utilisateurId: number;
      };
    }
  }
}

export {};
