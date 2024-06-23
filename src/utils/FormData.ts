export const createFormData = (
	originalData: any,
	updatedData: any
): FormData => {
	const formData = new FormData();
	Object.keys(updatedData).forEach((key) => {
		if (
			updatedData[key] !== originalData[key] &&
			updatedData[key] !== undefined &&
			updatedData[key] !== null
		) {
			formData.append(key, updatedData[key]);
		}
	});
	return formData;
};

export const createUpdateUserFormData = (
	originalData: any,
	updatedData: any
): FormData => {
	const formData = createFormData(originalData, updatedData);
	formData.append("_method", "PUT");
	return formData;
};
