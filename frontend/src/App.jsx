import { useState, useEffect } from "react";
import Articles from "./components/Articles";
import Comments from "./components/Comments";
import Auth from "./components/Auth";
import WriterRankings from "./components/WriterRankings";
import TopComments from "./components/TopComments";

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="container">
      <h1>GamingBS Journal</h1>
      <Auth />
      <div className="content">
        <Articles onSelectArticle={setSelectedArticle} />
        {selectedArticle && <Comments articleId={selectedArticle} />}
      </div>
      <aside>
        <TopComments />
        <WriterRankings />
      </aside>
    </div>
  );
}

export default App;
