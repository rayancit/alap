import React from "react";
import { CiSearch } from "react-icons/ci";
const Search = ({ searchValue, onSearch }) => {
  return (
    <div className="w-full relative  ">
      <CiSearch className="absolute top-5 right-3" />
      <input
        type="text"
        placeholder="Search"
        className="py-4 px-5 w-full border rounded-xl border-cyan-700 outline-transparent"
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
