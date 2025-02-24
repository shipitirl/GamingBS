import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './components/Home';
import JournalistDashboard from './components/JournalistDashboard';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Sidebar />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journalist" element={<JournalistDashboard />} />
            <Route path="/dashboard" element={<JournalistDashboard />} />
            <Route path="/articles" element={<Home />} />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
