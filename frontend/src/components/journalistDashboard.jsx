import { useState, useEffect } from "react";
import axios from "axios";
import "./JournalistDashboard.css"; // CSS for styling

const JournalistDashboard = () => {
  const [article, setArticle] = useState({ title: "", description: "", image: "", tags: "" });
  const [articles, setArticles] = useState([]); // List of submitted articles
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("https://your-backend.onrender.com/articles");
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://your-backend.onrender.com/articles", {
        ...article,
        tags: article.tags.split(",").map(tag => tag.trim()), // Convert tags to array
        author: "Journalist Name", // Replace with authenticated user later
      });
      alert("✅ Article submitted successfully!");
      setArticle({ title: "", description: "", image: "", tags: "" });
      fetchArticles(); // Refresh articles list after submitting
    } catch (error) {
      console.error("❌ Error submitting article:", error);
      alert("❌ Failed to submit article!");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📝 Write a New Article</h2>
      <form onSubmit={handleSubmit} className="article-form">
        <input type="text" name="title" placeholder="Title" value={article.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Write your article here..." value={article.description} onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL (optional)" value={article.image} onChange={handleChange} />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={article.tags} onChange={handleChange} />
        <button type="submit">Publish Article</button>
      </form>

      <h3>📜 Your Articles</h3>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <div className="articles-list">
          {articles.length === 0 ? (
            <p>No articles published yet.</p>
          ) : (
            articles.map((art) => (
              <div key={art._id} className="article-card">
                <h4>{art.title}</h4>
                <p>{art.description}</p>
                {art.image && <img src={art.image} alt={art.title} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JournalistDashboard;
