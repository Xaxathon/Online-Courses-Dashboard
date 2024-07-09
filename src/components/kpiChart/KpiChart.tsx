import React from "react";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import styled from "styled-components";
import CustomBar from "./CustomBar";

import { KpiTasksStatsData } from "@/shared/interfaces/stats";

interface KpiChartProps {
	data: KpiTasksStatsData[];
}

const KpiChart: React.FC<KpiChartProps> = ({ data }) => {
	const formattedData = data.map((item) => ({
		...item,
		week: `${item.week} неделя`,
	}));

	// Я убрал ошибку в консоли, потому что она внутри самой библиотеки

	const error = console.error;
	console.error = (...args: any) => {
		if (/defaultProps/.test(args[0])) return;
		error(...args);
	};

	return (
		<Container>
			<Header>
				<Title>KPI</Title>
				<LegendContainer>
					<LegendItem>
						<LegendCircle color="#97B49A" />
						<span className="xl:text-sm text-xs">Готово</span>
					</LegendItem>
					<LegendItem>
						<LegendCircle color="#A964D3" />
						<span className="xl:text-sm text-xs">В процессе</span>
					</LegendItem>
					<LegendItem>
						<LegendCircle color="#D46666" />
						<span className="xl:text-sm text-xs">Просрочено</span>
					</LegendItem>
				</LegendContainer>
			</Header>

			<ResponsiveContainer width="100%" height="75%">
				<BarChart data={formattedData} barCategoryGap="10%" barGap={10}>
					<CartesianGrid vertical={false} strokeDasharray="2 3" />
					<XAxis dataKey="week" />
					<YAxis axisLine={false} tickLine={false} />
					<Tooltip />
					<Bar
						dataKey="in_process"
						fill="#A964D3"
						shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
					/>
					<Bar
						dataKey="success"
						fill="#97B49A"
						shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
					/>
					<Bar
						dataKey="expired"
						fill="#D46666"
						shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
					/>
				</BarChart>
			</ResponsiveContainer>
		</Container>
	);
};

export default KpiChart;

const Container = styled.div`
	width: 100%;
	max-width: 29.8125rem;
	height: 18rem;
	background-color: white;
	border-radius: 0.625rem;
	padding: 1.25rem;
	box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.1);

	@media (max-width: 768px) {
		max-width: 100%;
		padding: 1rem;
		height: 16rem;
	}
	font-family: "Poppins", sans-serif;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

const Title = styled.h2`
	font-size: 1.5rem;
	font-weight: bold;
	color: #7130a3;

	@media (max-width: 1280px) {
		font-size: 1.4rem;
		margin-bottom: 0.75rem;
	}
`;

const LegendContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 768px) {
		width: 100%;
		justify-content: flex-start;
	}
`;

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 1rem;
	background-color: #fafafa;
	padding: 0.125rem 0.4375rem;
	border-radius: 0.5rem;

	@media (max-width: 768px) {
		margin-right: 0.5rem;
	}
`;

const LegendCircle = styled.div<{ color: string }>`
	width: 0.625rem;
	height: 0.625rem;
	background-color: ${({ color }) => color};
	border-radius: 50%;
	margin-right: 0.5rem;

	@media (max-width: 768px) {
		width: 0.5rem;
		height: 0.5rem;
		margin-right: 0.25rem;
	}
`;
