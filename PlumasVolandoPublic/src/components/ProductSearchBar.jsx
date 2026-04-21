import React from "react";
import { Search } from "lucide-react";

const ProductSearchBar = ({ value, onChange }) => {
  return (
    <div className="products-searchbar">
      <Search size={16} />
      <input
        type="text"
        placeholder="Buscar producto..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ProductSearchBar;