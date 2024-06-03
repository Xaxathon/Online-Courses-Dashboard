import TaskItem from "../taskItem/TaskItem";

const TaskList = () => {
	return (
		<ul className="w-full mx-auto xl:h-[80vh] h-[95vh] overflow-y-auto rounded-lg">
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
			<TaskItem />
		</ul>
	);
};

export default TaskList;
