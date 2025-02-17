// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home'; // Your home page component
import JournalistDashboard from './components/JournalistDashboard'; // Your dashboard component
import NotFoundPage from './components/NotFoundPage'; // A 404 component (create if needed)

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/journalist">Journalist Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journalist" element={<JournalistDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
