import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

interface StatWidgetProps {
	title: string;
	inProcess: number;
	success: number;
}

const StatWidget = ({ title, inProcess, success }: StatWidgetProps) => {
	const total = inProcess + success;
	const inProcessPercentage = total > 0 ? (inProcess / total) * 100 : 0;
	const successPercentage = total > 0 ? (success / total) * 100 : 0;

	return (
		<div className="shadow bg-white rounded-lg px-3 py-2">
			<div className="xl:text-sm lg:text-xs text-[0.5rem]">{title}</div>
			<div className="flex gap-5">
				<div className="flex gap-1 flex-col text-xs font-bold mt-1">
					<div className="flex items-center">
						<p className="xl:text-xs text-[0.5rem] font-medium">В процессе</p>
						<span className="ml-2 text-mainPurple">{inProcess}</span>
					</div>
					<div className="flex items-center">
						<p className="xl:text-xs text-[0.5rem] font-medium">Готово</p>
						<span className="ml-2 text-gardenGreen">{success}</span>
					</div>
				</div>
				<div className="relative w-12 h-12">
					<CircularProgressbarWithChildren
						value={successPercentage}
						styles={buildStyles({
							pathColor: "#779F7C",
							trailColor: "transparent",
							strokeLinecap: "round",
						})}
						strokeWidth={15}
					>
						<div
							style={{
								width: "60%",
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
							}}
						>
							<CircularProgressbarWithChildren
								value={inProcessPercentage}
								styles={buildStyles({
									pathColor: "#A964D3",
									trailColor: "transparent",
									strokeLinecap: "round",
								})}
								strokeWidth={20}
							/>
						</div>
					</CircularProgressbarWithChildren>
				</div>
			</div>
		</div>
	);
};

export default StatWidget;
