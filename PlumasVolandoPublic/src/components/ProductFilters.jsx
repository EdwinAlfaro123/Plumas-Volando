import React from "react";

const ProductFilters = ({ filters, activeFilter, onChange }) => {
  return (
    <div className="products-filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`products-filter-btn ${
            activeFilter === filter.value ? "active" : ""
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default ProductFilters;