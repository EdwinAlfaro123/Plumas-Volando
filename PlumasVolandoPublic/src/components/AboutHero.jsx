import React from "react";

const AboutHero = () => {
  return (
    <section className="about-hero">
      <h1>Sobre Nosotros</h1>

      <div className="about-hero-content">
        <div className="about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80"
            alt="Granja avícola"
          />
        </div>

        <div className="about-hero-text">
          <h2>Compromiso con la Excelencia</h2>

          <p>
            En Plumas Volando nos dedicamos a proporcionar productos avícolas de
            la más alta calidad. Desde 2023, hemos trabajado incansablemente
            para ofrecer a nuestros clientes huevos frescos, gallinas saludables
            y productos que cumplen con los más altos estándares de calidad.
          </p>

          <p>
            Nuestro compromiso va más allá de la venta: nos preocupamos por
            brindar atención responsable, procesos sostenibles y un servicio
            cercano que genere confianza en cada pedido y en cada experiencia.
          </p>

          <p>
            Contamos con instalaciones modernas, personal capacitado y controles
            constantes que garantizan un producto confiable en cada etapa del
            proceso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;