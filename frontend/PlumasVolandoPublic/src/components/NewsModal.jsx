import React from "react";
import { X, CalendarDays } from "lucide-react";

const NewsModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <button className="news-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="news-modal-hero">
          <img src={article.coverImage} alt={article.title} />

          <div className="news-modal-hero-content">
            <div className="news-modal-date">
              <CalendarDays size={15} />
              <span>{article.date}</span>
            </div>

            <h2>{article.title}</h2>
            <p className="news-modal-summary">{article.summary}</p>
          </div>
        </div>

        <div className="news-modal-content">
          {article.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="news-modal-gallery">
          {article.gallery.map((image, index) => (
            <img key={index} src={image} alt={`${article.title} ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;