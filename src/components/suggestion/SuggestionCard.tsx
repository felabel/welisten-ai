import { useNavigate } from "react-router-dom";
import CommentIcon from "../../assets/icons/CommentIcon";
import TopArrowIcon from "../../assets/icons/TopArrowIcon";
import styles from "./SuggestionCard.module.scss";
import { useUpvoteFeedbackMutation } from "../../services/protectedApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";

export interface SuggestionCardProps {
  id: string | number;
  title: string;
  detail: string;
  upvotes?: number;
  comments?: number;
  category?: string;
}

const SuggestionCard = ({
  title,
  category,
  upvotes,
  comments,
  detail,
  id,
}: SuggestionCardProps) => {
  const userId = useSelector((state: RootState) => state.auth.user.userId);

  const navigate = useNavigate();
  const [upvoteFeedback] = useUpvoteFeedbackMutation();

  const handleUpvote = async () => {
    if (!userId) {
      alert("no user id found, please login to upvote");
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

  return (
    <div className={styles.card}>
      <div className={styles.upvotes} onClick={handleUpvote}>
        <div>
          <TopArrowIcon />
        </div>
        {upvotes}
      </div>
      <div
        className={styles.details}
        onClick={() => navigate(`/feedback/${id}`)}
      >
        <h3>{title}</h3>
        <p className={styles.content}>{detail}</p>
        <span className={styles.category}>{category}</span>
      </div>
      <div className={styles.comment_wrapper}>
        <CommentIcon />
        <div className={styles.comments}>{comments}</div>
      </div>
    </div>
  );
};

export default SuggestionCard;
