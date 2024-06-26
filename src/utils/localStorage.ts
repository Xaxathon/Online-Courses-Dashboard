export const setItem = (key: string, value: string): void => {
	localStorage.setItem(key, value);
};

export const getItem = (key: string): string | null => {
	return localStorage.getItem(key);
};

export const removeItem = (key: string): void => {
	localStorage.removeItem(key);
};

export const parseItem = <T>(key: string): T | null => {
	const item = localStorage.getItem(key);
	if (item) {
		try {
			return JSON.parse(item) as T;
		} catch {
			return null;
		}
	}
	return null;
};
