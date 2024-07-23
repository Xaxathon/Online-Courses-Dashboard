import { Rectangle } from "recharts";

type Radius = number | [number, number, number, number];
interface CustomBarProps {
	fill?: string;
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	radius?: Radius;
}

const CustomBar = ({
	fill = "#000",
	x = 0,
	y = 0,
	width = 0,
	height = 0,
	radius = [0, 0, 0, 0],
}: CustomBarProps) => {
	const rectRadius: [number, number, number, number] = Array.isArray(radius)
		? radius.length === 4
			? radius
			: [0, 0, 0, 0]
		: [radius, radius, radius, radius];

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
