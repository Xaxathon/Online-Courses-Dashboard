import { InternalUser, User } from "../shared/interfaces/user";

export const getCurrentSecretaryIndex = (
	secretaries: InternalUser[],
	selectedSecretaryId: number | null
): number => {
	return secretaries.findIndex(
		(secretary) => secretary.id === selectedSecretaryId
	);
};

export const getPreviousSecretaryId = (
	secretaries: InternalUser[],
	selectedSecretaryId: number | null
): number | null => {
	const currentIndex = getCurrentSecretaryIndex(
		secretaries,
		selectedSecretaryId
	);
	return currentIndex > 0 ? secretaries[currentIndex - 1].id : null;
};

export const getNextSecretaryId = (
	secretaries: InternalUser[],
	selectedSecretaryId: number | null
): number | null => {
	const currentIndex = getCurrentSecretaryIndex(
		secretaries,
		selectedSecretaryId
	);
	return currentIndex !== -1 && currentIndex < secretaries.length - 1
		? secretaries[currentIndex + 1].id
		: null;
};

export const filterInternalUsers = (users: User[]): InternalUser[] => {
	return users.filter((user): user is InternalUser => !user.external);
};
