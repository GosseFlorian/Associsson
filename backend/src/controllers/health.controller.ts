import { Request, Response } from 'express';
import { checkDbConnection } from '../services/health.service';

const DEGRADED_LATENCY_MS = 1000;

export const getHealthController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { connected, latencyMs } = await checkDbConnection();

  if (!connected) {
    res.status(503).json({
      status: 'degraded',
      db: 'unreachable',
      dbLatencyMs: latencyMs,
    });
    return;
  }

  if (latencyMs > DEGRADED_LATENCY_MS) {
    res.status(503).json({
      status: 'degraded',
      db: 'connected',
      dbLatencyMs: latencyMs,
    });
    return;
  }

  res.status(200).json({
    status: 'ok',
    db: 'connected',
    dbLatencyMs: latencyMs,
  });
};
