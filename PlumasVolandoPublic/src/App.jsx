import { BrowserRouter, Routes, Route } from "react-router";
import InicioPage from "./pages/InicioPage";
import AboutUsPage from "./pages/AboutUsPage";
import ProductsPage from "./pages/ProductsPage";
import RecipesPage from "./pages/RecipesPage";
import NewsPage from "./pages/NewsPage";
import PointsOfSalePage from "./pages/PointsOfSalePage";
import ShoppingCarPage from "./pages/ShoppingCarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/points-of-sale" element={<PointsOfSalePage />} />
        <Route path="/cart" element={<ShoppingCarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;