import React, { useState, ChangeEvent } from "react";
import FileUploadIcon from "@assets/icons/fileUploadIcon.svg";
import Mp4Icon from "@assets/icons/mp4Icon.svg";

const FileUpload: React.FC = () => {
	const [fileName, setFileName] = useState<string | null>(null);
	const [fileSize, setFileSize] = useState<number | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setFileName(file.name);
			setFileSize(file.size);
		}
	};

	const formatFileSize = (size: number | null) => {
		if (size === null) return "";
		return (size / (1024 * 1024)).toFixed(2);
	};

	return (
		<div className="mt-14 px-16">
			<h2 className="mb-2">Прикрепить файл совещания</h2>
			<label
				htmlFor="file-upload"
				className="flex flex-shrink-0 flex-grow cursor-pointer justify-between gap-1 items-center py-3 px-4 border rounded-lg w-full border-mainPurple"
			>
				<FileUploadIcon className="w-10 h-10" />
				<p className="text-xs text-start font-normal text-black">
					Выберите файл или перетащите сюда
				</p>
				<button className="border border-mainPurple bg-custom-gradient text-center px-3 py-1 text-black font-normal uppercase text-[0.5rem] rounded-lg">
					выбрать файл
				</button>
			</label>
			<input
				id="file-upload"
				type="file"
				className="hidden"
				onChange={handleFileChange}
			/>
			{fileName && (
				<div className="mt-2 flex items-center text-gray-400 gap-2 font-normal text-xs px-2">
					<Mp4Icon className="w-5 h-5" />
					<span className="text-black">{fileName}</span>
					<span>•</span>
					<span>{formatFileSize(fileSize)} МБ</span>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
