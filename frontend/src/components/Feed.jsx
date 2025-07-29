import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="w-full px-2 sm:pl-[20%] my-8 flex flex-col items-center">
      <Posts />
    </div>
  );
};

export default Feed;
