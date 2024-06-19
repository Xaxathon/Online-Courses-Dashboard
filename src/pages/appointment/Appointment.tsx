import React from "react";
import AppointmentCalendar from "../../components/appointmentCalendar/AppointmentCalendar";
import AppointmentForm from "../../components/appointmentForm/AppointmentForm";

const Appointment = () => {
	return (
		<div className="ml-3 grid grid-cols-[minmax(650px,_772px)_minmax(470px,_470px)] gap-4 justify-between items-start mt-[20px] mr-[25px] w-full">
			<AppointmentCalendar />
			<div className="min-h-dynamic w-full border-effect border bg-[#FDFDFD] shadow-effect px-3 py-5 rounded-lg">
				<h1 className="font-bold text-[24px] text-center text-statusSalate ">
					Тема совещания
				</h1>
				<div className="flex w-[28rem] items-center relative mt-3">
					<div className="flex items-center gap-2 overflow-x-auto  justify-start w-[28rem] max-h-full ">
						<div className="flex flex-grow items-center border px-2 flex-shrink-0 w-1/4  justify-center border-mainPurple rounded-lg bg-[#EEECFF] h-[44px]">
							1
						</div>
					</div>

					<div className="absolute right-0 flex items-center justify-center font-bold text-[17px] text-white bg-mainPurple h-[44px] w-[30px] rounded-md cursor-pointer">
						+
					</div>
				</div>
				<div className="flex justify-around mt-3 bg-time-gradient p-3 rounded-lg text-black w-full">
					<div className="">Начало: 12:00</div>
					<div className="text-mainPurple font-bold text-xl ">→</div>
					<div>Конец: 14:00</div>
				</div>
				<AppointmentForm />
			</div>
		</div>
	);
};

export default Appointment;
