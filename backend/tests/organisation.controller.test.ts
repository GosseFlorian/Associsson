import { describe } from "node:test";
import {
  getOrganisationIdController,
  getOrganisationController,
  postOrganisationController,
  putOrganisationController,
  deleteOrganisationController,
} from "../src/controllers/organisation.controller";

import {
  getOrganisationIdService,
  getOrganisationService,
  postOrganisationService,
  putOrganisationService,
  deleteOrganisationService,
} from "../src/services/organisation.service";

import { Request, Response } from "express";



jest.mock("../src/services/organisation.service", () => ({
  getOrganisationIdService: jest.fn(),
  getOrganisationService: jest.fn(),
  postOrganisationService: jest.fn(),
  putOrganisationService: jest.fn(),
  deleteOrganisationService: jest.fn(),
}));

const mockResponse = () => {
  const res = {} as Response;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

describe("getOrganisationController", () => {
  //test 1 réussite 200
  it("get : doit retourner 200 avec la liste des organisations", async () => {

    const organisations = [
      {
        id: 1,
        nom: "OpenAI",
      },
    ];

    (getOrganisationService as jest.Mock)
      .mockResolvedValue(organisations);

    const req = {} as Request;
    const res = mockResponse();

    await getOrganisationController(req, res);

    expect(getOrganisationService)
      .toHaveBeenCalled();

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith(organisations);
  });

  //test 2 erreur 500
  it("get : doit retourner 500 si le service échoue", async () => {

    (getOrganisationService as jest.Mock)
      .mockRejectedValue(new Error("Erreur DB"));

    const req = {} as Request;
    const res = mockResponse();

    await getOrganisationController(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(500);

    expect(res.json)
      .toHaveBeenCalledWith({
        message: "Erreur interne du serveur",
      });
  });
});

describe("getOrganisationIdController", () => {
  //test 1 réussite 200
  it("getId : doit retourner 200 avec l'organisation", async () => {
    const organisation = {
      id: 1,
      nom: "OpenAI",
    };

    (getOrganisationIdService as jest.Mock).mockResolvedValue(organisation);

    const req = {
      params: {
        id: "1",
      },
    } as unknown as Request;

    const res = mockResponse();

    await getOrganisationIdController(req, res);

    expect(getOrganisationIdService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(organisation);
  });

  //test 2 erreur 400
  it("getId : doit retourner 400 si l'id est invalide", async () => {
    const req = {
      params: {
        id: "abc",
      },
    } as unknown as Request;

    const res = mockResponse();

    await getOrganisationIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "ID invalide",
    });
  });

  //test 3 erreur 404
  it("getId : doit retourner 404 si l'organisation n'existe pas", async () => {
    (getOrganisationIdService as jest.Mock).mockResolvedValue(null);
    const req = {
      params: {
        id: "1",
      },
    } as unknown as Request;

    const res = mockResponse();

    await getOrganisationIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Organisation non trouvé",
    });
  })

  //test 4 erreur 500
  it("getId : doit retourner 500 si le service lance une erreur", async () => {
    (getOrganisationIdService as jest.Mock).mockRejectedValue(
      new Error("Erreur DB"),
    );

    const req = {
      params: {
        id: "1",
      },
    } as unknown as Request;

    const res = mockResponse();

    await getOrganisationIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur interne du serveur",
    });
  });
});

describe("postOrganisationController", () => {
  //test 1 réussite 200
  it("post : doit retourner 200 avec la nouvelle organisation", async () => {
    const data = {
      nom: "OpenAI",
    };

    const organisation = {
      id: 1,
      nom: "OpenAI",
    };

    (postOrganisationService as jest.Mock)
      .mockResolvedValue(organisation);

    const req = {
      body: data,
    } as Request;

    const res = mockResponse();

    await postOrganisationController(req, res);

    expect(postOrganisationService)
      .toHaveBeenCalledWith(data);

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith(organisation);
  });


  //test 2 erreur 500
  it("post : doit retourner 500 si le service échoue", async () => {
    (postOrganisationService as jest.Mock)
      .mockRejectedValue(new Error("Erreur DB"));

    const req = {
      body: {},
    } as Request;

    const res = mockResponse();

    await postOrganisationController(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(500);

    expect(res.json)
      .toHaveBeenCalledWith({
        message: "Erreur interne du serveur",
      });
  });
});

describe("putOrganisationController", () => {
  //test 1 réussite 200
  it("put : doit retourner 200 après modification", async()=>{
  const organisation={
    id:1,
    nom:"Nouvelle organisation"
  };

  (putOrganisationService as jest.Mock)
  .mockResolvedValue(organisation);

  const req={
    params:{
      id:"1"
    },
    body:{
      nom:"Nouvelle organisation"
    }
  } as unknown as Request;

  const res=mockResponse();

  await putOrganisationController(req,res);

  expect(putOrganisationService)
  .toHaveBeenCalledWith(
    1,
    req.body
  );
  expect(res.status)
  .toHaveBeenCalledWith(200);

  expect(res.json)
  .toHaveBeenCalledWith(organisation);
  });

  //test 2 erreur 400
  it("put : doit retourner 400 si l'id est invalide", async () => {

  const req = {
    params:{
      id:"abc"
    },
    body:{
      nom:"test"
    }
  } as unknown as Request;

  const res = mockResponse();
  await putOrganisationController(req,res);

  expect(res.status)
  .toHaveBeenCalledWith(400);

  expect(res.json)
    .toHaveBeenCalledWith({
      message:"ID invalide"
    });
  });

  //test 3 erreur 404
  it("put : doit retourner 404 si organisation inexistante", async()=>{
  (putOrganisationService as jest.Mock)
  .mockResolvedValue(null);

  const req={
    params:{
      id:"1"
    },
    body:{}
  } as unknown as Request;

    const res = mockResponse();

    await putOrganisationController(req, res);

  expect(res.status)
  .toHaveBeenCalledWith(404);

  expect(res.json)
  .toHaveBeenCalledWith({
    messsage:"Organisation non trouvé"
  });

  });

  //test 4 erreur 500
  it("put : doit retourner 500 si le service échoue", async()=>{

  (putOrganisationService as jest.Mock)
  .mockRejectedValue(new Error());

  const req={
    params:{
      id:"1"
    },
    body:{}
  } as unknown as Request;

  const res=mockResponse();

  await putOrganisationController(req,res);

  expect(res.status)
  .toHaveBeenCalledWith(500);
  });

  describe("deleteOrganisationController", () => {
    //test 1 réussite 200
    it("delete : doit retourner 200 après suppression", async()=>{

    const organisation={
     id:1,
     nom:"OpenAI"
    };

    (deleteOrganisationService as jest.Mock)
    .mockResolvedValue(organisation);

    const req={
     params:{
      id:"1"
     }
    } as unknown as Request;

    const res=mockResponse();

    await deleteOrganisationController(req,res);

    expect(deleteOrganisationService)
    .toHaveBeenCalledWith(1);

    expect(res.status)
    .toHaveBeenCalledWith(200);

    expect(res.json)
    .toHaveBeenCalledWith(organisation);
    });

  //test 2 erreur 400
  it("delete : doit retourner 400 si id invalide", async()=>{

  const req={
   params:{
    id:"abc"
   }
  } as unknown as Request;

  const res=mockResponse();

  await deleteOrganisationController(req,res);

  expect(res.status)
  .toHaveBeenCalledWith(400);

  });

  //test 3 erreur 404
  it("delete : doit retourner 404 si organisation inexistante", async()=>{

  (deleteOrganisationService as jest.Mock)
  .mockResolvedValue(null);

  const req={
   params:{
    id:"1"
   }
  } as unknown as Request;

  const res = mockResponse();

  await deleteOrganisationController(req,res);

  expect(res.status)
  .toHaveBeenCalledWith(404);
  });

  //test 4 erreur 500
  it("delete : doit retourner 500 si le service échoue", async () => {

  (deleteOrganisationService as jest.Mock)
  .mockRejectedValue(new Error());

  const req={
   params:{
    id:"1"
   }
  } as unknown as Request;

  const res=mockResponse();

  await deleteOrganisationController(req,res);

  expect(res.status)
  .toHaveBeenCalledWith(500);
  });
  });
});
