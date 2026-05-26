import React from "react";
import { X, ExternalLink, Clock3, ChefHat, PlayCircle, ListChecks } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="recipe-modal-overlay" onClick={onClose}>
      <div
        className="recipe-modal modern-recipe-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recipe-modal-close" onClick={onClose} aria-label="Cerrar modal">
          <X size={18} />
        </button>

        <div className="recipe-modal-hero">
          <div className="recipe-modal-image-box">
            <img src={recipe.image} alt={recipe.title} />
          </div>

          <div className="recipe-modal-summary">
            <span className="recipe-modal-kicker">Receta destacada</span>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>

            <div className="recipe-modal-chips">
              <div className="recipe-chip">
                <Clock3 size={15} />
                <span>{recipe.time}</span>
              </div>

              <div className="recipe-chip">
                <ChefHat size={15} />
                <DifficultyBadge level={recipe.difficulty} />
              </div>
            </div>

            <a
              href={recipe.link}
              target="_blank"
              rel="noreferrer"
              className="recipe-link-btn"
            >
              <ExternalLink size={16} />
              Ver receta completa
            </a>
          </div>
        </div>

        <div className="recipe-modal-layout">
          <div className="recipe-modal-left">
            <section className="recipe-modal-card">
              <div className="recipe-section-title">
                <ListChecks size={18} />
                <h3>Ingredientes</h3>
              </div>

              <ul className="recipe-ingredients-list">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="recipe-modal-card">
              <div className="recipe-section-title">
                <ChefHat size={18} />
                <h3>Pasos</h3>
              </div>

              <ol className="recipe-steps-list">
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>
          </div>

          <div className="recipe-modal-right">
            <section className="recipe-modal-card recipe-video-card">
              <div className="recipe-section-title">
                <PlayCircle size={18} />
                <h3>Video de la receta</h3>
              </div>

              <div className="recipe-video-wrapper">
                <iframe
                  src={recipe.video}
                  title={recipe.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;