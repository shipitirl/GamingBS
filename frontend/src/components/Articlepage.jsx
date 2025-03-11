import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ArticlePage() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const backendUrl = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${backendUrl}/api/articles/${articleId}`)
      .then(response => response.json())
      .then(data => setArticle(data))
      .catch(error => console.error('Error fetching article:', error));
  }, [articleId]);

  if (!article) return <div>Loading...</div>;

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <div>
        <span>Category: {article.category}</span>
        <span> By: {article.author}</span>
      </div>
      <img src={`${backendUrl}${article.image}`} alt={article.title} style={{ maxWidth: '100%' }} />
      <p>{article.description}</p>
      <div>Tags: {article.tags.join(', ')}</div>
      <div>
        Published: {new Date(article.publishDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
      <p>Upvotes: {article.upvotes || 0}</p>
    </div>
  );
}

export default ArticlePage;