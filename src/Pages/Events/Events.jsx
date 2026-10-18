import { useEffect, useRef } from "react";
import HeroSection from "../../Components/Events/HeroSection";
import RasaSection from "../../Components/Events/RasaSection";
import Galaxy from "../../Components/Events/Galaxy";
import bg from "../../assets/Background_Events.webp";
import SplashCursor from "../../Components/SplashCursor/SplashCursor"; // Adjust path if needed
import "./Events.css";
import Navbar from '../../Components/Navbar/Navbar';

export default function Events() {
  const rasaRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Auto scroll after 7 seconds
    timerRef.current = setTimeout(() => {
      rasaRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 7000);

    return () => clearTimeout(timerRef.current);
  }, []);

  // Cancel auto-scroll if the user touches/scrolls manually
  const handleUserInteraction = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div 
      className="events-wrapper"
      onWheel={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >

      <div className="background-image" style={{ backgroundImage: `url(${bg})` }} />

      <div className="galaxy-layer">
        <Galaxy
          density={1} glowIntensity={0.3} saturation={0} hueShift={140}
          twinkleIntensity={0.3} rotationSpeed={0.1} starSpeed={0.5}
          speed={1} transparent={true}
        />
      </div>

      {/* NEW: Splash Cursor Layer */}
      <div className="splash-cursor-layer">
        <SplashCursor />
      </div>

      <div className="navbar-fixed">
        <Navbar isVisible={true} />
      </div>

      <div className="content-layer">
        <HeroSection />
        <div ref={rasaRef}>
          <RasaSection />
        </div>
      </div>

    </div>
  );
}