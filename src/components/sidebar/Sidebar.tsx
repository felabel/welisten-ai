import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { Button } from "@mui/material";
import { logout } from "../../store/authSlice";
import store from "../../store/store";
import {
  useGetCategoriesQuery,
  useGetStatusCountQuery,
} from "../../services/protectedApi";

export const logOutHandler = () => {
  store.dispatch(logout());
};

const Sidebar = ({ currentCategory, setCurrentCategory }: any) => {
  const navigate = useNavigate();
  const feedbackStatusCountuQery = useGetStatusCountQuery();
  const categoriesQueryResult = useGetCategoriesQuery();
  const categories = categoriesQueryResult.data?.categories;
  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <h1>Frontend Mentor</h1>
        <p>Feedback Board</p>
      </div>
      <div className={styles.filters}>
        {categories?.map((item: string, i: number) => (
          <button
            key={i}
            onClick={() => setCurrentCategory(item)}
            className={currentCategory === item ? styles.active : ""}
          >
            {item}
          </button>
        ))}
      </div>

      <div className={styles.roadmap} onClick={() => navigate("/roadmap")}>
        <h2>Roadmap</h2>
        <ul>
          {feedbackStatusCountuQery?.data?.statusCount?.map((item: any) => (
            <li>
              <div className={styles.inner_flex}>
                <div className={styles.dot}></div>
                <span className={styles.roadmap_name}>{item.name}</span>
              </div>
              <span className={styles.roadmap_count}>{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={() => logOutHandler()}>Log Out</Button>
    </div>
  );
};

export default Sidebar;
