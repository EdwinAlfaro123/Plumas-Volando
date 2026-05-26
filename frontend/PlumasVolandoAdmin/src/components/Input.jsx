import React from "react";

const CustomInput = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = false,
  icon,
  rightElement,
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="neo-input">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightElement ? rightElement : icon}
      </div>
    </div>
  );
};

export default CustomInput;