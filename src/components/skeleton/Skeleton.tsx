import React from "react";
import classNames from "classnames";

const Skeleton = () => {
	return (
		<div className="animate-pulse space-y-4">
			<div className="flex items-center gap-3">
				<div className="bg-gray-300 h-6 w-24 rounded"></div>
				<div className="bg-gray-300 h-10 w-64 rounded"></div>
			</div>
			<div className="flex mt-8 justify-between">
				<div className="mr-3">
					<div className="bg-gray-300 h-36 w-36 rounded-lg"></div>
					<div className="bg-gray-300 h-4 w-32 mt-1 rounded"></div>
				</div>
				<div className="grid grid-cols-2 grid-rows-2 gap-2 w-full">
					<div className="flex flex-col gap-1">
						<div className="bg-gray-300 h-6 w-32 rounded"></div>
						<div className="bg-gray-300 h-10 w-full rounded"></div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="bg-gray-300 h-6 w-32 rounded"></div>
						<div className="bg-gray-300 h-10 w-full rounded"></div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="bg-gray-300 h-6 w-32 rounded"></div>
						<div className="bg-gray-300 h-10 w-full rounded"></div>
					</div>
					<div className="flex flex-col gap-1">
						<div className="bg-gray-300 h-6 w-32 rounded"></div>
						<div className="bg-gray-300 h-10 w-full rounded"></div>
					</div>
				</div>
			</div>
			<div className="w-full flex justify-end mt-4">
				<div className="bg-gray-300 h-10 w-32 rounded"></div>
				<div className="bg-gray-300 h-10 w-32 ml-2 rounded"></div>
			</div>
		</div>
	);
};

export default Skeleton;
