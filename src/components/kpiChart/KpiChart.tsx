import { useMemo } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import Select, { StylesConfig } from "react-select";
import styled from "styled-components";
import CustomBar from "./CustomBar";
import Skeleton from "../skeleton/Skeleton";

interface KpiChartProps {
	data: Array<{
		week: string;
		in_process: number;
		success: number;
		expired: number;
	}>;
	isLoading: boolean;
	currentMonth: Date;
	onMonthChange: (date: Date) => void;
}

interface MonthOption {
	value: string;
	label: string;
}

const KpiChart = ({
	data,
	isLoading,
	currentMonth,
	onMonthChange,
}: KpiChartProps) => {
	// Я убрал ошибку в консоли, потому что она внутри самой библиотеки
	const error = console.error;
	console.error = (...args: any) => {
		if (/defaultProps/.test(args[0])) return;
		error(...args);
	};

	const handleMonthChange = (selectedOption: MonthOption | null) => {
		if (selectedOption) {
			const newDate = new Date(currentMonth);
			newDate.setMonth(parseInt(selectedOption.value) - 1);
			onMonthChange(newDate);
		}
	};

	const customStyles: StylesConfig<MonthOption, false> = {
		control: (provided) => ({
			...provided,
			border: "none",
			boxShadow: "none",
			cursor: "pointer",
		}),
		dropdownIndicator: (provided) => ({
			...provided,
			color: "#19161D",
			marginLeft: "-4.69rem",
			cursor: "pointer",
		}),
		indicatorSeparator: (provided) => ({
			...provided,
			display: "none",
			cursor: "pointer",
		}),
		menu: (provided) => ({
			...provided,
			border: "none",
			boxShadow: "none",
			cursor: "pointer",
		}),
	};

	const getWeeksInMonth = (year: number, month: number) => {
		const weeks = [];
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		let currentWeek = 1;
		for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
			if (d.getDay() === 1 || weeks.length === 0) {
				weeks.push(currentWeek);
				currentWeek++;
			}
		}
		return weeks;
	};

	const completeData = useMemo(() => {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const weeksInMonth = getWeeksInMonth(year, month);

		const completeData = weeksInMonth.map((week) => {
			const existingData = data.find((item) => item.week === `${week} неделя`);
			return (
				existingData || {
					week: `${week} неделя`,
					in_process: 0,
					success: 0,
					expired: 0,
				}
			);
		});

		if (completeData.length === 6) {
			const sixthWeek = completeData[5];
			if (
				sixthWeek.in_process === 0 &&
				sixthWeek.success === 0 &&
				sixthWeek.expired === 0
			) {
				completeData.pop();
			}
		}

		return completeData;
	}, [data, currentMonth]);

	return (
		<Container>
			<Header>
				<Title>KPI</Title>
				<LegendContainer>
					<LegendItem>
						<LegendCircle color="#A964D3" />
						<span className="xl:text-sm text-xs">В процессе</span>
					</LegendItem>
					<LegendItem>
						<LegendCircle color="#A1BBA4" />
						<span className="xl:text-sm text-xs">Готово</span>
					</LegendItem>
					<LegendItem>
						<LegendCircle color="#D46666" />
						<span className="xl:text-sm text-xs">Просрочено</span>
					</LegendItem>
				</LegendContainer>
			</Header>

			<SelectWrapper<MonthOption, false>
				value={months[currentMonth.getMonth()]}
				options={months}
				onChange={handleMonthChange}
				styles={customStyles}
			/>
			<ResponsiveContainer width="100%" height="75%">
				{isLoading ? (
					<div className="flex justify-center items-center w-full h-full p-1">
						<Skeleton width="full" height="full" className="rounded-xl" />
					</div>
				) : (
					<BarChart data={completeData} barCategoryGap="10%" barGap={10}>
						<CartesianGrid vertical={false} strokeDasharray="2 3" />
						<XAxis dataKey="week" tick={{ fontSize: 15 }} interval={0} />
						<YAxis axisLine={false} tickLine={false} />
						<Tooltip />
						<Bar
							dataKey="in_process"
							fill="#A964D3"
							shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
							name="В процессе"
						/>
						<Bar
							dataKey="success"
							fill="#A1BBA4"
							shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
							name="Готово"
						/>
						<Bar
							dataKey="expired"
							fill="#D46666"
							shape={<CustomBar radius={[6, 6, 0, 0]} width={20} />}
							name="Просрочено"
						/>
					</BarChart>
				)}
			</ResponsiveContainer>
		</Container>
	);
};

export default KpiChart;

const months: MonthOption[] = [
	{ value: "01", label: "Январь" },
	{ value: "02", label: "Февраль" },
	{ value: "03", label: "Март" },
	{ value: "04", label: "Апрель" },
	{ value: "05", label: "Май" },
	{ value: "06", label: "Июнь" },
	{ value: "07", label: "Июль" },
	{ value: "08", label: "Август" },
	{ value: "09", label: "Сентябрь" },
	{ value: "10", label: "Октябрь" },
	{ value: "11", label: "Ноябрь" },
	{ value: "12", label: "Декабрь" },
];

const Container = styled.div`
	width: 100%;
	max-width: 29.8rem;
	height: 18rem;
	background-color: white;
	border-radius: 0.6rem;
	padding: 1.2rem;
	box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.1);

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
	color: #6a1b9a;

	@media (max-width: 1280px) {
		font-size: 1.4rem;
		margin-bottom: 0.7rem;
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
	padding: 0.13rem 0.44rem;
	border-radius: 0.5rem;

	@media (max-width: 768px) {
		margin-right: 0.5rem;
	}
`;

const LegendCircle = styled.div<{ color: string }>`
	width: 0.63rem;
	height: 0.63rem;
	background-color: ${({ color }) => color};
	border-radius: 50%;
	margin-right: 0.5rem;

	@media (max-width: 768px) {
		width: 0.5rem;
		height: 0.5rem;
		margin-right: 0.25rem;
	}
`;

const SelectWrapper = styled(Select)`
	width: 10rem;
	border: none;
	margin-bottom: 0.31rem;
` as typeof Select;
