import { Router } from "express";
import { adicionar, editar, excluir, listar } from "../api/projeto.controller";

const projetoRouter = Router();

projetoRouter.post("/", adicionar);
projetoRouter.get("/list", listar);
projetoRouter.delete("/:id", excluir);
projetoRouter.put("/:id", editar);

export default projetoRouter;