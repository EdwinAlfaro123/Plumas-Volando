import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeGrid from "../components/RecipeGrid";
import RecipeModal from "../components/RecipeModal";
import { recipesData } from "../data/recipesData";
import "../styles/Recipes.css";

const RecipesPage = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openRecipeModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipes-page">
      <div className="recipes-page-frame">
        <Header />

        <main className="recipes-main">
          <h1>Recetas Deliciosas</h1>
          <p className="recipes-subtitle">
            Descubre las mejores recetas para preparar con nuestros huevos frescos.
            Desde desayunos rápidos hasta platos gourmet, tenemos opciones para
            todos los gustos y niveles de experiencia.
          </p>

          <RecipeGrid recipes={recipesData} onOpen={openRecipeModal} />
        </main>

        <Footer />

        <RecipeModal recipe={selectedRecipe} onClose={closeRecipeModal} />
      </div>
    </div>
  );
};

export default RecipesPage;