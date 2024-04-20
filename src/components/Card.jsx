import React from "react";
import Search from "./layouts/Search";

const Card = ({ title, children, onSearch,searchValue }) => {
  return (
    <div className="w-[32%] ">
      <Search onSearch={onSearch} searchValue={searchValue}/>
      <h2 className="text-2xl capitalize font-bold my-2 px-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
