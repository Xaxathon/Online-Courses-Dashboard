import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/shared/interfaces/auth";
import { UserRole } from "@/shared/interfaces/user";

const initialState: AuthState = {
	token: localStorage.getItem("token"),
	role: localStorage.getItem("role") as UserRole | null,
	user: {
		id: localStorage.getItem("userId")
			? parseInt(localStorage.getItem("userId")!, 10)
			: undefined,
		role: undefined,
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
		setRole(state, action: PayloadAction<UserRole>) {
			state.role = action.payload;
			localStorage.setItem("role", action.payload);
		},
		setUserId(state, action: PayloadAction<number>) {
			if (state.user) {
				state.user.id = action.payload;
			} else {
				state.user = { id: action.payload };
			}
			localStorage.setItem("userId", action.payload.toString());
		},
		logout(state) {
			state.token = null;
			state.role = null;
			state.user = { id: undefined };
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			localStorage.removeItem("userId");
			localStorage.removeItem("user");
		},
	},
});

export const { setToken, setRole, setUserId, logout } = authSlice.actions;

export default authSlice.reducer;
