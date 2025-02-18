import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Articles from "./components/Articles";
import Auth from "./components/Auth";
import WriterRankings from "./components/WriterRankings";
import TopComments from "./components/TopComments";
import JournalistDashboard from "./components/JournalistDashboard";

const Layout = ({ children }) => (
  <div className="container">
    <h1>GamingBS Journal</h1>
    <Auth />

    {/* Navigation Links */}
    <nav>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
      <NavLink to="/journalist-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Journalist Dashboard</NavLink>
    </nav>

    {children}

    <aside>
      <TopComments />
      <WriterRankings />
    </aside>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Articles /></Layout>} />
        <Route path="/journalist-dashboard" element={<Layout><JournalistDashboard /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
