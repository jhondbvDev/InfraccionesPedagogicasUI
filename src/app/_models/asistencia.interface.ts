export interface IAsistencia {
    id:number;
    infractorId:string;
    asistio:boolean;
    salaId:number;
}

export interface IAsistenciaDeep {
    id:number;
    nombreInfractor:string;
    asistio:boolean;
}

export interface IUpdateAsistencia {
    id:number;
    asistio:boolean;
}

