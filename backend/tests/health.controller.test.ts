import { Request, Response } from 'express';
import { getHealthController } from '../src/controllers/health.controller';
import { checkDbConnection } from '../src/services/health.service';

jest.mock('../src/services/health.service');

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getHealthController', () => {
  it('succès : renvoie 200 quand la base de données est connectée', async () => {
    (checkDbConnection as jest.Mock).mockResolvedValue({
      connected: true,
      latencyMs: 4,
    });
    const req = {} as Request;
    const res = mockResponse();

    await getHealthController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      db: 'connected',
      dbLatencyMs: 4,
    });
  });

  it('dégradé : renvoie 503 quand la base de données est injoignable', async () => {
    (checkDbConnection as jest.Mock).mockResolvedValue({
      connected: false,
      latencyMs: 500,
    });
    const req = {} as Request;
    const res = mockResponse();

    await getHealthController(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: 'degraded',
      db: 'unreachable',
      dbLatencyMs: 500,
    });
  });

  it('dégradé : renvoie 503 quand la latence dépasse 1000ms', async () => {
    (checkDbConnection as jest.Mock).mockResolvedValue({
      connected: true,
      latencyMs: 1500,
    });
    const req = {} as Request;
    const res = mockResponse();

    await getHealthController(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: 'degraded',
      db: 'connected',
      dbLatencyMs: 1500,
    });
  });
});
