import React from "react";
import RecipeCard from "./RecipeCard";

const RecipeGrid = ({ recipes, onOpen }) => {
  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default RecipeGrid;