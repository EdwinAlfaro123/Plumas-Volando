import React from "react";
import { CalendarDays } from "lucide-react";
import "../styles/DateFilter.css";

const DateFilter = ({
  label = "Hasta",
  id = "date-filter",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`datefilter ${className}`}>
      <label htmlFor={id} className="datefilter-label">
        {label}
      </label>

      <div className="datefilter-box">
        <CalendarDays size={18} className="datefilter-icon" />
        <input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          className="datefilter-input"
        />
      </div>
    </div>
  );
};

export default DateFilter;