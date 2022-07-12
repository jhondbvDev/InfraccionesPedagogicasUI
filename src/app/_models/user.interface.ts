export interface IUser {
  username: string;
  password: string;
}

export interface IUserInfo {
  id: string;
  name: string;
  email: string;
  rol:string;
  type:string;
}

export interface INewUserInfo{
  username: string;
  email: string;
  password: string
  rol: string
}