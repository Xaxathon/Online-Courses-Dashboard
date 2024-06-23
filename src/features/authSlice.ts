// authSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	token: string | null;
	role: string | null;
	user: {
		id: string | null;
		full_name?: string;
		email?: string;
		login?: string;
		department?: string;
		is_active?: boolean;
		created_at?: string;
		updated_at?: string;
		avatar?: string;
		role?: string;
	} | null;
}

const initialState: AuthState = {
	token: localStorage.getItem("token"),
	role: localStorage.getItem("role"),
	user: {
		id: localStorage.getItem("userId"),
		full_name: "",
		email: "",
		login: "",
		department: "",
		is_active: false,
		created_at: "",
		updated_at: "",
		avatar: "",
		role: "",
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			localStorage.setItem("token", action.payload);
		},
		setRole(state, action: PayloadAction<string>) {
			state.role = action.payload;
			localStorage.setItem("role", action.payload);
		},
		setUserId(state, action: PayloadAction<string>) {
			state.user.id = action.payload;
			localStorage.setItem("userId", action.payload);
		},
		setUser(state, action: PayloadAction<AuthState["user"]>) {
			state.user = action.payload;
			localStorage.setItem("user", JSON.stringify(action.payload));
		},
		logout(state) {
			state.token = null;
			state.role = null;
			state.user = { id: null };
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			localStorage.removeItem("userId");
			localStorage.removeItem("user");
		},
	},
});

export const { setToken, setRole, setUserId, setUser, logout } =
	authSlice.actions;

export default authSlice.reducer;
