import React, { useEffect } from "react";
import KeywordsItem from "../keywordsItem/KeywordsItem";
import { useFetchKeywordsQuery } from "../../api/keywordsApi";

import Spinner from "@assets/icons/spinner.svg";
const KeywordsList: React.FC = () => {
	const { data, error, isLoading } = useFetchKeywordsQuery();

	if (isLoading)
		return (
			<div className="h-60 flex justify-center items-center">
				<Spinner />
			</div>
		);
	if (error || !data) return <div>Ошибка загрузки ключевых слов</div>;

	return (
		<ul className="mt-10 max-w-6xl mx-auto">
			{data.data.length > 0 ? (
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
