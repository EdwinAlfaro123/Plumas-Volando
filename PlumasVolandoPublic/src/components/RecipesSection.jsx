import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import { recipesData } from "../data/recipesData";

const RecipesSection = () => {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const featuredRecipes = useMemo(() => {
    return recipesData.slice(0, 3);
  }, []);

  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
  };

  const handleGoToRecipes = () => {
    navigate("/recipes");
  };

  return (
    <section className="recipes-section" id="recetas">
      <h2>Recetas Recomendadas</h2>

      <div className="home-recipes-grid">
        {featuredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onOpen={handleOpenRecipe}
          />
        ))}
      </div>

      <button className="primary-btn" onClick={handleGoToRecipes}>
        Ver más
      </button>

      <RecipeModal recipe={selectedRecipe} onClose={handleCloseRecipe} />
    </section>
  );
};

export default RecipesSection;