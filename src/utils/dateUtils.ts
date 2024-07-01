import dayjs from "dayjs";

export const getStartOfMonth = (date: Date): string => {
	return dayjs(date).startOf("month").format("YYYY-MM-DD");
};

export const getEndOfMonth = (date: Date): string => {
	return dayjs(date).endOf("month").format("YYYY-MM-DD");
};
