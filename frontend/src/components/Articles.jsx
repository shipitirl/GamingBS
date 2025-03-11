import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchArticles, upvoteArticle } from "./utils/articleUtils";
import PropTypes from "prop-types";
import './Articles.css';

function Articles({ onSelectArticle }) {
    const [articles, setArticles] = useState([]);
    const backendUrl = 'http://localhost:3001';
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticles().then(setArticles);
    }, []);

    const handleArticleClick = (articleId, e) => {
        if (e.target.tagName !== 'BUTTON') {
            navigate(`/article/${articleId}`);
        }
    };

    return (
        <div className="articles">
            <h2>Top Articles</h2>
            {articles.map(article => (
                <div 
                    key={article._id} 
                    className="article-card" 
                    onClick={(e) => handleArticleClick(article._id, e)} 
                    style={{ cursor: 'pointer' }}
                >
                    <div className="article-divider">----------------------------------------</div>
                    <h3 className="article-title">{article.title}</h3>
                    <div className="article-divider">----------------------------------------</div>
                    <div>
                        <span className="article-category">Category: {article.category}</span>
                        <span className="article-author">By: {article.author}</span>
                    </div>
                    <img src={`${backendUrl}${article.image}`} alt="Article" className="article-image" />
                    <p className="article-description">{article.description}</p>
                    <div className="article-tags">Tags: {article.tags.join(', ')}</div>
                    <div className="article-date">
                        Published: {new Date(article.publishDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </div>
                    <p>Upvotes: {article.upvotes || 0}</p>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        upvoteArticle(article._id).then(() => fetchArticles().then(setArticles));
                    }}>
                        Upvote
                    </button>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onSelectArticle(article._id);
                    }}>
                        View Comments
                    </button>
                </div>
            ))}
        </div>
    );
}

Articles.propTypes = {
    onSelectArticle: PropTypes.func.isRequired,
};

export default Articles;