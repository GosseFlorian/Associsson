import { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../src/middlewares/requireAuth.middleware';
import { verifierToken } from '../src/lib/jwt';

jest.mock('../src/lib/jwt');

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('requireAuth', () => {
  it('erreur : renvoie 401 si le header Authorization est absent', () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' });
    expect(next).not.toHaveBeenCalled();
  });

  it("erreur : renvoie 401 si le header n'est pas Bearer", () => {
    const req = {
      headers: { authorization: 'Basic abc' },
    } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('erreur : renvoie 401 si le token est invalide', () => {
    (verifierToken as jest.Mock).mockImplementation(() => {
      throw new Error('jwt malformed');
    });
    const req = {
      headers: { authorization: 'Bearer token-invalide' },
    } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token invalide ou expiré',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("succès : attache l'utilisateur et appelle next si le token est valide", () => {
    (verifierToken as jest.Mock).mockReturnValue({ utilisateurId: 42 });
    const req = {
      headers: { authorization: 'Bearer token-valide' },
    } as Request;
    const res = mockResponse();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(verifierToken).toHaveBeenCalledWith('token-valide');
    expect(req.utilisateur).toEqual({ utilisateurId: 42 });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
