import { Request, Response, NextFunction } from "express"; 
import  { Projeto }  from "../models/Projeto";
import { ProjetoDash } from "../interface/Projeto.interface";

export const dashboard = async (req: Request, res: Response) => {
    try {

        const userId = req.query.userId;
    
        if (!userId) {
          return res.status(400).json({ erro: 'É necessário fornecer um userId na solicitação.' });
        }
    
        const dataFormatada = new Date().toLocaleDateString('pt-BR')
        const datahoje = new Date()
    
    
        //PEGA TODO O TEMPO APONTADO HOJE E TODO TEMPO APOSTANDO HOJE POR PROJETO
        const projetosDia = await Projeto.find({ 
          $and: [
            { "tempoGasto.data": dataFormatada },
            { userId: userId }
          ]
        })
    
          let tempoHoje:number = 0
    
          projetosDia.forEach(projeto => {
            projeto.tempoGasto.forEach(tempoGasto =>{
              if(tempoGasto.data == dataFormatada && tempoGasto.tempo){
                tempoHoje += tempoGasto.tempo
              }
            })
          })
    
        //PEGA TODO O TEMPO APONTADO NO MÊS
        const projetosMês = await Projeto.find({
          $and: [
            { "tempoGasto.data": { $regex: `${dataFormatada.slice(3, 10)}.*` }},
            { userId: userId }
          ]
        })
    
        let tempoMes:number = 0
    
        projetosMês.forEach(projeto => {
         projeto.tempoGasto.forEach(tempoGasto =>{
          if(tempoGasto.tempo){
            tempoMes += tempoGasto.tempo
          }
         })
        })
    
    
        //PEGA TODO O TEMPO APONSTADO NA SEMANA
        let tempoSemana:number = 0
        const semanaTempo = []
        const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        let tempo:number = 0
    
        for (const dia of diasDaSemana){
          datahoje.setDate(datahoje.getDate() - 1);
          const dataFind = new Date(datahoje).toLocaleDateString('pt-BR')
          const projetosDia = await Projeto.find({
            $and: [
              { "tempoGasto.data": dataFind },
              { userId: userId }
            ]
          })
    
          projetosDia.forEach(projeto => {
            projeto.tempoGasto.forEach(tempoGasto => {
              if(tempoGasto.data == dataFind && tempoGasto.tempo){
                tempo += tempoGasto.tempo
              }
            });
          })
    
          semanaTempo.push({
            nome: diasDaSemana[datahoje.getDay()],
            tempo: tempo
          })
       
          tempoSemana += tempo
          tempo = 0
        }
          
        const response = {
          semanaTempo,
          tempoSemana: new Date(tempoSemana * 1000).toISOString().substr(11, 8),
          tempoMes: new Date(tempoMes * 1000).toISOString().substr(11, 8),
          tempoHoje: new Date(tempoHoje * 1000).toISOString().substr(11, 8),
        }
    
        res.json(response);
      } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro ao listar os documentos' });
      }

}