import React from "react";
import ShiftList from "../components/ShiftList";
import LocationMenu from "../components/LocationMenu";
import Calendar from "../components/Calendar";

const Home = () => {
  return (
    <div className="container">
      <LocationMenu />
      <ShiftList />
      <Calendar />
    </div>
  );
};

export default Home;
