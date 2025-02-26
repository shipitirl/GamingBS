import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Home.css';

// Separate Featured Section Component
const FeaturedSection = React.memo(({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="featured-section">
      <div className="carousel">
        {articles.slice(0, 4).map((article) => (
          <div 
            key={article.id || article._id || `featured-${article.title}`} 
            className="carousel-item"
          >
            <img 
              src={article.imageUrl || '/placeholder-news.jpg'} 
              alt={article.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-news.jpg';
              }}
            />
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
});

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Latest');
  const [initialized, setInitialized] = useState(false);

  const sampleArticles = useMemo(() => [
    {
      id: 'sample1',
      title: "Fellowship Takes the 'MM' Out of 'MMORPG' in a Super Fun Way",
      imageUrl: "/placeholder-game.jpg",
      description: "A gaming experience for those of discerning taste.",
      category: "Games",
      timestamp: "2 hours ago"
    },
    {
      id: 'sample2',
      title: "Who Are Marvel's New Avengers in the Multiverse Saga?",
      imageUrl: "/placeholder-movie.jpg",
      description: "Marvel's latest heroes take center stage.",
      category: "Movies",
      timestamp: "3 hours ago"
    },
    {
      id: 'sample3',
      title: "Latest Gaming News",
      imageUrl: "/placeholder-news.jpg",
      description: "The latest updates from the gaming world.",
      category: "Latest",
      timestamp: "4 hours ago"
    }
  ], []);

  const categories = useMemo(() => [
    'Latest',
    'Games',
    'Movies',
    'TV',
    'PlayStation',
    'Xbox',
    'Nintendo'
  ], []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/articles');
        setArticles(response.data);
        setError(null);
        setInitialized(true);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Unable to connect to server');
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory]); // Keep only activeCategory as dependency

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const displayArticles = articles.length > 0 ? articles : sampleArticles;

  if (!initialized) {
    return <div className="loading-spinner">Initializing...</div>;
  }

  return (
    <div className="home-container">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      <FeaturedSection articles={displayArticles} />

      <section className="latest-news">
        <h2>Latest News</h2>
        <div className="news-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
              disabled={loading}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner">Loading articles...</div>
        ) : (
          <div className="news-grid">
            {displayArticles.map((article) => (
              <div 
                key={article.id || article._id || `grid-${article.title}`} 
                className="news-item"
              >
                <img 
                  src={article.imageUrl || '/placeholder-news.jpg'} 
                  alt={article.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-news.jpg';
                  }}
                />
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p className="timestamp">
                    {article.timestamp || new Date(article.publishDate).toLocaleDateString()}
                  </p>
                  <p className="description">{article.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
