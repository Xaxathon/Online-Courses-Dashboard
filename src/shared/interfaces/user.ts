export enum UserRole {
	Admin = "admin",
	Manager = "manager",
	Secretary = "secretary",
}

export interface BaseUser {
	id: number; // Изменено на number
	full_name: string;
	email: string;
	password: string;
	login: string;
	department: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	avatar: string;
	role: UserRole;
}

export interface ExternalUser {
	full_name: string;
	external: true;
}

export interface InternalUser extends BaseUser {
	external: false;
}

export type User = ExternalUser | InternalUser;

export type UserResponse = {
	data: Pick<
		BaseUser,
		| "id"
		| "password"
		| "full_name"
		| "email"
		| "login"
		| "department"
		| "is_active"
		| "created_at"
		| "updated_at"
		| "avatar"
		| "role"
	>;
};

export type FetchUserResponse = {
	user: UserResponse;
};
export type CreateUserRequest = ExternalUser | InternalUser;

export interface FormValues {
	full_name: string;
	department: string;
	login: string;
	email: string;
	password: string;
	avatar?: File;
	is_active?: boolean;
}
