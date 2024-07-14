import { ChangeEvent, DragEvent, Dispatch, SetStateAction } from "react";

export const allowedFileTypes = [
	"video/mp4",
	"video/x-msvideo",
	"video/quicktime",
	"video/x-ms-wmv",
	"video/x-matroska",
	"video/x-flv",
	"video/x-m4v",
	"video/webm",
	"video/ogg",
];

export const handleFileChange = (
	event: ChangeEvent<HTMLInputElement>,
	setFile: Dispatch<SetStateAction<File | null>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	setError(null);
	if (event.target.files && event.target.files.length > 0) {
		const file = event.target.files[0];
		if (allowedFileTypes.includes(file.type)) {
			setFile(file);
		} else {
			setFile(null);
			setError(
				"Неподдерживаемый тип файла. Пожалуйста, выберите допустимый видеофайл."
			);
		}
	}
};

export const handleDragOver = (
	event: DragEvent<HTMLLabelElement>,
	setIsDragging: Dispatch<SetStateAction<boolean>>
) => {
	event.preventDefault();
	event.stopPropagation();
	setIsDragging(true);
};

export const handleDragLeave = (
	event: DragEvent<HTMLLabelElement>,
	setIsDragging: Dispatch<SetStateAction<boolean>>
) => {
	event.preventDefault();
	event.stopPropagation();
	setIsDragging(false);
};

export const handleDrop = (
	event: DragEvent<HTMLLabelElement>,
	setFile: Dispatch<SetStateAction<File | null>>,
	setIsDragging: Dispatch<SetStateAction<boolean>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	event.preventDefault();
	event.stopPropagation();
	setIsDragging(false);
	setError(null);

	if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
		const file = event.dataTransfer.files[0];
		if (allowedFileTypes.includes(file.type)) {
			setFile(file);
		} else {
			setFile(null);
			setError(
				"Неподдерживаемый тип файла. Пожалуйста, выберите допустимый видеофайл."
			);
		}
		event.dataTransfer.clearData();
	}
};
