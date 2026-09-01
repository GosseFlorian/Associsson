import { Request } from 'express';
import { AccesRefuseError } from './errors';
import { logger } from './logger';

export function logError(req: Request, err: unknown, message: string): void {
  if (err instanceof AccesRefuseError) {
    return;
  }
  const log = req.log ?? logger;
  log.error({ err }, message);
}
