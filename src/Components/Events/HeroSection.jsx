import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";
import heading from "../../assets/EventsHeading.webp";

// Video files
const videoModules = import.meta.glob("../../assets/*.mp4", {
  query: "?url",
  import: "default",
});

// PNG files
const imageModules = import.meta.glob("../../assets/*.png", {
  query: "?url",
  import: "default",
  eager: true,
});

// Hexagon order
const ORDER = ["(5)", "(6)", "(7)", "(8)", "(9)", "(14)", "(11)", "(12)", "(13)"];

// Video paths
const videoPaths = ORDER.map(
  (name) => `../../assets/Untitled design ${name}.mp4`
);

// Image paths
const imagePaths = [
  "../../assets/5.png",
  "../../assets/6.png",
  "../../assets/7.png",
  "../../assets/8.png",
  "../../assets/9.png",
  "../../assets/14.png",
  "../../assets/11.png",
  "../../assets/12.png",
  "../../assets/13.png",
];

// Get image URL
function getImageSrc(path) {
  const image = imageModules[path];

  if (!image) {
    console.error("IMAGE NOT FOUND:", path);
    console.log("Available PNG files:", Object.keys(imageModules));
    return null;
  }

  return image;
}

// Load all videos in the background
function preloadAllVideos() {
  videoPaths.forEach((path) => {
    const importer = videoModules[path];

    if (!importer) {
      console.error("VIDEO NOT FOUND:", path);
      return;
    }

    importer()
      .then((url) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        video.load();
      })
      .catch((error) => {
        console.error("FAILED TO PRELOAD VIDEO:", path, error);
      });
  });
}

// One hexagon
function HexCell({ videoSrc, imagePath, x, y, isMobile }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageSrc = getImageSrc(imagePath);

  // Check if hexagon is visible
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01, rootMargin: "0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Play or pause video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    if (isMobile) {
      if (isVisible) {
        video.play().catch((error) => {
          console.log("Mobile video play blocked:", error);
        });
      } else {
        video.pause();
      }
    } else {
      if (isHovered) {
        video.play().catch((error) => {
          console.log("Desktop video play blocked:", error);
        });
      } else {
        video.pause();
      }
    }
  }, [isMobile, isVisible, isHovered, videoSrc]);

  return (
    <div
      ref={wrapperRef}
      className="hexagon-wrapper video"
      style={{ "--hex-x": x, "--hex-y": y }}
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false);
      }}
    >
      <div className="hexagon-border"></div>

      <div className="hexagon-inner">
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="hexagon-static-image"
          />
        )}

        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className={
              isMobile
                ? `hexagon-video ${isVisible ? "video-visible" : ""}`
                : `hexagon-video ${isHovered ? "video-visible" : ""}`
            }
          />
        )}
      </div>
    </div>
  );
}

// Hero section
export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState([]);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get all video URLs when Events page opens
  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      const videos = await Promise.all(
        videoPaths.map(async (path) => {
          const importer = videoModules[path];

          if (!importer) {
            console.error("VIDEO NOT FOUND:", path);
            return null;
          }

          try {
            return await importer();
          } catch (error) {
            console.error("FAILED TO LOAD VIDEO:", path, error);
            return null;
          }
        })
      );

      if (!cancelled) setLoadedVideos(videos);
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  // Start browser video preloading
  useEffect(() => {
    if (!loadedVideos.length) return;

    loadedVideos.forEach((url) => {
      if (!url) return;

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = url;
      video.load();
    });
  }, [loadedVideos]);

  // Desktop circle start angle
  const START_ANGLE = -Math.PI / 2;

  // Create hexagon positions
  const honeycombPositions = videoPaths.map((path, index) => {
    let x;
    let y;

    if (isMobile) {
      // Mobile 1-2-3-2-1 layout
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
      // Desktop circular layout
      const angle =
        START_ANGLE +
        (index / videoPaths.length) * (2 * Math.PI);

      x = Math.cos(angle);
      y = Math.sin(angle);
    }

    return {
      id: index + 1,
      videoSrc: loadedVideos[index],
      imagePath: imagePaths[index],
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
            videoSrc={hex.videoSrc}
            imagePath={hex.imagePath}
            x={hex.x}
            y={hex.y}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
}