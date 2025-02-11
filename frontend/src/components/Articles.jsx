import { useEffect, useState } from "react";

export async function fetchArticles() {
    const response = await fetch("https://your-backend-url.onrender.com/articles");
    return response.json();
}

export async function upvoteArticle(articleId) {
    const response = await fetch(`https://your-backend-url.onrender.com/articles/${articleId}/upvote`, {
        method: "POST",
    });

    const data = await response.json();
    if (data.error) {
        alert(data.error);
    }
    return data;
}

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

export default Articles;
