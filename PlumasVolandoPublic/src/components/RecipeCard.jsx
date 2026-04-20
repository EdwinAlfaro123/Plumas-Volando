import React from "react";
import { Star } from "lucide-react";

const RecipeCard = ({ recipe }) => {
  return (
    <article className="recipe-card">
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-card-body">
        <h4>{recipe.title}</h4>
        <p>{recipe.description}</p>

        <div className="recipe-meta">
          <span>
            <Star size={14} />
            {recipe.rating}
          </span>
          <span>{recipe.time}</span>
        </div>

        <button className="card-btn">Ver receta</button>
      </div>
    </article>
  );
};

export default RecipeCard;