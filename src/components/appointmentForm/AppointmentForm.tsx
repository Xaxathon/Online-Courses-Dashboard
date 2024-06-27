import React from "react";

const AppointmentForm = () => {
	return (
		<form action="">
			<div className="space-y-4 mt-5">
				<input
					className="w-full h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple"
					id="meetingTitle"
					type="text"
					placeholder="Введите тему совещания"
				/>
				<input
					className="w-full h-[46px] text-mainPurple text-[15px] bg-white p-3 rounded-lg outline-none ring-2 focus:bg-lightPurple focus:ring-mainPurple border-transparent ring-mainPurple"
					id="meetingLink"
					type="text"
					placeholder="Вставьте ссылку на совещание"
				/>
			</div>
			<div className="mt-4 px-[10px] py-[15px] border-2 border-mainPurple rounded-lg">
				<div className="justify-between flex items-center">
					<span className="font-bold text-[20px] text-start text-gardenGreen ">
						Участники
					</span>
					<button className="bg-gardenGreen font-bold text-[22px] rounded-md text-white p-2 leading-none">
						+
					</button>
				</div>
				<ul className="mt-3 space-y-1 max-h-[180px] overflow-y-auto">
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
					<li className="bg-lightPurple rounded-sm px-3 py-1 flex items-center justify-around flex-grow space-x-2">
						<div className="bg-crimsonRed w-[22px] h-[22px] rounded-sm"></div>
						<span className="text-[12px] font-bold text-mainPurple">
							Иванов Иван Иванович
						</span>
						<span className="text-[10px] text-gray-400">
							susuev.95a@gmail.com
						</span>
						<input
							type="checkbox"
							name="checkbox"
							id="checkbox"
							className="w-7 h-7 border-2 cursor-pointer"
						/>
					</li>
				</ul>
			</div>
			<div className="flex justify-end">
				<button className="bg-[#FF8F27] text-white font-bold text-[14px] rounded-md p-2 flex justify-center items-center space-x-2 cursor-pointer mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="17"
						viewBox="0 0 22 17"
						fill="none"
					>
						<path
							d="M11.0147 9.50142C11.4357 9.50142 11.8077 9.30791 12.2483 8.87251L20.7859 0.50313C20.4041 0.164485 19.7285 0 18.7788 0H2.9862C2.14419 0 1.54695 0.154809 1.20427 0.464428L9.78104 8.87251C10.2118 9.30791 10.5937 9.50142 11.0147 9.50142ZM0.264352 15.3552L7.30396 8.46614L0.274143 1.60615C0.0979083 1.91577 0 2.42857 0 3.15424V13.8458C0 14.5521 0.0881175 15.0552 0.264352 15.3552ZM21.7454 15.3455C21.9119 15.0455 22 14.5424 22 13.8458V3.15424C22 2.44792 21.9021 1.93512 21.7259 1.63517L14.7254 8.46614L21.7454 15.3455ZM3.22118 17H19.0138C19.8754 17 20.4824 16.8355 20.8349 16.5162L13.668 9.48207L13.061 10.0723C12.3854 10.7205 11.7392 11.0302 11.0147 11.0302C10.2902 11.0302 9.63418 10.7205 8.95861 10.0723L8.35158 9.48207L1.19448 16.4969C1.58611 16.8258 2.27147 17 3.22118 17Z"
							fill="white"
						/>
					</svg>
					<span>Отправить</span>
				</button>
			</div>
			<div className="flex justify-between mt-5">
				<button className="bg-mainPurple text-white font-bold text-[14px] rounded-md px-[15px] flex justify-center items-center space-x-2 cursor-pointer mt-2 leading-none hover:bg-mainPurpleHover active:bg-mainPurpleActive">
					+ Документ
				</button>

				<button className="bg-mainPurple text-white font-bold text-[20px] rounded-md px-[50px] py-2 flex justify-center items-center space-x-2 cursor-pointer mt-2 hover:bg-mainPurpleHover active:bg-mainPurpleActive">
					Сохранить
				</button>
			</div>
		</form>
	);
};

export default AppointmentForm;
