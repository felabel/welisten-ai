import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import SuggestionCard from "../suggestion/SuggestionCard";
import styles from "./FeedbackDetails.module.scss";
import { FeedBackBtn, GoBackBtn } from "../shared/FeedBackBtn";
import Replies from "../Replies/Replies";
import {
  useGetFeedbackByIdQuery,
  useAddCommentMutation,
} from "../../services/protectedApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { AddCommentRequest } from "../../services/api.types";
import { toast } from "react-toastify";
const FeedbackDetails = () => {
  const { id } = useParams();
  const feedbackId = id ?? "";
  const singleFeedbackQueryResult = useGetFeedbackByIdQuery(feedbackId);
  const suggestion = singleFeedbackQueryResult.data?.feedback;
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth.user);
  const [addComment] = useAddCommentMutation();

  // State for comment text
  const [commentText, setCommentText] = useState("");
  const charLimit = 225;
  const charsLeft = charLimit - commentText.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !auth) return;

    try {
      const payload: AddCommentRequest = {
        id: feedbackId,
        userId: auth.fullUser?.id, // Using token as userId - adjust if your API expects different
        text: commentText,
        email: auth.email,
        username: auth.fullUser?.username,
      };

      const result = await addComment(payload).unwrap();
      setCommentText("");
      if ("message" in result) {
        toast.success(result?.message || "Comment added successfully");
      }
    } catch (error) {
      toast.error("Failed to add comment:");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <div className={styles.btn_section}>
          <GoBackBtn stroke="#4661E6" textColor="#647196" />
          <FeedBackBtn
            text="Edit Feedback"
            customClick={() => navigate(`/feedback/edit/${id}`)}
          />
        </div>

        <SuggestionCard
          // @ts-ignore
          title={suggestion?.title}
          category={suggestion?.category}
          // @ts-ignore
          detail={suggestion?.detail}
          comments={suggestion?.comments?.length}
          id={feedbackId}
          upvotes={suggestion?.upvotes}
        />

        <div className={styles.commentsSection}>
          <h3>{suggestion?.comments?.length} comments</h3>
          <Replies replies={suggestion?.comments} feedbackId={feedbackId} />
        </div>

        <form className={styles.addComment} onSubmit={handleSubmit}>
          <textarea
            className={styles.commentInput}
            placeholder="Add your comment..."
            maxLength={charLimit}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className={styles.commentFooter}>
            <span>{charsLeft} characters left</span>
            <button
              type="submit"
              className={styles.postComment}
              disabled={!commentText.trim() || charsLeft < 0}
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackDetails;
