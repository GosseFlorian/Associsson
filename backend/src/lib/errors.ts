import { Request, Response } from 'express';
import { logger } from './logger';

export class AccesRefuseError extends Error {
  constructor(message = 'Accès refusé') {
    super(message);
    this.name = 'AccesRefuseError';
  }
}

export function journaliserAccesRefuse(req: Request): void {
  const log = req.log ?? logger;
  log.warn(
    {
      event: 'acces_refuse',
      method: req.method,
      path: req.path,
      utilisateurId: req.utilisateur?.utilisateurId ?? null,
    },
    'Accès refusé'
  );
}

export function envoyerSiAccesRefuse(
  req: Request,
  res: Response,
  error: unknown
): boolean {
  if (error instanceof AccesRefuseError) {
    journaliserAccesRefuse(req);
    res.status(403).json({ message: error.message });
    return true;
  }
  return false;
}
