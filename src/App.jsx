import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import ItineraryPage from './Pages/Itinerary/Itinerary';
import TeamPage from './Pages/Team/Team';
import Events from './Pages/Events/Events';
import Sponsi from './Pages/Sponsi/Sponsi';

import './index.css';

const eventImages = [
  './assets/5.png',
  './assets/6.png',
  './assets/7.png',
  './assets/8.png',
  './assets/9.png',
  './assets/14.png',
  './assets/11.png',
  './assets/12.png',
  './assets/13.png',
];

function App() {
  useEffect(() => {
    eventImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/schedule" element={<ItineraryPage />} />
          <Route path="/sponsi" element={<Sponsi />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;