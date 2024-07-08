import React from "react";
import { Rectangle } from "recharts";

const CustomBar = ({
	fill = "#000",
	x = 0,
	y = 0,
	width = 0,
	height = 0,
	radius = [0, 0, 0, 0],
}) => {
	const rectRadius: any = radius.length === 4 ? radius : [0, 0, 0, 0];

	return (
		<Rectangle
			fill={fill}
			x={x}
			y={y}
			width={width}
			height={height}
			radius={rectRadius}
			stroke="none"
		/>
	);
};

export default CustomBar;
