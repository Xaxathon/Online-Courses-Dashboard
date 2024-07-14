import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
	message: string;
	isVisible: boolean;
	protocolId?: number;
}

const initialState: NotificationState = {
	message: "",
	isVisible: false,
	protocolId: undefined,
};

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		showNotification: (
			state,
			action: PayloadAction<{ message: string; protocolId?: number }>
		) => {
			state.message = action.payload.message;
			state.protocolId = action.payload.protocolId;
			state.isVisible = true;
		},
		hideNotification: (state) => {
			state.isVisible = false;
			state.protocolId = undefined;
		},
	},
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
