import React from "react";
import { Check } from "lucide-react";

const benefits = [
  "Contamos con un buen servicio al cliente para orientarte y resolver tus dudas.",
  "Brindamos servicio a domicilio en zonas específicas con cobertura definida.",
  "Ofrecemos un canal cómodo para que puedas ver productos y realizar pedidos.",
];

const BenefitsSection = () => {
  return (
    <section className="benefits-section" id="nosotros">
      <div className="benefits-title">
        <h2>Nosotros brindamos</h2>

        <div className="benefits-photo">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80"
            alt="Equipo trabajando"
          />
        </div>
      </div>

      <div className="benefits-list">
        {benefits.map((item, index) => (
          <div className="benefit-item" key={index}>
            <Check size={18} />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;