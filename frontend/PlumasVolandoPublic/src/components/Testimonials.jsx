import React from "react";
import "../styles/Inicio.css";

const testimonials = [
  {
    id: 1,
    name: "Carlos Martínez",
    role: "Cliente frecuente",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Excelente calidad en los huevos, siempre frescos y con un sabor increíble. Definitivamente los mejores del país.",
    rating: 5,
  },
  {
    id: 2,
    name: "María López",
    role: "Chef",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Trabajo con estos productos en mi restaurante y nunca me han fallado. Calidad premium siempre.",
    rating: 5,
  },
  {
    id: 3,
    name: "José Pérez",
    role: "Cliente",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    text: "Entrega rápida, atención excelente y productos de primera. Muy recomendados.",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2>Testimonios de nuestros clientes</h2>

      <div className="testimonials-grid">
        {testimonials.map((item) => (
          <div className="testimonial-card" key={item.id}>
            <div className="testimonial-header">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>

            <p className="testimonial-text">"{item.text}"</p>

            <div className="stars">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;