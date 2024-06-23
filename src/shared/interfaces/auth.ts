import { IUser } from "./user";

export interface ILoginResponse {
	token: string;
	expires_in: number;
}

export interface ILoginRequest {
	email: string;
	password: string;
}

export interface IAuthState {
	token: string | null;
	user: IUser | null;
}
