import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Articles from "./components/Articles";
import Comments from "./components/Comments";
import Auth from "./components/Auth";
import WriterRankings from "./components/WriterRankings";
import TopComments from "./components/TopComments";
import JournalistDashboard from "./components/JournalistDashboard";
import "./style.css"; 

function App() {
  return (
    <Router>
      <div className="container">
        <h1>GamingBS Journal</h1>
        <Auth />

        {/* Navigation Links */}
        <nav>
          <Link to="/">Home</Link>
          <Link to="/journalist-dashboard">Journalist Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Articles />} />
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
