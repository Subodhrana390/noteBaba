import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/LatestUpdates.scss";
import ArticleIcon from "@mui/icons-material/Article";

const LatestUpdates = () => {
  const scrollRef = useRef(null);
  const speed = 0.5; // Adjust this value for faster or slower scrolling

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const smoothScroll = () => {
      if (scrollContainer) {
        scrollAmount += speed;
        scrollContainer.scrollTop = scrollAmount;

        if (
          scrollAmount >=
          scrollContainer.scrollHeight - scrollContainer.clientHeight
        ) {
          scrollAmount = 0; // Reset scroll position when the end is reached
        }

        requestAnimationFrame(smoothScroll); // Request the next frame for smooth animation
      }
    };

    smoothScroll(); // Start the scroll loop

    return () => cancelAnimationFrame(smoothScroll); // Cleanup on unmount
  }, []);

  const listItemVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="Latest_Updates"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1 className="Latest_Updates_title">Latest Updates</h1>
      <div className="Border"></div>
      <ul className="Updates_News" ref={scrollRef}>
        {[
          "Math 3rd Semester Notes",
          "Free Courses",
          "New Coding Resources",
          "Exam Tips",
          "Upcoming Events",
          "Career Opportunities",
          "Scholarship Info",
        ].map((item, index) => (
          <motion.li
            key={index}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
          >
            <span>
              <ArticleIcon />
            </span>
            <a href="#">{item}</a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default LatestUpdates;
