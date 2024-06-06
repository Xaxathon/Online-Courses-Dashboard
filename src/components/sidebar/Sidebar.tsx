import React from "react";

import Calendar from "@assets/icons/calendar.svg";
import Meetings from "@assets/icons/meetings.svg";
import Protocol from "@assets/icons/protocol.svg";
import Settings from "@assets/icons/settings.svg";
import Logout from "@assets/icons/logout.svg";

const Sidebar = () => {
	return (
		<div className="  h-screen flex mx-[15px] items-center">
			<aside className="w-[110px]  h-full flex flex-col items-center justify-between py-10  bg-mainPurple rounded-[24px]">
				<div className="flex flex-col space-y-10">
					<a className=" text-white text-[60px] font-baloo cursor-pointer">P</a>
					<ul className="flex flex-col items-center justify-center space-y-[50px]">
						<li>
							<a href="#">
								<Meetings />
							</a>
						</li>
						<li>
							<a href="#">
								<Calendar />
							</a>
						</li>
						<li>
							<a href="#">
								<Protocol />
							</a>
						</li>
						<li>
							<a href="#">
								<Settings />
							</a>
						</li>
					</ul>
				</div>

				<a href="#">
					<Logout />
				</a>
			</aside>
		</div>
	);
};

export default Sidebar;
