import React from "react";
import NewsCard from "./NewsCard";

const NewsGrid = ({ articles, onOpen }) => {
  if (!articles || articles.length === 0) {
    return <p className="news-empty">No hay noticias disponibles.</p>;
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default NewsGrid;