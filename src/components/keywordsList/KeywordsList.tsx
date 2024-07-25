import KeywordsItem from "../keywordsItem/KeywordsItem";
import Skeleton from "../skeleton/Skeleton";

import { useFetchKeywordsQuery } from "@/api/keywordsApi";

const KeywordsList = () => {
	const { data, error, isLoading } = useFetchKeywordsQuery();

	if (isLoading)
		return (
			<div className="mt-10">
				<div className="flex max-w-6xl mx-auto mt-4 rounded-xl bg-gray-100 py-10 px-7 gap-2">
					<Skeleton width="1/2" height="10" className="rounded-lg" />
					<Skeleton width="1/2" height="10" className="rounded-lg" />
				</div>
			</div>
		);
	if (error)
		return (
			<div className="flex flex-col justify-center items-center mt-10 gap-4">
				<p className="text-center text-crimsonRed font-bold">
					Ошибка при загрузке данных
				</p>
			</div>
		);

	return (
		<ul className="mt-10 max-w-6xl mx-auto">
			{data && data.data.length > 0 ? (
				data.data.map((keyword) => (
					<KeywordsItem key={keyword.id} keyword={keyword} />
				))
			) : (
				<div className="flex justify-center text-base font-bold text-gardenGreen">
					Нет ключевых слов для отображения
				</div>
			)}
		</ul>
	);
};

export default KeywordsList;
