import React from "react";
import SecretaryForm from "../secretaryForm/SecretaryForm";

const SecretariesListForm = () => {
	return (
		<div className="max-w-[1064px] mx-auto">
			<SecretaryForm />
			<SecretaryForm />
			<SecretaryForm />
			<SecretaryForm />
		</div>
	);
};

export default SecretariesListForm;
