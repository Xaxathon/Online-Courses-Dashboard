import React from "react";
import AppointmentCalendar from "../../components/appointmentCalendar/AppointmentCalendar";
import AppointmentForm from "../../components/appointmentForm/AppointmentForm";

const Appointment = () => {
	return (
		<div className="ml-3 grid grid-cols-[minmax(650px,_772px)_minmax(470px,_470px)] gap-4 justify-between items-start mt-5 mr-6 w-full">
			<AppointmentCalendar />
			<div className="min-h-dynamic border-effect border bg-white shadow-effect px-3 py-5 rounded-lg">
				<h1 className="font-bold text-2xl text-center text-statusSalate ">
					Тема совещания
				</h1>
				<div className="flex items-center relative mt-3">
					<ul className="w-full flex items-center gap-2 overflow-x-auto  justify-start max-h-full ">
						<li className="flex flex-grow items-center border px-2 flex-shrink-0 w-1/4  justify-center border-mainPurple rounded-lg bg-white py-2">
							1
						</li>
					</ul>

					<div className="absolute right-0 flex items-center justify-center font-bold text-lg text-white bg-mainPurple py-2 px-3 rounded-md cursor-pointer">
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
