export interface ISala {
    id:number;
    fecha:Date;
    cupo:number;
    link:string;
    usuarioId:string;
    nombreUsuario:string;
}

export interface INewSala{
    fecha:Date;
    cupo:number;
    link:string;
    usuarioId:string;
}