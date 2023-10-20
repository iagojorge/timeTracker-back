export interface Filtro {
    _id: string,
    nome: string,
    tempoGasto: [{
        data: string,
        tempo: number
    }],
    userId: string, 
  }
  
 
