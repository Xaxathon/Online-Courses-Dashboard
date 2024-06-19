import React from "react";

import Calendar from "@assets/icons/calendar.svg";
import Meetings from "@assets/icons/meetings.svg";
import Protocol from "@assets/icons/protocol.svg";
import Settings from "@assets/icons/settings.svg";
import Logout from "@assets/icons/logout.svg";

const Sidebar = () => {
	return (
		<aside className="sticky top-0 left-2 h-screen z-10 mr-4 py-2">
			<nav className="min-h-full z-10 flex flex-col items-center py-10 px-9 gap-9 bg-mainPurple rounded-3xl ">
				<a href="#" className="text-white text-6xl font-baloo cursor-pointer">
					P
				</a>
				<ul className="flex flex-col flex-grow  justify-start items-center gap-8">
					<li>
						<a href="#">
							<Meetings className="w-8 h-8" />
						</a>
					</li>
					<li>
						<a href="#">
							<Calendar className="w-8 h-8" />
						</a>
					</li>
					<li>
						<a href="#">
							<Protocol className="w-8 h-8" />
						</a>
					</li>
					<li>
						<a href="#">
							<Settings className="w-8 h-8" />
						</a>
					</li>
				</ul>

				<a href="#" className="flex-shrink-0">
					<Logout className="w-10 h-10" />
				</a>
			</nav>
		</aside>
	);
};

export default Sidebar;
