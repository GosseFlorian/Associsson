import { Request, Response } from 'express';
import {
  AccesRefuseError,
  envoyerSiAccesRefuse,
  journaliserAccesRefuse,
} from '../src/lib/errors';
import { logError } from '../src/lib/logError';

function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

function mockReq(overrides: object = {}) {
  const warn = jest.fn();
  const error = jest.fn();
  const req = {
    method: 'PUT',
    path: '/organisation/2',
    url: '/organisation/2?token=secret',
    body: { mot_de_passe: 'hunter2', nom: 'Intrus' },
    headers: { authorization: 'Bearer super-secret' },
    utilisateur: { utilisateurId: 1 },
    log: { warn, error },
    ...overrides,
  } as unknown as Request;
  return { req, warn, error };
}

describe('journaliserAccesRefuse', () => {
  it("écrit un warn sans corps, token ni mot de passe", () => {
    const { req, warn } = mockReq();

    journaliserAccesRefuse(req);

    expect(warn).toHaveBeenCalledTimes(1);
    const payload = warn.mock.calls[0][0];
    expect(payload).toEqual({
      event: 'acces_refuse',
      method: 'PUT',
      path: '/organisation/2',
      utilisateurId: 1,
    });
    expect(warn.mock.calls[0][1]).toBe('Accès refusé');
    expect(JSON.stringify(payload)).not.toMatch(/hunter2|Bearer|super-secret|token=/);
    expect(payload).not.toHaveProperty('body');
    expect(payload).not.toHaveProperty('headers');
    expect(payload).not.toHaveProperty('url');
  });
});

describe('envoyerSiAccesRefuse', () => {
  it('répond 403, journalise un warn, et ne touche pas log.error', () => {
    const { req, warn, error } = mockReq();
    const res = mockResponse();

    const traite = envoyerSiAccesRefuse(
      req,
      res,
      new AccesRefuseError('Accès refusé')
    );

    expect(traite).toBe(true);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  it("ignore les erreurs qui ne sont pas un refus d'accès", () => {
    const { req, warn } = mockReq();
    const res = mockResponse();

    const traite = envoyerSiAccesRefuse(req, res, new Error('boom'));

    expect(traite).toBe(false);
    expect(res.status).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('logError', () => {
  it("ne journalise pas AccesRefuseError au niveau error", () => {
    const { req, error } = mockReq();

    logError(req, new AccesRefuseError('Accès refusé'), 'Erreur interne');

    expect(error).not.toHaveBeenCalled();
  });

  it('journalise les autres erreurs au niveau error', () => {
    const { req, error } = mockReq();
    const err = new Error('boom');

    logError(req, err, 'Erreur interne');

    expect(error).toHaveBeenCalledWith({ err }, 'Erreur interne');
  });
});
