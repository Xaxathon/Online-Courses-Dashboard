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
		<div>
			<h2 className="mb-2">Прикрепить файл совещания</h2>
			<label
				htmlFor="file-upload"
				className="flex cursor-pointer justify-between items-center p-3 border rounded-lg w-full border-mainPurple"
			>
				<FileUploadIcon />
				<p className="text-[14px] text-start leading-normal font-normal w-[252px] text-black">
					Выберите файл или перетащите сюда
				</p>
				<span className="flex border border-mainPurple justify-center items-center bg-custom-gradient text-center px-3 py-1 text-black font-normal uppercase text-[10px] rounded-lg">
					выбрать файл
				</span>
			</label>
			<input
				id="file-upload"
				type="file"
				className="hidden"
				onChange={handleFileChange}
			/>
			{fileName && (
				<div className="mt-2 flex items-center text-gray-400 space-x-2 font-normal text-[12px]">
					<Mp4Icon />
					<span className="text-black">{fileName}</span>
					<span>•</span>
					<span>{formatFileSize(fileSize)} МБ</span>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
