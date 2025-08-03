import { useState } from "react";
import SuggestionCard from "../suggestion/SuggestionCard";
import EmptyState from "../empty/EmptyState";
import { useGetFeedbackQuery } from "../../services/protectedApi";

const Content = ({ currentCategory, currentSort, setFeedbackCount }: any) => {
  const [empty] = useState(false);

  const feedbackQueryResult = useGetFeedbackQuery({
    category: currentCategory === "all" ? undefined : currentCategory,
    sort: currentSort,
  });
  const feedbacks = feedbackQueryResult.data?.feedbacks;
  setFeedbackCount(feedbacks?.length);

  return (
    <div>
      {empty ? (
        <EmptyState />
      ) : (
        feedbacks?.map((item, i) => (
          <div key={i}>
            <SuggestionCard
              id={item._id}
              title={item.title}
              detail={item.detail}
              upvotes={item.upvotes}
              comments={item.commentCount}
              category={item.category}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Content;
