import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Articles from "./components/Articles";
import Comments from "./components/Comments";
import Auth from "./components/Auth";
import WriterRankings from "./components/WriterRankings";
import TopComments from "./components/TopComments";
import JournalistDashboard from "./pages/JournalistDashboard";
import "./App.css"; // Add styling for navigation

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <Router>
      <div className="container">
        {/* ✅ Navigation Bar */}
        <nav className="navbar">
          <h1>GamingBS Journal</h1>
          <ul>
            <li><Link to="/">🏠 Home</Link></li>
            <li><Link to="/journalist-dashboard">📝 Journalist Dashboard</Link></li>
          </ul>
        </nav>

        <Auth />

        <Routes>
          <Route
            path="/"
            element={
              <div className="content">
                <Articles onSelectArticle={setSelectedArticle} />
                {selectedArticle && <Comments articleId={selectedArticle} />}
              </div>
            }
          />
          <Route path="/journalist-dashboard" element={<JournalistDashboard />} />
        </Routes>

        <aside>
          <TopComments />
          <WriterRankings />
        </aside>
      </div>
    </Router>
  );
}

export default App;
