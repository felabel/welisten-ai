import { useState } from "react";
import styles from "./replies.module.scss";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useAddReplyMutation } from "../../services/protectedApi";
import { AddReplyRequest } from "../../services/api.types";

const Replies = ({
  replies,
  feedbackId,
}: {
  replies: any;
  feedbackId: string;
}) => {
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const auth = useSelector((state: RootState) => state.auth.user);
  const [addReply] = useAddReplyMutation();

  const toggleReplyBox = (id: number) => {
    setActiveReplyId(activeReplyId === id ? null : id);
  };

  const [commentText, setCommentText] = useState("");
  const charLimit = 225;
  const charsLeft = charLimit - commentText.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !auth) return;
    const payload: AddReplyRequest = {
      feedbackId: feedbackId,
      userId: auth.fullUser?.id, // Using token as userId - adjust if your API expects different
      text: commentText,
      email: auth.email,
      username: auth.fullUser?.username,
      commentId: activeReplyId,
    };
    try {
      const result = await addReply(payload).unwrap();
      setCommentText("");
      console.log("result is", result);
      if ("message" in result) {
        toast.success(result?.message || "Comment added successfully");
      } else {
        toast.error("something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to add comment:");
    }
  };

  return (
    <div className={styles.container}>
      {replies?.map((reply: any, index: number) => (
        <div key={index}>
          <div className={styles.reply}>
            <img
              src={reply.avatar || "https://placehold.co/400"}
              alt={reply.name}
              className={styles.avatar}
            />
            <div className={styles.content}>
              <h4 className={styles.commentAuthor}>{reply.username}</h4>
              <span className={styles.username}>{reply.email}</span>
              <p className={styles.text}>{reply.text}</p>

              {activeReplyId === reply.id && (
                <form className={styles.addComment} onSubmit={handleSubmit}>
                  <textarea
                    className={styles.commentInput}
                    placeholder="Add your reply..."
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
                      Reply
                    </button>
                  </div>
                </form>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.post_reply}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent click
                    toggleReplyBox(reply.id); // Pass the reply object
                  }}
                >
                  {activeReplyId === reply.id ? "Cancel" : "Post Reply"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.line_wrapper}>
            {reply.replies?.map((nestedReply: any, i: number) => (
              <div key={i} className={styles.replies_wrapper}>
                <div className={styles.reply}>
                  <div className={styles.content}>
                    <h4 className={styles.commentAuthor}>
                      {nestedReply.username}
                    </h4>
                    <span className={styles.username}>{nestedReply.email}</span>
                    <p className={styles.text}>{nestedReply.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Replies;
