import React from "react";
import SecretaryItem from "../secretaryItem/SecretaryItem";

const SecretaryList = () => {
	return (
		<ul className="w-full space-y-3  overflow-y-auto max-h-[550px] p-5 ">
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
		</ul>
	);
};

export default SecretaryList;
