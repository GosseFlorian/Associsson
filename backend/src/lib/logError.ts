import { Request } from 'express';
import { logger } from './logger';

export function logError(req: Request, err: unknown, message: string): void {
  const log = req.log ?? logger;
  log.error({ err }, message);
}
