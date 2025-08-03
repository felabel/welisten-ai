import { Select, MenuItem } from "@mui/material";
import BulbIcon from "../../assets/icons/BulbIcon";
import styles from "./Header.module.scss";
import { FeedBackBtn, GoBackBtn } from "../shared/FeedBackBtn";
import { useGetFeedbackQuery } from "../../services/protectedApi";

type Props = {
  hasIcon?: boolean;
  title?: string;
  hasBackBtn?: boolean;
  isHome?: boolean;
  currentSort?: string;
  setCurrentSort?: any;
  feedbackCount?: number;
};
const Header = ({
  hasIcon = true,
  title = "Suggestions",
  hasBackBtn,
  isHome = true,
  currentSort,
  setCurrentSort,
  feedbackCount,
}: Props) => {
  const { refetch } = useGetFeedbackQuery({
    sort: currentSort,
  });
  return (
    <div className={styles.header}>
      <div className={styles.suggestions}>
        {hasIcon && (
          <div className={styles.icon}>
            <BulbIcon />
          </div>
        )}
        <div>
          {hasBackBtn && <GoBackBtn />}
          {feedbackCount && <h2>{`${feedbackCount} ${title}`}</h2>}
        </div>
        {isHome && (
          <>
            <span className={styles.span}>Sort by:</span>
            <Select
              value={currentSort}
              onChange={(e) => {
                setCurrentSort(e.target.value);
                refetch();
              }}
              className={styles.my_select}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="most_upvotes">Most Upvotes</MenuItem>
              <MenuItem value="least_upvotes">Least Upvotes</MenuItem>
              <MenuItem value="most_comments">Most Comments</MenuItem>
              <MenuItem value="least_comments">Least Comments</MenuItem>
            </Select>
          </>
        )}
      </div>
      <FeedBackBtn text="+ Add Feedback" />
    </div>
  );
};

export default Header;
