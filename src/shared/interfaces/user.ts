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
		| "avatar"
		| "role"
	>;
};

export interface FetchUsersResponse {
	data: {
		data: InternalUser;
		links: {
			first: string;
			last: string;
			prev: string | null;
			next: string | null;
		};
		meta: {
			current_page: number;
			from: number;
			last_page: number;
			links: Array<{
				url: string | null;
				label: string;
				active: boolean;
			}>;
			path: string;
			per_page: number;
			to: number;
			total: number;
		};
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
	theme?: string;
	link?: string;
}

export interface FetchUsersParams {
	limit?: number;
	page?: number;
	search?: string;
	with_blocked?: string;
}
