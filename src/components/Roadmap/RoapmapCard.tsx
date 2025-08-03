// RoadmapCard.tsx
import React from "react";
import styles from "./RoadmapCard.module.scss";
import TopArrowIcon from "../../assets/icons/TopArrowIcon";
import CommentIcon from "../../assets/icons/CommentIcon";
import { useUpvoteFeedbackMutation } from "../../services/protectedApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";

type RoadmapCardProps = {
  status: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  comments: number;
  id: string | number;
};

// Map status to CSS classes
const statusClasses: { [key: string]: string } = {
  planned: styles.planned,
  inprogress: styles.inProgress,
  live: styles.live,
};

const RoadmapCard: React.FC<RoadmapCardProps> = ({
  status,
  title,
  description,
  category,
  votes,
  comments,
  id,
}) => {
  const [upvoteFeedback] = useUpvoteFeedbackMutation();
  const userId = useSelector(
    (state: RootState) => state.auth.user?.fullUser?.id
  );

  const handleUpvote = async () => {
    if (!userId) {
      return;
    }
    const payload: any = {
      id,
      userId,
    };
    try {
      const result = await upvoteFeedback(payload).unwrap();
      if ("message" in result) {
        toast.success("Feedback upvoted!");
      } else {
        toast.error("Failed, try again!");
      }
    } catch (error) {
      console.error("Failed to upvote:", error);
      toast.error("Failed, try again!");
    }
  };
  const statusClass = statusClasses[status.toLowerCase()] || ""; // Default to an empty string if no match

  return (
    <div className={`${styles.card} ${statusClass}`}>
      <div className={styles.status}>
        <span className={styles.dot}></span> {status}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <span className={styles.category}>{category}</span>
      <div className={styles.footer}>
        <div className={styles.upvotes} onClick={handleUpvote}>
          <div>
            <TopArrowIcon />
          </div>
          {votes}
        </div>
        <div className={styles.comment_wrapper}>
          <CommentIcon />
          <div className={styles.comments}>{comments}</div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard;
