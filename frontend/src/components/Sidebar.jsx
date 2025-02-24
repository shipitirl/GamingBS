import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo and Upgrade Section */}
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <i className="fas fa-gamepad"></i> GamingBS
        </Link>
        
        <div className="upgrade-box">
          <h3>Upgrade to <span className="plus">PLUS</span></h3>
          <p>No ads, unlimited game maps, free games, discounts and more.</p>
          <button className="benefits-button">See all the benefits</button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        
        <Link to="/journalist" className="nav-item">
          <i className="fas fa-newspaper"></i>
          <span>Journalist Dashboard</span>
        </Link>
        
        <Link to="/articles" className="nav-item">
          <i className="fas fa-newspaper"></i>
          <span>Articles</span>
        </Link>
        
        <Link to="/search" className="nav-item">
          <i className="fas fa-search"></i>
          <span>Search</span>
        </Link>
        
        <Link to="/reviews" className="nav-item">
          <i className="fas fa-star"></i>
          <span>Reviews</span>
        </Link>
        
        <Link to="/news" className="nav-item">
          <i className="fas fa-newspaper"></i>
          <span>News</span>
        </Link>
        
        <Link to="/videos" className="nav-item">
          <i className="fas fa-tv"></i>
          <span>Videos</span>
        </Link>
        
        <Link to="/games" className="nav-item">
          <i className="fas fa-gamepad"></i>
          <span>Games</span>
        </Link>
        
        <Link to="/pc" className="nav-item">
          <i className="fas fa-desktop"></i>
          <span>PC</span>
        </Link>
        
        <Link to="/guides" className="nav-item">
          <i className="fas fa-book"></i>
          <span>Guides</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
