import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Articles from "./components/Articles";
import Comments from "./components/Comments";
import Auth from "./components/Auth";
import WriterRankings from "./components/WriterRankings";
import TopComments from "./components/TopComments";
import JournalistDashboard from "./pages/JournalistDashboard";

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <Router>
      <div className="container">
        <h1>GamingBS Journal</h1>
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
