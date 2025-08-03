import { useNavigate } from "react-router-dom";
import styles from "./button.module.scss";
import TopArrowIcon from "../../assets/icons/TopArrowIcon";

export const FeedBackBtn = ({
  text,
  customClick,
  disabled,
  type,
}: {
  text: string;
  customClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (customClick) {
      customClick(); // Call the custom function if provided
    } else {
      navigate("/feedback/create"); // Default navigation behavior
    }
  };

  return (
    <div>
      <button
        className={`${styles.addButton} ${disabled ? styles.disabled_btn : ""}`}
        onClick={handleClick}
        type={type}
        disabled={disabled} // This ensures the button is actually disabled in the DOM
      >
        {text}
      </button>
    </div>
  );
};

type bntProps = {
  stroke?: string;
  textColor?: string;
};
export const GoBackBtn = ({ stroke, textColor }: bntProps) => {
  const navigate = useNavigate();
  return (
    <button className={styles.back_btn} onClick={() => navigate(-1)}>
      <span className={styles.icon}>
        <TopArrowIcon stroke={stroke || "#CDD2EE"} />
      </span>
      <span
        className={styles.text}
        style={textColor ? { color: textColor } : {}}
      >
        Go Back
      </span>
    </button>
  );
};
