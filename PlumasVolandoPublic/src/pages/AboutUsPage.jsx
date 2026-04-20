import React from "react";
import {
  ShieldCheck,
  Truck,
  Leaf,
  BriefcaseBusiness,
  Microscope,
  HeartPulse,
  Store,
  UserRoundCog,
  Globe,
} from "lucide-react";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AboutHero from "../components/AboutHero.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import ServiceCard from "../components/ServicesCard.jsx";
import "../styles/AboutUs.css";

const features = [
  {
    id: 1,
    icon: <ShieldCheck size={26} />,
    title: "Calidad Premium",
    text: "Productos certificados y de la más alta calidad.",
  },
  {
    id: 2,
    icon: <Truck size={26} />,
    title: "Entrega Rápida",
    text: "Servicio de entrega el mismo día en área metropolitana.",
  },
  {
    id: 3,
    icon: <Leaf size={26} />,
    title: "Orgánico",
    text: "Gallinas de libre pastoreo alimentadas naturalmente.",
  },
  {
    id: 4,
    icon: <BriefcaseBusiness size={26} />,
    title: "Experiencia",
    text: "Más de 5 años en el sector avícola.",
  },
  {
    id: 5,
    icon: <Microscope size={26} />,
    title: "Control de Calidad",
    text: "Laboratorio propio para análisis constante.",
  },
  {
    id: 6,
    icon: <HeartPulse size={26} />,
    title: "Cuidado de Calidad",
    text: "Equipo veterinario de buena calidad y dedicación.",
  },
];

const services = [
  {
    id: 1,
    icon: <Store size={34} />,
    title: "Venta al Mayoreo",
    text: "Suministro constante para restaurantes, hoteles y supermercados con precio especial.",
  },
  {
    id: 2,
    icon: <Store size={34} />,
    title: "Venta al Detalle",
    text: "Productos frescos directamente en nuestra tienda física con atención personalizada.",
  },
  {
    id: 3,
    icon: <UserRoundCog size={34} />,
    title: "Asesoría Técnica",
    text: "Capacitación gratuita en crianza de aves y manejo de producción avícola.",
  },
  {
    id: 4,
    icon: <Globe size={34} />,
    title: "Venta en Línea",
    text: "Realiza tus pedidos desde casa con entrega a domicilio o nivel nacional.",
  },
];

const AboutUsPage = () => {
  return (
    <div className="about-page">
      <div className="about-page-frame">
        <Header />

        <main className="about-main">
          <AboutHero />

          <section className="about-features-section">
            <div className="about-features-grid">
              {features.map((item) => (
                <FeatureCard
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </section>

          <section className="about-services-section">
            <h2>Nuestros Servicios</h2>

            <div className="about-services-grid">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  text={service.text}
                />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;