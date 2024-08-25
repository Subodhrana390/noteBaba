import React from "react";
import Categories from "../components/Categories";
import Slide from "../components/slide";
import Listings from "../components/Listings";
import { useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect } from "react";

const HomePage = () => {
  const dispatch = useDispatch();

  const getFeedListings = async () => {
    try {
      const response = await fetch("http://localhost:3001/notes", {
        method: "GET",
      });

      const data = await response.json();
      dispatch(setListings({ listings: data }));
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, []);

  return (
    <div>
      <Slide />
      <Categories />
      <Listings />
    </div>
  );
};

export default HomePage;
