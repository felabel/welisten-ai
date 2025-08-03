import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import Content from "../components/content/Content";

function Home() {
  const [currentCategory, setCurrentCategory] = useState("all");
  const [currentSort, setCurrentSort] = useState("most_upvotes");
  const [feedbackCount, setFeedbackCount] = useState();

  return (
    <div className="app">
      <aside>
        <Sidebar
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
        />
      </aside>
      <main>
        <Header
          currentSort={currentSort}
          setCurrentSort={setCurrentSort}
          feedbackCount={feedbackCount}
        />
        <Content
          currentCategory={currentCategory}
          currentSort={currentSort}
          setFeedbackCount={setFeedbackCount}
        />
      </main>
    </div>
  );
}

export default Home;
