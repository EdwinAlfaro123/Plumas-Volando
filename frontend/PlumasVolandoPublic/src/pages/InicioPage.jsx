import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Testimonios from "../components/Testimonials.jsx";
import RecipesSection from "../components/RecipesSection.jsx";
import BenefitsSection from "../components/BenefitsSection.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/Inicio.css";

const InicioPage = () => {
  return (
    <div className="recipe-page">
      <div className="recipe-phone-frame">
        <Header />
        <Hero />
        <Testimonios />
        <div className="wave-divider"></div>
        <RecipesSection />
        <BenefitsSection />
        <Footer />
      </div>
    </div>
  );
};

export default InicioPage;