import TaskItem from "../taskItem/TaskItem";

const TaskList = () => {
	return (
		<ul className="w-full mx-auto h-[78vh] overflow-y-auto rounded-lg">
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
