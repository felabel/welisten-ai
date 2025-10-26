import { useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./form.module.scss";
import { GoBackBtn } from "../shared/FeedBackBtn";
import plus from "../../assets/plus.svg";
import {
  useCreateFeedbackMutation,
  useGetCategoriesQuery,
  useGetFeedbackByIdQuery,
  useUpdateFeedbackMutation, // ✅ Import the update feedback API
} from "../../services/protectedApi";
import { useEffect, useState } from "react";

type FeedbackInputs = {
  title: string;
  category: string;
  detail: string;
};

const FeedbackForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const categoriesQueryResult = useGetCategoriesQuery();
  const categories = categoriesQueryResult.data?.categories;
  const { id } = useParams();
  const feedbackId = id ?? "";
  const singleFeedbackQueryResult = useGetFeedbackByIdQuery(feedbackId);
      // @ts-expect-error: error may not have 'data' property, but we want to access error message if present
  const feedback = singleFeedbackQueryResult.data?.feedback;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedbackInputs>({
    mode: "onChange",
  });

  const [createFeedback, { isLoading: isCreating }] = useCreateFeedbackMutation();
  const [updateFeedback, { isLoading: isUpdating }] = useUpdateFeedbackMutation();

  const onSubmit: SubmitHandler<FeedbackInputs> = async (data) => {
    try {
      if (isEdit) {
        const response = await updateFeedback({
          // @ts-expect-error: "Feedback ID is required",
          id: feedbackId,
          ...data,
        }).unwrap();
        toast.success(response?.message || "Feedback  successfully!");
      } else {
        const response = await createFeedback(data).unwrap();
        toast.success(response?.message || "Feedback submitted successfully!");
      }
      navigate("/dashboard");
    } catch (error) {
      // @ts-expect-error: error may not have 'data' property, but we want to access error message if present
      toast.error(error?.data?.message  || "Failed to submit feedback.");
    }
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (feedbackId && feedback) {
      setIsEdit(true);
      setValue("title", feedback.title);
      setValue("category", feedback.category);
      setValue("detail", feedback.detail);
    }
  }, [feedbackId, feedback, setValue]);

  return (
    <div className={styles.feedbackFormContainer}>
      <GoBackBtn stroke="#4661E6" textColor="#647196" />
      <div className={styles.formWrapper}>
        <div className={styles.plusIconContainer}>
          <img src={plus} alt="Plus Icon" className={styles.plusIcon} />
        </div>
        <h1 className={styles.formTitle}>
          {isEdit ? "Edit Feedback" : "Create New Feedback"}
        </h1>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="feedbackTitle" className={styles.label}>
              Feedback Title
            </label>
            <label htmlFor="feedbackTitle" className={styles.label_sm}>
              Add a short, descriptive headline
            </label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  id="feedbackTitle"
                  placeholder="Enter your feedback title"
                  className={styles.input}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <label htmlFor="feedbackTitle" className={styles.label_sm}>
              Choose a category for your feedback
            </label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <select {...field} id="category" className={styles.select}>
                  <option value="" disabled selected>
                    Please select a category
                  </option>
                  {categories?.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.category && (
              <span className={styles.errorText}>
                {errors.category.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="feedbackDetail" className={styles.label}>
              Feedback Detail
            </label>
            <label htmlFor="feedbackTitle" className={styles.label_sm}>
              Include any specific comments on what should be improved, added,
              etc.
            </label>
            <Controller
              name="detail"
              control={control}
              rules={{ required: "Detail is required" }}
              render={({ field }) => (
                <textarea
                  id="feedbackDetail"
                  placeholder="Include any specific comments on what should be improved, added, etc."
                  className={styles.textarea}
                  {...field}
                />
              )}
            />
            {errors.detail && (
              <span className={styles.errorText}>{errors.detail.message}</span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.addButton}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Processing..."
                : isEdit
                ? "Update Feedback"
                : "Add Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
