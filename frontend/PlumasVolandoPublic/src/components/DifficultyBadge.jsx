import React from "react";

const normalizeDifficulty = (text = "") => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const DifficultyBadge = ({ level }) => {
  const safeLevel = level || "Media";
  const normalizedLevel = normalizeDifficulty(safeLevel);

  return (
    <span className={`difficulty-badge difficulty-${normalizedLevel}`}>
      {safeLevel}
    </span>
  );
};

export default DifficultyBadge;