import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export async function fetchArticles() {
    try {
        const response = await fetch("https://your-backend-url.onrender.com/articles");
        if (!response.ok) throw new Error("Failed to fetch articles");
        return response.json();
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
}

export async function upvoteArticle(articleId) {
    try {
        const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/upvote`, {
            method: "POST",
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        }
        return data;
    } catch (error) {
        console.error("Error upvoting article:", error);
        return null;
    }
}

function Articles({ onSelectArticle }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetchArticles().then(setArticles);
    }, []);

    const handleUpvote = async (articleId) => {
        const updatedArticle = await upvoteArticle(articleId);
        if (updatedArticle) {
            setArticles(articles.map(article => 
                article._id === articleId ? { ...article, upvotes: updatedArticle.upvotes } : article
            ));
        }
    };

    return (
        <div className="articles">
            <h2>Top Articles</h2>
            {articles.map(article => (
                <div key={article._id} className="article-card">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <p>By: {article.author}</p>
                    <p>Upvotes: {article.upvotes}</p>
                    <button onClick={() => handleUpvote(article._id)}>Upvote</button>
                    <button onClick={() => onSelectArticle(article._id)}>View Comments</button>
                </div>
            ))}
        </div>
    );
}

Articles.propTypes = {
    onSelectArticle: PropTypes.func.isRequired, // Ensure it's a function
};

export default Articles;
