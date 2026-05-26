import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsGrid from "../components/NewsGrid";
import NewsModal from "../components/NewsModal";
import { newsData } from "../data/newsData";
import "../styles/News.css";

const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleOpenArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="news-page">
      <div className="news-page-frame">
        <Header />

        <main className="news-main">
          <h1>Noticias y Novedades</h1>
          <p className="news-subtitle">
            Mantente al día con las últimas noticias, expansiones y logros de
            Plumas Volando.
          </p>

          <NewsGrid articles={newsData} onOpen={handleOpenArticle} />
        </main>

        <Footer />

        <NewsModal article={selectedArticle} onClose={handleCloseArticle} />
      </div>
    </div>
  );
};

export default NewsPage;