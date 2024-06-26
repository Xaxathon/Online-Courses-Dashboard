import { UserRole, BaseUser } from "./user";

export interface LoginResponse {
	data: {
		token: string;
		expires_in: number;
		id: number;
		avatar: string;
		created_at: string;
		department: string;
		email: string;
		full_name: string;
		login: string;
		role: UserRole;
		updated_at: string;
	};
	status: string;
	message: string[];
	errors: Record<string, any>;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthState {
	token: string | null;
	role: UserRole | null;
	user: Partial<BaseUser> | null;
}

export interface LoginFormValues {
	email: string;
	password: string;
	submit?: string;
}
