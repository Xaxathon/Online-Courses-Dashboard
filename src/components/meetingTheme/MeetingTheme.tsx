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

	const [errorAddMember, setErrorAddMember] = useState<string | null>(null);

	const [startTime, setStartTime] = useState<string | null>(null);
	const [endTime, setEndTime] = useState<string | null>(null);

	const [newFrontendMeeting, setNewFrontendMeeting] =
		useState<CreateMeeting | null>(null);
	const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);

	const [deleteMeeting, { isLoading: isDeleteLoading }] =
		useDeleteMeetingMutation();

	useEffect(() => {
		if (selectedDate && Array.isArray(meetings)) {
			const dateMeetings = filterMeetingsByDate(meetings, selectedDate);
			const allMeetings = newFrontendMeeting
				? [...dateMeetings, newFrontendMeeting]
				: dateMeetings;
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
	}, [selectedDate, meetings, newFrontendMeeting, onMeetingSelect]);

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

		setNewFrontendMeeting(newMeeting);
		setIsModalOpenTime(false);
	};

	const handleMeetingSelect = (meeting: Meeting) => {
		onMeetingSelect(meeting);
		setStartTime(meeting.event_start_time.slice(0, 5));
		setEndTime(meeting.event_end_time.slice(0, 5));
	};

	const handleDelete = async (id: number | undefined) => {
		if (id === undefined) {
			setNewFrontendMeeting(null);
			onMeetingSelect(null);
		} else {
			try {
				await deleteMeeting(id).unwrap();
				setFilteredMeetings((prevMeetings) =>
					prevMeetings.filter((meeting) => meeting.id !== id)
				);
				refetchMeetings();
			} catch (error: unknown) {
				console.error("Failed to delete meeting: ", error);
			}
		}
		setIsDeleteModalOpen(false);
	};

	const handleUserSelect = (user: Member | User) => {
		if (selectedMeeting) {
			const isUserAlreadyAdded = selectedMeeting.members?.some(
				(member) => member.member.id === user.id
			);

			if (isUserAlreadyAdded) {
				setErrorAddMember(
					"Не удалось добавить участника, либо он уже в списке"
				);
			} else {
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
				setErrorAddMember(null);
			}
		}
		setIsModalOpenUser(false);
	};

	const handleUpdateMeeting = (updatedMeeting: Meeting) => {
		onMeetingSelect(updatedMeeting);
		setFilteredMeetings((prevMeetings) =>
			prevMeetings.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m))
		);
	};

	const handleSave = useCallback(
		async (savedMeeting: Meeting) => {
			setFilteredMeetings((prevMeetings) =>
				prevMeetings.map((m) => (m.id === savedMeeting.id ? savedMeeting : m))
			);
			setNewFrontendMeeting(null);
			refetchMeetings();
		},
		[refetchMeetings]
	);

	const isAddButtonDisabled = newFrontendMeeting !== null;

	return (
		<div className="min-h-dynamic border-effect border bg-white shadow-effect px-3 py-5 rounded-lg">
			<div className="flex items-center justify-between relative">
				<span className="font-bold text-2xl text-center text-gardenGreen w-full">
					Тема совещания
				</span>
				{(selectedMeeting || newFrontendMeeting) && (
					<Delete
						className="w-6 h-6 fill-current text-gray-400 hover:text-crimsonRed cursor-pointer absolute right-0"
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
								key={`${meeting.id}-${meeting.event_start_time}`}
								className={classNames(
									"flex flex-grow items-center border px-2 flex-shrink-0 w-1/4 justify-center border-mainPurple rounded-lg py-2 cursor-pointer",
									{
										"bg-white hover:bg-gray-100":
											selectedMeeting?.id !== meeting.id,
										"bg-lightPurpleHover ": selectedMeeting?.id === meeting.id,
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
						className={classNames(
							"absolute right-0 flex items-center justify-center font-bold text-lg text-white py-2 px-3 rounded-md",
							{
								"bg-mainPurple hover:bg-mainPurpleHover active:bg-mainPurpleActive cursor-pointer":
									!isAddButtonDisabled,
								"bg-gray-400 cursor-not-allowed": isAddButtonDisabled,
							}
						)}
						onClick={() => !isAddButtonDisabled && setIsModalOpenTime(true)}
					>
						+
					</div>
				</ul>
			</div>

			{filteredMeetings.length === 0 ? (
				<div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-5 mt-5">
					<Skeleton width="full" height="20" className="rounded-lg mb-5" />
					<Skeleton width="20" height="10" className="rounded-lg mb-10" />
					<Skeleton width="full" height="5" className="rounded-lg mb-4" />
					<Skeleton width="full" height="5" className="rounded-lg mb-4" />
					<Skeleton width="full" height="5" className="rounded-lg mb-4" />
					<Skeleton width="full" height="5" className="rounded-lg mb-4" />
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
						errorAddMember={errorAddMember}
						selectedDate={selectedDate}
						startTime={startTime}
						endTime={endTime}
						onSave={handleSave}
						onOpenUserModal={() => setIsModalOpenUser(true)}
						onUpdateMeeting={handleUpdateMeeting}
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
			{isDeleteModalOpen && (selectedMeeting || newFrontendMeeting) && (
				<DeleteElementModal
					title="Удаление совещания"
					description={
						selectedMeeting
							? `${selectedMeeting.theme.slice(0, 10)} (ID: ${
									selectedMeeting.id
							  })`
							: "Несохраненное совещание"
					}
					onClose={() => setIsDeleteModalOpen(false)}
					onDelete={() => handleDelete(selectedMeeting?.id)}
					isLoading={isDeleteLoading}
				/>
			)}
		</div>
	);
};

export default MeetingTheme;
