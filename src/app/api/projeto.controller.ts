import { Request, Response } from "express";
import { ProjectFilter } from "../../shared/filters/project.filter";
import { ProjectDashboard } from "../../shared/types/project.dashboard";
import { Project, TimeSpent } from "../models/Project";

export const adicionar = async (req: Request, res: Response) => {
  const { nome, userId } = req.body;

  //validations
  if (!nome) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }

  // create projeto
  const projeto = new Project({
    nome,
    userId,
  });

  try {
    await projeto.save();
    res.status(201).json({ msg: "Projeto criado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
};

export const editar = async (req: Request, res: Response) => {
  const id = req.params.id;

  const projetoTempo = await Project.findById(id);

  if (req.body.tempoGasto) {
    projetoTempo?.timeSpent.push(req.body.tempoGasto);
  }

  const projeto = {
    nome: req.body.nome,
    tempoGasto: projetoTempo?.timeSpent,
  };

  const updatedProjeto = await Project.findByIdAndUpdate(id, projeto);

  if (!updatedProjeto) {
    return res.status(404).json({ msg: "Projeto não encontrado!" });
  }

  res.status(200).json({ projeto, msg: "Projeto atualizado com sucesso" });
};

export const listar = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const filtro = req.query.filtro;

    let projetos: ProjectFilter[] = [];

    if (!userId) {
      return res
        .status(400)
        .json({ erro: "É necessário fornecer um userId na solicitação." });
    }

    if (filtro) {
      const filtroString =
        typeof filtro === "string" ? filtro : filtro.toString();
      projetos = await Project.find({
        userId: userId,
        nome: { $regex: new RegExp(filtroString, "i") },
      });
    } else {
      projetos = await Project.find({ userId: userId });
    }

    let tempoProjeto: number = 0;
    let tempoHojeP: number = 0;
    const dataFormatada = new Date().toLocaleDateString("pt-BR");
    const projetoTempo: ProjectDashboard[] = [];

    projetos.forEach((projeto) => {
      projeto.timeSpent.forEach((tempoGasto: TimeSpent) => {
        if (tempoGasto.time) {
          if (tempoGasto.date == dataFormatada) {
            tempoHojeP += tempoGasto.time;
          }
          tempoProjeto += tempoGasto.time;
        }
      });
      if (projeto.name) {
        projetoTempo.push({
          name: projeto.name,
          totalDuration: tempoProjeto,
          durationToday: tempoHojeP,
          id: projeto.id,
        });
      }
      tempoProjeto = 0;
      tempoHojeP = 0;
    });

    const dto = {
      projetoTempo: projetoTempo,
      projetos: projetos,
    };

    res.json(dto);
  } catch (error) {
    res.status(500).json({ erro: "Ocorreu um erro ao listar os documentos" });
  }
};

export const excluir = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const projeto = await Project.findById(id);

    if (!projeto) {
      return res.status(404).json({ msg: "Projeto não encontrado!" });
    }

    const deletedProjeto = await Project.findByIdAndDelete(id);

    res
      .status(200)
      .json({ deletedProjeto, msg: "Projeto deletado com sucesso!" });
  } catch (error) {}
};
