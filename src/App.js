import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importar componentes
import Header from './components/Header';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Lobby from './pages/Lobby';
import RecentMatches from './pages/RecentMatches';
import LiveMatches from './pages/LiveMatches';
import Coaching from './pages/Coaching';
import BuildOrders from './pages/BuildOrders';
import Discord from './pages/Discord';
import Donations from './pages/Donations';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="App">
        <Header onNavigate={handleNavigation} currentPage={currentPage} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/recent-matches" element={<RecentMatches />} />
            <Route path="/live-matches" element={<LiveMatches />} />
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/build-orders" element={<BuildOrders />} />
            <Route path="/discord" element={<Discord />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 