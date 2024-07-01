export enum UserRole {
	Admin = "admin",
	Manager = "manager",
	Secretary = "secretary",
	External = "external",
}

export interface BaseUser {
	id: number;
	full_name: string;
	email: string;
	password: string;
	department: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	avatar: string;
	role: UserRole;
}

export interface ExternalUser {
	id?: number;
	full_name: string;
	email?: string;
	external: true;
	role: UserRole.External;
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
		| "department"
		| "is_active"
		| "created_at"
		| "updated_at"
		| "avatar"
		| "role"
	>;
};

export interface FetchUsersResponse {
	data: {
		data: InternalUser;
	};
}

export type CreateUserRequest = ExternalUser | InternalUser;

export interface FormValues {
	full_name: string;
	department: string;
	email: string;
	password: string;
	avatar?: File;
	is_active?: boolean;
}
