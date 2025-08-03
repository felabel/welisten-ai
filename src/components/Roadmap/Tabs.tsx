// Tabs.tsx
import React, { useState, ReactNode } from "react";
import styles from "./Tabs.module.scss";

type TabItem = {
  label: string;
  count?: number;
};

type TabsProps = {
  tabs: TabItem[];
  children: ReactNode[];
};

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              activeTab === index ? styles.active : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={styles.tabCount}>({tab.count})</span>
            )}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{children[activeTab]}</div>
    </div>
  );
};

export default Tabs;
