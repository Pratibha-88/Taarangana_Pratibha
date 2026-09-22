import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";
import heading from "../../assets/EventsHeading.webp";

// Lazy video URLs
// creates a loader for each MP4 instead of loading all of them immediately.
const videoModules = import.meta.glob("../../assets/*.mp4", {
  query: "?url",
  import: "default",
});

const ORDER = [
  "(5)",
  "(6)",
  "(7)",
  "(8)",
  "(9)",
  "(14)",
  "(11)",
  "(12)",
  "(13)",
];

const videoPaths = ORDER.map(
  (name) => `../../assets/Untitled design ${name}.mp4`
);


// Loads a video only when the hexagon becomes visible.
function useLazyVideo(path, shouldLoad) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!shouldLoad || src) return;

    const importer = videoModules[path];

    if (!importer) {
      console.error("Video not found:", path);
      return;
    }

    let cancelled = false;

    importer()
      .then((url) => {
        if (!cancelled) {
          setSrc(url);
        }
      })
      .catch((error) => {
        console.error("Failed to load video:", path, error);
      });

    return () => {
      cancelled = true;
    };
  }, [path, shouldLoad, src]);

  return src;
}


// One individual hexagon.
function HexCell({ path, x, y }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);

  const videoSrc = useLazyVideo(path, isVisible);


  // Detect when this particular hexagon enters/leaves the screen.
  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "300px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);


  // Play while visible and pause when it leaves the screen.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoSrc) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, videoSrc]);


  return (
    <div
      ref={wrapperRef}
      className="hexagon-wrapper video"
      style={{
        "--hex-x": x,
        "--hex-y": y,
      }}
    >
      <div className="hexagon-border"></div>

      <div className="hexagon-inner">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="hexagon-video"
          />
        ) : (
          <div className="plain-bg">
            <div className="plain-dot top-dot"></div>
            <div className="plain-dot bottom-dot"></div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Switch to honeycomb at 768px and below
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const START_ANGLE = -Math.PI / 2;


  const honeycombPositions = videoPaths.map((path, index) => {
    let x;
    let y;


    if (isMobile) {
      // MOBILE: 1-2-3-2-1 Diamond Grid Base Coordinates
      const mobileGrid = [
        { x: 0, y: -2 },

        { x: -1, y: -1 },
        { x: 1, y: -1 },

        { x: -2, y: 0 },
        { x: 0, y: 0 },
        { x: 2, y: 0 },

        { x: -1, y: 1 },
        { x: 1, y: 1 },

        { x: 0, y: 2 },
      ];

      x = mobileGrid[index].x;
      y = mobileGrid[index].y;
    } else {
      // DESKTOP & TABLET: Normalized Elliptical Coordinates (-1 to 1)
      const angle =
        START_ANGLE +
        (index / videoPaths.length) * (2 * Math.PI);

      x = Math.cos(angle);
      y = Math.sin(angle);
    }


    return {
      id: index + 1,
      videoPath: path,
      x,
      y,
    };
  });

  return (
    <section className="hero">
      <div className="hero-center-content">
        <img
          src={heading}
          alt="Events Heading"
          className="events-heading"
        />
      </div>

      <div className="hexagon-container">
        {honeycombPositions.map((hex) => (
          <HexCell
            key={hex.id}
            path={hex.videoPath}
            x={hex.x}
            y={hex.y}
          />
        ))}
      </div>
    </section>
  );
}