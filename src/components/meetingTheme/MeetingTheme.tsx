import { useState, useEffect, useCallback } from "react";

import { ReactComponent as Delete } from "@assets/icons/delete.svg";

import Skeleton from "../skeleton/Skeleton";
import MeetingForm from "../meetingForm/MeetingForm";
import MeetingTimeAddFormModal from "../meetingTimeAddFormModal/MeetingTimeAddFormModal";
import DeleteElementModal from "../deleteElementModal/DeleteElementModal";
import ExternalUserAddModal from "../externalUserAddModal/ExternalUserAddModal";

import dayjs from "dayjs";
import classNames from "classnames";

import {
	filterMeetingsByDate,
	sortMeetingsByStartTime,
} from "@/utils/meetingUtils";

import { useDeleteMeetingMutation } from "@/api/meetingsApi";

import { Meeting, CreateMeeting, Member } from "@/shared/interfaces/meeting";
import { User } from "@/shared/interfaces/user";

interface MeetingThemeProps {
	selectedDate: Date | null;
	selectedMeeting: Meeting | null;
	onMeetingSelect: (meeting: Meeting | null) => void;
	meetings: Meeting[];
	refetchMeetings: () => void;
}

const MeetingTheme = ({
	selectedDate,
	selectedMeeting,
	onMeetingSelect,
	meetings,
	refetchMeetings,
}: MeetingThemeProps) => {
	const [isModalOpenTime, setIsModalOpenTime] = useState(false);
	const [isModalOpenUser, setIsModalOpenUser] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const [startTime, setStartTime] = useState<string | null>(null);
	const [endTime, setEndTime] = useState<string | null>(null);

	const [newMeetings, setNewMeetings] = useState<CreateMeeting[]>([]);
	const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);

	const [deleteMeeting] = useDeleteMeetingMutation();

	useEffect(() => {
		if (selectedDate && Array.isArray(meetings)) {
			const dateMeetings = filterMeetingsByDate(meetings, selectedDate);
			const allMeetings = [...dateMeetings, ...newMeetings];
			const sortedMeetings = sortMeetingsByStartTime(allMeetings);
			setFilteredMeetings(sortedMeetings);

			if (sortedMeetings.length > 0) {
				const firstMeeting = sortedMeetings[0];
				onMeetingSelect(firstMeeting);
				setStartTime(firstMeeting.event_start_time.slice(0, 5));
				setEndTime(firstMeeting.event_end_time.slice(0, 5));
			} else {
				onMeetingSelect(null);
				setStartTime(null);
				setEndTime(null);
			}
		}
	}, [selectedDate, meetings, newMeetings, onMeetingSelect]);

	const handleTimeSubmit = (start: string, end: string) => {
		if (!selectedDate) return;

		const newMeeting: CreateMeeting = {
			theme: "",
			link: "",
			event_date: dayjs(selectedDate).format("YYYY-MM-DD"),
			event_start_time: start,
			event_end_time: end,
			members: [],
		};

		setNewMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
		setIsModalOpenTime(false);
	};

	const handleMeetingSelect = (meeting: Meeting) => {
		onMeetingSelect(meeting);
		setStartTime(meeting.event_start_time.slice(0, 5));
		setEndTime(meeting.event_end_time.slice(0, 5));
	};

	const handleDelete = async (id: number | undefined) => {
		if (id === undefined) {
			console.error("Meeting ID is undefined");
			return;
		}

		try {
			await deleteMeeting(id).unwrap();
			setFilteredMeetings((prevMeetings) =>
				prevMeetings.filter((meeting) => meeting.id !== id)
			);
			refetchMeetings();
			setIsDeleteModalOpen(false);
		} catch (error: unknown) {
			console.error("Failed to delete meeting: ", error);
		}
	};

	const handleUserSelect = (user: Member | User) => {
		if (selectedMeeting) {
			const updatedMeeting = {
				...selectedMeeting,
				members: [
					...(selectedMeeting.members || []),
					{
						id: selectedMeeting.members
							? selectedMeeting.members.length + 1
							: 1,
						member: { ...user, email: user.email || "" },
						email_sent: false,
						should_notify: false,
					},
				],
			};
			onMeetingSelect(updatedMeeting);
		}
		setIsModalOpenUser(false);
	};

	const handleSave = useCallback(
		async (savedMeeting: Meeting) => {
			setFilteredMeetings((prevMeetings) =>
				prevMeetings.map((m) => (m.id === savedMeeting.id ? savedMeeting : m))
			);
			setNewMeetings([]);
			refetchMeetings();
		},
		[refetchMeetings]
	);

	return (
		<div className="min-h-dynamic border-effect border bg-white shadow-effect px-3 py-5 rounded-lg">
			<div className="flex items-center justify-between relative">
				<span className="font-bold text-2xl text-center text-gardenGreen w-full">
					Тема совещания
				</span>
				{selectedMeeting && (
					<Delete
						className="w-6 h-6 fill-current text-crimsonRed hover:text-crimsonRed cursor-pointer absolute right-0"
						onClick={() => setIsDeleteModalOpen(true)}
					/>
				)}
			</div>

			<div className="flex items-center relative mt-3">
				<ul className="w-full flex items-center gap-2 overflow-x-auto justify-start max-h-full">
					{filteredMeetings.length === 0 ? (
						<li
							className="flex flex-grow items-center border px-2 flex-shrink-0 w-1/4 justify-center border-mainPurple rounded-lg py-2 cursor-pointer"
							onClick={() => setIsModalOpenTime(true)}
						>
							Нажмите, чтобы создать тему совещания
						</li>
					) : (
						filteredMeetings.map((meeting) => (
							<li
								key={meeting.id || meeting.event_start_time}
								className={classNames(
									"flex flex-grow items-center border px-2 flex-shrink-0 w-1/4 justify-center border-mainPurple rounded-lg py-2 cursor-pointer",
									{
										"bg-white": selectedMeeting?.id !== meeting.id,
										"bg-lightPurpleHover": selectedMeeting?.id === meeting.id,
									}
								)}
								onClick={() => handleMeetingSelect(meeting)}
							>
								{meeting.event_start_time
									? meeting.event_start_time.slice(0, 5)
									: "Invalid date"}
							</li>
						))
					)}
					<div
						className="absolute right-0 flex items-center justify-center font-bold text-lg text-white bg-mainPurple py-2 px-3 rounded-md cursor-pointer"
						onClick={() => setIsModalOpenTime(true)}
					>
						+
					</div>
				</ul>
			</div>

			{filteredMeetings.length === 0 ? (
				<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5">
					<Skeleton width="20" height="20" className="rounded-lg mb-4" />
					<Skeleton width="3/4" height="6" className="mb-2" />
					<Skeleton width="1/2" height="4" className="mb-2" />
					<Skeleton width="3/4" height="6" className="mb-2" />
					<Skeleton width="1/2" height="4" className="mb-2" />
					<Skeleton width="3/4" height="6" className="mb-2" />
					<Skeleton width="1/2" height="4" className="mb-2" />
					<Skeleton width="3/4" height="6" className="mb-2" />
					<Skeleton width="1/2" height="4" className="mb-2" />
					<Skeleton width="3/4" height="6" className="mb-2" />
					<Skeleton width="1/2" height="4" className="mb-2" />
					<Skeleton width="1/2" height="4" />
				</div>
			) : (
				<>
					{startTime && endTime && (
						<div className="flex justify-around mt-3 bg-time-gradient p-3 rounded-lg text-black w-full">
							<div className="">Начало: {startTime}</div>
							<div className="text-mainPurple font-bold text-xl ">→</div>
							<div>Конец: {endTime}</div>
						</div>
					)}
					<MeetingForm
						meeting={selectedMeeting}
						selectedDate={selectedDate}
						startTime={startTime}
						endTime={endTime}
						onSave={handleSave}
						onOpenUserModal={() => setIsModalOpenUser(true)}
					/>
				</>
			)}
			{isModalOpenTime && (
				<MeetingTimeAddFormModal
					onClose={() => setIsModalOpenTime(false)}
					onTimeSubmit={handleTimeSubmit}
				/>
			)}
			{isModalOpenUser && selectedMeeting && (
				<ExternalUserAddModal
					onClose={() => setIsModalOpenUser(false)}
					onUserSelect={handleUserSelect}
				/>
			)}
			{isDeleteModalOpen && selectedMeeting && (
				<DeleteElementModal
					title="Удаление совещания"
					description={`${selectedMeeting.theme.slice(0, 10)} (ID: ${
						selectedMeeting.id
					})`}
					onClose={() => setIsDeleteModalOpen(false)}
					onDelete={() => handleDelete(selectedMeeting.id)}
				/>
			)}
		</div>
	);
};

export default MeetingTheme;
