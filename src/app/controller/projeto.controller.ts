import { Request, Response } from "express";
import  { Projeto }  from "../models/Projeto";


export const adicionar = async (req: Request, res: Response) => {
    const { nome, userId } = req.body;

    //validations
    if (!nome) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }

   // create projeto
   const projeto = new Projeto({
    nome, 
    userId
  });

  try {
    await projeto.save();
    res.status(201).json({ msg: "Projeto criado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Erro no servidor, tente novamente mais tarde!" });
  }
}

export const editar = async (req: Request, res: Response) => {
    const id = req.params.id
  
    const projeto = {
      nome: req.body.nome,
      tempoGasto: req.body.tempoGasto
    }
  
    const updatedProjeto = await Projeto.findByIdAndUpdate(id, projeto)
    
    if(!updatedProjeto){
      return res.status(404).json({msg: "Projeto não encontrado!"})
    }
  
    res.status(200).json({projeto, msg:"Projeto atualizado com sucesso"})  
}

export const listar = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
        }

        const projetos = await Projeto.find({ userId: userId });

        if (projetos.length === 0) {
            return res.status(404).json({ erro: 'Nenhum projeto encontrado para o userId especificado.' });
        }

        res.json(projetos);
        } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
        }
}

export const excluir = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
    
        const projeto = await Projeto.findById(id)
    
        if(!projeto){
          return res.status(404).json({msg: "Projeto não encontrado!"})
        }
    
        const deletedProjeto = await Projeto.findByIdAndDelete(id)
    
        res.status(200).json({deletedProjeto, msg: "Projeto deletado com sucesso!"})
        
      } catch (error) {
        
      }
}