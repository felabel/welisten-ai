import styles from "./empty.module.scss";
import empty from "/images/empty.svg";
const EmptyState = () => {
  return (
    <div className={styles.empty_state}>
      <div className={styles.container}>
        <img src={empty} alt="Detective icon" className={styles.icon} />
        <h2 className={styles.title}>There is no feedback yet.</h2>
        <p className={styles.description}>
          Got a suggestion? Found a bug that needs to be squashed?
          <br />
          We love hearing about new ideas to improve our app.
        </p>
        <button className={styles.add_feedback_btn}>+ Add Feedback</button>
      </div>
    </div>
  );
};

export default EmptyState;
