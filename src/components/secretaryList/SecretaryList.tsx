import React from "react";
import SecretaryItem from "../secretaryItem/SecretaryItem";

const SecretaryList = () => {
	return (
		<div className="flex flex-col space-y-3 items-center overflow-y-auto  h-[85vh] rounded-lg">
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
			<SecretaryItem />
		</div>
	);
};

export default SecretaryList;
