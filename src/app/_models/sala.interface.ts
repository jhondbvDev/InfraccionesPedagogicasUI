export interface ISala {
    id:number;
    fecha:Date;
    cupo:number;
    totalCupo:number;
    link:string;
    usuarioId:string;
    nombreUsuario:string;
}

export interface INewSala{
    fecha:Date;
    cupo:number;
    totalCupo:number;
    link:string;
    usuarioId:string;
}

export interface IEditSala{
    id:number;
    fecha:Date;
    totalCupo:number;
    link:string;
}