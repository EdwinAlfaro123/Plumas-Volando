import React from "react";
import { Search } from "lucide-react";
import "../styles/SearchBar.css";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) => {
  return (
    <div className={`searchbar ${className}`}>
      <Search size={18} className="searchbar-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="searchbar-input"
      />
    </div>
  );
};

export default SearchBar;