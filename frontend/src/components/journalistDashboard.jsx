import { useState, useEffect } from "react";
import axios from "axios";
import "./JournalistDashboard.css"; // CSS for styling

const JournalistDashboard = () => {
  const [article, setArticle] = useState({ title: "", content: "", image: "", tags: "" });
  const [articles, setArticles] = useState([]); // List of submitted articles

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("https://your-backend-url.com/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://your-backend-url.com/articles", { 
        ...article, 
        tags: article.tags.split(","), // Convert tags to array
        author: "Journalist Name" // Replace with actual user authentication later
      });
      alert("Article submitted!");
      setArticle({ title: "", content: "", image: "", tags: "" });
      fetchArticles(); // Refresh list after submitting
    } catch (error) {
      console.error("Error submitting article:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📝 Write a New Article</h2>
      <form onSubmit={handleSubmit} className="article-form">
        <input type="text" name="title" placeholder="Title" value={article.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Write your article here..." value={article.content} onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL" value={article.image} onChange={handleChange} />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={article.tags} onChange={handleChange} />
        <button type="submit">Publish Article</button>
      </form>

      <h3>📜 Your Articles</h3>
      <div className="articles-list">
        {articles.map((art) => (
          <div key={art._id} className="article-card">
            <h4>{art.title}</h4>
            <p>{art.description}</p>
            {art.image && <img src={art.image} alt={art.title} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalistDashboard;
