import { BrowserRouter, Routes, Route } from "react-router";
import InicioPage from "./pages/InicioPage";
import AboutUsPage from "./pages/AboutUsPage";
import ProductsPage from "./pages/ProductsPage";
import ShoppingCarPage from "./pages/ShoppingCarPage";
import RecipesPage from "./pages/RecipesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<ShoppingCarPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;