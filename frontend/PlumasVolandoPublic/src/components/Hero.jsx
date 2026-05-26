import React from "react";
import bannerInicio from "../assets/banner-inicio.png";

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <img
        src={bannerInicio}
        alt="Los mejores huevos del país"
        className="hero-banner-image"
      />
    </section>
  );
};

export default Hero;