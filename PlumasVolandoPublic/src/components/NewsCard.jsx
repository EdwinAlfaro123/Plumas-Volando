import React from "react";
import { CalendarDays, Newspaper } from "lucide-react";

const NewsCard = ({ article, onOpen }) => {
  return (
    <article className="news-card">
      <div className="news-card-top-line"></div>

      <div className="news-card-image">
        <img src={article.coverImage} alt={article.title} />
      </div>

      <div className="news-card-body">
        <div className="news-card-date">
          <CalendarDays size={14} />
          <span>{article.date}</span>
        </div>

        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>

        <button className="news-open-btn" onClick={() => onOpen(article)}>
          <Newspaper size={14} />
          Ver artículo completo
        </button>
      </div>
    </article>
  );
};

export default NewsCard;