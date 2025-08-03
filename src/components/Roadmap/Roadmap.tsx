// Roadmap.tsx
import React from "react";
import RoadmapCard from "./RoapmapCard";
import Tabs from "./Tabs";
import styles from "./Roadmap.module.scss";
import Header from "../header/Header";
import {
  useGetFeedbackQuery,
  useUpdateFeedbackStatusMutation,
} from "../../services/protectedApi";

type Card = {
  id: string;
  status: string;
  title: string;
  detail: string;
  category: string;
  upvotes: number;
  comments: { length: number };
};

type RoadmapData = {
  planned: Card[];
  inProgress: Card[];
  live: Card[];
};

const Roadmap: React.FC = () => {
  const { data: feedbackQueryResult, refetch } = useGetFeedbackQuery({});
  const [updateFeedbackStatus] = useUpdateFeedbackStatusMutation();

  // Transform the feedback data into our RoadmapData structure
  const transformFeedbackData = (feedbacks: any[]): RoadmapData => {
    return {
      planned: feedbacks.filter((fb) => fb.status === "Planned"),
      inProgress: feedbacks.filter((fb) => fb.status === "InProgress"),
      live: feedbacks.filter((fb) => fb.status === "Live"),
    };
  };

  const roadmapData = feedbackQueryResult?.feedbacks
    ? transformFeedbackData(feedbackQueryResult.feedbacks)
    : { planned: [], inProgress: [], live: [] };

  const handleDrag = (
    event: React.DragEvent,
    card: Card,
    oldCategory: keyof RoadmapData
  ) => {
    event.dataTransfer.setData(
      "cardData",
      JSON.stringify({ card, oldCategory })
    );
  };

  const handleDrop = async (
    event: React.DragEvent,
    newCategory: keyof RoadmapData
  ) => {
    const { card } = JSON.parse(event.dataTransfer.getData("cardData"));

    // Determine the new status based on the category
    const newStatus =
      newCategory === "planned"
        ? "Planned"
        : newCategory === "inProgress"
        ? "InProgress"
        : "Live";

    try {
      // Update the status on the server
      await updateFeedbackStatus({
        id: card.id,
        status: newStatus,
      }).unwrap();

      // Refetch the data to get the updated state
      refetch();
    } catch (error) {
      console.error("Failed to update feedback status:", error);
      // You might want to show an error message to the user here
    }
  };

  const renderCards = (category: keyof RoadmapData) => {
    return roadmapData[category].map((card) => (
      <div
        key={card.id}
        draggable
        onDragStart={(e) => handleDrag(e, card, category)}
        onDragOver={(e) => e.preventDefault()}
        className={styles.cardWrapper}
        style={{ marginBottom: "1rem" }}
      >
        <RoadmapCard
          id={card.id}
          status={card.status}
          title={card.title}
          description={card.detail}
          category={card.category}
          votes={card.upvotes}
          comments={card.comments?.length || 0}
        />
      </div>
    ));
  };

  const renderTabsContent = () => {
    const tabItems = [
      { label: "Planned", count: roadmapData.planned.length },
      { label: "In Progress", count: roadmapData.inProgress.length },
      { label: "Live", count: roadmapData.live.length },
    ];

    return (
      <Tabs tabs={tabItems}>
        <div className={styles.tabContent}>{renderCards("planned")}</div>
        <div className={styles.tabContent}>{renderCards("inProgress")}</div>
        <div className={styles.tabContent}>{renderCards("live")}</div>
      </Tabs>
    );
  };
  const categoryData = [
    { category: "planned", summary: "Ideas prioritized for research" },
    { category: "inProgress", summary: "Currently being developed" },
    { category: "live", summary: "Released features" },
  ];

  return (
    <>
      <div className={styles.container}>
        <Header
          hasIcon={false}
          title="Roadmap"
          hasBackBtn={true}
          isHome={false}
        />
        <div className={styles.roadmap}>
          {categoryData
            .map((data) => data.category as keyof RoadmapData)
            .filter((category) => roadmapData[category])
            .map((category) => (
              <div
                key={category}
                className={styles.category}
                onDrop={(e) => handleDrop(e, category)}
                onDragOver={(e) => e.preventDefault()}
              >
                <h2 className={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                  ({roadmapData[category]?.length || 0})
                </h2>
                <p className={styles.summary}>
                  {
                    categoryData.find((data) => data.category === category)
                      ?.summary
                  }
                </p>
                <div className={styles.cardList}>
                  {roadmapData[category] && renderCards(category)}
                </div>
              </div>
            ))}
        </div>

        <div className={styles.mobileRoadmap}>{renderTabsContent()}</div>
      </div>
    </>
  );
};

export default Roadmap;
