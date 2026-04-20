import React from "react";
import RecipeCard from "./RecipeCard";

const recipes = [
  {
    id: 1,
    title: "Huevo Ranchero Clásico",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    description:
      "Delicioso huevo con salsa ranchera picante y tortillas crujientes.",
    rating: 4.8,
    time: "20 min",
  },
  {
    id: 2,
    title: "Tortilla Española",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
    description:
      "La tradicional tortilla de patata española con todo su sabor.",
    rating: 4.6,
    time: "35 min",
  },
  {
    id: 3,
    title: "Huevos Benedictinos",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
    description:
      "Elegancia al plato con huevos, pan y salsa holandesa.",
    rating: 4.9,
    time: "25 min",
  },
];

const RecipesSection = () => {
  return (
    <section className="recipes-section" id="recetas">
      <h2>Recetas Recomendadas</h2>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <button className="primary-btn">Ver más</button>
    </section>
  );
};

export default RecipesSection;