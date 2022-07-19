export interface IResponse{
    data:any;
    status:number;//enum in api Success=0 Error =1
    errorMessage:string;
}