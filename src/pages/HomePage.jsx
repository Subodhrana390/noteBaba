import React from "react";
import Hero from "../components/Hero";
import LatestUpdates from "../components/LatestUpdates";
import CategoryBySemester from "../components/CategoryBySemester";
import Categories from "../components/Categories";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <LatestUpdates />
      <Categories />
      <CategoryBySemester />
    </div>
  );
};

export default HomePage;
