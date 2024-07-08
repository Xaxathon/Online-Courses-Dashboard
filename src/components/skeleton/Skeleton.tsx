interface Skeleton {
	width?: string;
	height?: string;
	className?: string;
}
const Skeleton = ({ width, height, className }: Skeleton) => {
	return (
		<div
			className={`animate-pulse bg-gray-300 ${
				width ? `w-${width}` : "w-full"
			} ${height ? `h-${height}` : `h-${height}`} ${className}`}
		></div>
	);
};

export default Skeleton;
