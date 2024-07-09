import KeywordsItem from "../keywordsItem/KeywordsItem";
import Skeleton from "../skeleton/Skeleton";

import { useFetchKeywordsQuery } from "@/api/keywordsApi";

const KeywordsList = () => {
	const { data, error, isLoading } = useFetchKeywordsQuery();

	if (isLoading)
		return (
			<div className="mt-10">
				<SkeletonKeywordsItem />
				<SkeletonKeywordsItem />
				<SkeletonKeywordsItem />
				<SkeletonKeywordsItem />
				<SkeletonKeywordsItem />
			</div>
		);
	if (error) return <div>Ошибка загрузки ключевых слов</div>;

	return (
		<ul className="mt-10 max-w-6xl mx-auto">
			{data && data.data.length > 0 ? (
				data.data.map((keyword) => (
					<KeywordsItem key={keyword.id} keyword={keyword} />
				))
			) : (
				<div>Нет ключевых слов для отображения</div>
			)}
		</ul>
	);
};

export default KeywordsList;

const SkeletonKeywordsItem = () => {
	return (
		<div className="flex max-w-6xl mx-auto mt-4 rounded-xl bg-gray-100 py-10 px-7 gap-2">
			<Skeleton width="1/2" height="10" className="rounded-lg" />
			<Skeleton width="1/2" height="10" className="rounded-lg" />
		</div>
	);
};
