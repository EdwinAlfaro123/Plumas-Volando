import React from "react";
import { Clock3, ChefHat } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";

const RecipeCard = ({ recipe, onOpen }) => {
  return (
    <article className="recipe-card">
      <div className="recipe-card-top-line"></div>

      <div className="recipe-card-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>

      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>

        <div className="recipe-card-meta">
          <div className="recipe-meta-item">
            <Clock3 size={14} />
            <span>{recipe.time}</span>
          </div>

          <div className="recipe-meta-item">
            <ChefHat size={14} />
            <DifficultyBadge level={recipe.difficulty} />
          </div>
        </div>

        <button className="recipe-open-btn" onClick={() => onOpen(recipe)}>
          Ver receta completa
        </button>
      </div>
    </article>
  );
};

export default RecipeCard;