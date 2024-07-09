import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/shared/interfaces/user";

interface UsersState {
	users: User[];
}

const initialState: UsersState = {
	users: [],
};

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		setUsers: (state, action: PayloadAction<User[]>) => {
			state.users = action.payload;
		},
		addUser: (state, action: PayloadAction<User>) => {
			state.users.push(action.payload);
		},
	},
});

export const { setUsers, addUser } = usersSlice.actions;

export default usersSlice.reducer;
