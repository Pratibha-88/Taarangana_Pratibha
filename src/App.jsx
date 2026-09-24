import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './Pages/Home/Home';
import ItineraryPage from './Pages/Itinerary/Itinerary';
import TeamPage from './Pages/Team/Team';
import Events from './Pages/Events/Events';
import Sponsi from './Pages/Sponsi/Sponsi';

import './index.css';

// Import images through Vite
import image5 from './assets/5.png';
import image6 from './assets/6.png';
import image7 from './assets/7.png';
import image8 from './assets/8.png';
import image9 from './assets/9.png';
import image14 from './assets/14.png';
import image11 from './assets/11.png';
import image12 from './assets/12.png';
import image13 from './assets/13.png';

const eventImages = [
  image5,
  image6,
  image7,
  image8,
  image9,
  image14,
  image11,
  image12,
  image13,
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