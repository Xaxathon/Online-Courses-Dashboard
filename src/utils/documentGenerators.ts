export const handleGeneratePDF = async (
	generatePDF: any,
	id: string | number
) => {
	try {
		const blobUrl = await generatePDF(Number(id)).unwrap();
		const link = document.createElement("a");
		link.href = blobUrl;
		link.setAttribute("download", `protocol_${id}.pdf`);
		document.body.appendChild(link);
		link.click();
		link.remove();

		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Failed to generate PDF:", error);
	}
};

export const handleGenerateDOCX = async (
	generateDOCX: any,
	id: string | number
) => {
	try {
		const blobUrl = await generateDOCX(Number(id)).unwrap();
		const link = document.createElement("a");
		link.href = blobUrl;
		link.setAttribute("download", `protocol_${id}.docx`);
		document.body.appendChild(link);
		link.click();
		link.remove();

		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Failed to generate DOCX:", error);
	}
};
