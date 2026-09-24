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

/*
  Image position → Rasa event ID

  5.png  → Lilac Dreams           → ID 6
  6.png  → Nukkad Natak           → ID 3
  7.png  → Rangmancha             → ID 9
  8.png  → Urban Thump            → ID 8
  9.png  → Mr. & Ms. Taarangana   → ID 7
  14.png → Slam Poetry            → ID 4
  11.png → Antra                  → ID 1
  12.png → Rap Battle             → ID 2
  13.png → Aalap                  → ID 5
*/
const rasaIdMap = {
  "../../assets/5.png": 6,
  "../../assets/6.png": 3,
  "../../assets/7.png": 9,
  "../../assets/8.png": 8,
  "../../assets/9.png": 7,
  "../../assets/14.png": 4,
  "../../assets/11.png": 1,
  "../../assets/12.png": 2,
  "../../assets/13.png": 5,
};

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

// One hexagon
function HexCell({
  videoSrc,
  imagePath,
  x,
  y,
  isMobile,
  eventId,
}) {
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
      {
        threshold: 0.01,
        rootMargin: "0px",
      }
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

  // Handle event click
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("open-rasa", {
        detail: {
          id: eventId,
        },
      })
    );
  };

  return (
    <div
      ref={wrapperRef}
      className="hexagon-wrapper video"
      style={{ "--hex-x": x, "--hex-y": y }}
      onClick={handleClick}
      onMouseEnter={() => {
        if (!isMobile) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setIsHovered(false);
        }
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
                ? `hexagon-video ${
                    isVisible ? "video-visible" : ""
                  }`
                : `hexagon-video ${
                    isHovered ? "video-visible" : ""
                  }`
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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
            console.error(
              "FAILED TO LOAD VIDEO:",
              path,
              error
            );

            return null;
          }
        })
      );

      if (!cancelled) {
        setLoadedVideos(videos);
      }
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

      // IMPORTANT:
      // Use the Rasa ID instead of index + 1
      eventId: rasaIdMap[imagePaths[index]],

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
            eventId={hex.eventId}
          />
        ))}
      </div>
    </section>
  );
}