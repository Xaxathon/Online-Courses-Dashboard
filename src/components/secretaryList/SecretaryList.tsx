import React from "react";
import SecretaryItem from "../secretaryItem/SecretaryItem";

const SecretaryList = () => {
	return (
		<ul className="flex flex-col gap-3 overflow-y-auto h-[80vh]">
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
