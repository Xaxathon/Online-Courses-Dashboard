export interface IUser {
	id: number;
	full_name: string;
	email: string;
	login: string;
	department: string;
	avatar: string;
	password?: string;
}

export interface IUpdateUserRequest {
	id: number;
	full_name?: string;
	email?: string;
	login?: string;
	department?: string;
	avatar?: File | null;
	password?: string;
}
