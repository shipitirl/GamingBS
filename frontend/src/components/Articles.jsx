import { useEffect, useState } from "react";
import { fetchArticles, upvoteArticle } from "../utils/articleUtils";
import PropTypes from "prop-types";

function Articles({ onSelectArticle }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetchArticles().then(setArticles);
    }, []);

    return (
        <div className="articles">
            <h2>Top Articles</h2>
            {articles.map(article => (
                <div key={article._id} className="article-card">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <p>By: {article.author}</p>
                    <p>Upvotes: {article.upvotes}</p>
                    <button onClick={() => upvoteArticle(article._id)}>Upvote</button>
                    <button onClick={() => onSelectArticle(article._id)}>View Comments</button>
                </div>
            ))}
        </div>
    );
}

Articles.propTypes = {
    onSelectArticle: PropTypes.func.isRequired,
};

export default Articles;
