import huevo1 from "../assets/huevos1.jpg";
import huevo2 from "../assets/huevos2.jpg";
import gallina1 from "../assets/gallina1.jpg";
import gallina2 from "../assets/gallina2.webp";
import insumo1 from "../assets/insumo1.webp";
import insumo2 from "../assets/insumo2.jpg";

export const productsData = [
  {
    id: 1,
    name: "Huevos pequeños",
    category: "huevos",
    image: huevo1,
    description: "Docena de huevos frescos tamaño pequeño.",
    weight: "5 kg",
    rating: 4.3,
    price: 3.99,
  },
  {
    id: 2,
    name: "Huevos medianos",
    category: "huevos",
    image: huevo2,
    description: "Huevos frescos de tamaño mediano y gran calidad.",
    weight: "6 kg",
    rating: 4.6,
    price: 5.99,
  },
  {
    id: 3,
    name: "Gallina Leghorn blanca",
    category: "gallinas",
    image: gallina1,
    description: "Raza ligera, ideal para postura alta de huevos.",
    weight: "3.5 kg",
    rating: 4.8,
    price: 24.5,
  },
  {
    id: 4,
    name: "Gallina Rhode Island",
    category: "gallinas",
    image: gallina2,
    description: "Gallina ponedora resistente y de buena producción.",
    weight: "4 kg",
    rating: 4.5,
    price: 22.0,
  },
  {
    id: 5,
    name: "Alimento de pollo",
    category: "insumos",
    image: insumo1,
    description: "Alimento balanceado especial para pollitos.",
    weight: "40 kg",
    rating: 4.7,
    price: 19.5,
  },
  {
    id: 6,
    name: "Alimento de pollito Premium",
    category: "insumos",
    image: insumo2,
    description: "Fórmula premium para crecimiento saludable.",
    weight: "40 kg",
    rating: 4.9,
    price: 24.9,
  },
];

export const filterOptions = [
  { label: "Todos", value: "todos" },
  { label: "Huevos", value: "huevos" },
  { label: "Gallinas", value: "gallinas" },
  { label: "Insumos", value: "insumos" },
];