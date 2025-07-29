import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div className="flex">
      {/* Left Sidebar fixed width = 16% (~64px to 250px on normal screen) */}
      <div className="flex flex-col sm:flex-row w-full">
        <div className="w-full">
          <Feed />
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
