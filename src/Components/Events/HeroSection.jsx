import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";
import heading from "../../assets/EventsHeading.webp";

// ---------------------------------------------------------
// VIDEO FILES
// ---------------------------------------------------------

const videoModules = import.meta.glob("../../assets/*.mp4", {
  query: "?url",
  import: "default",
});


// ---------------------------------------------------------
// STATIC PNG FILES
// ---------------------------------------------------------

const imageModules = import.meta.glob("../../assets/*.png", {
  query: "?url",
  import: "default",
  eager: true,
});


// ---------------------------------------------------------
// ORDER OF HEXAGONS
// ---------------------------------------------------------

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


// ---------------------------------------------------------
// VIDEO PATHS
// ---------------------------------------------------------

const videoPaths = ORDER.map(
  (name) => `../../assets/Untitled design ${name}.mp4`
);


// ---------------------------------------------------------
// IMAGE PATHS
// ---------------------------------------------------------

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


// ---------------------------------------------------------
// GET STATIC IMAGE
// ---------------------------------------------------------

function getImageSrc(path) {
  const image = imageModules[path];

  if (!image) {
    console.error("IMAGE NOT FOUND:", path);
    console.log("Available PNG files:", Object.keys(imageModules));
    return null;
  }

  return image;
}


// ---------------------------------------------------------
// LAZY VIDEO LOADER
// ---------------------------------------------------------

function useLazyVideo(path, shouldLoad) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!shouldLoad || src) return;

    const importer = videoModules[path];

    if (!importer) {
      console.error("VIDEO NOT FOUND:", path);
      console.log("Available MP4 files:", Object.keys(videoModules));
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
        console.error("FAILED TO LOAD VIDEO:", path, error);
      });

    return () => {
      cancelled = true;
    };
  }, [path, shouldLoad, src]);

  return src;
}


// ---------------------------------------------------------
// ONE HEXAGON
// ---------------------------------------------------------

function HexCell({
  path,
  imagePath,
  x,
  y,
  isMobile,
}) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);

  // Is the hexagon visible on screen?
  const [isVisible, setIsVisible] = useState(false);

  // Is the mouse hovering over the hexagon?
  const [isHovered, setIsHovered] = useState(false);


  // -------------------------------------------------------
  // STATIC IMAGE
  // -------------------------------------------------------

  const imageSrc = getImageSrc(imagePath);


  // -------------------------------------------------------
  // DECIDE WHEN VIDEO SHOULD LOAD
  // -------------------------------------------------------

  const shouldLoadVideo = isMobile
    ? isVisible
    : isHovered;


  const videoSrc = useLazyVideo(
    path,
    shouldLoadVideo
  );


  // -------------------------------------------------------
  // INTERSECTION OBSERVER
  // -------------------------------------------------------

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.01,

        // Use 0px if you want the video to start
        // only when the hexagon actually enters the screen.
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);


  // -------------------------------------------------------
  // PLAY / PAUSE VIDEO
  // -------------------------------------------------------

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !videoSrc) return;


    if (isMobile) {
      // MOBILE
      // Play whenever the hexagon is visible.

      if (isVisible) {
        video.play().catch((error) => {
          console.log("Mobile video play blocked:", error);
        });
      } else {
        video.pause();
      }

    } else {
      // DESKTOP
      // Play ONLY while hovering.

      if (isHovered) {
        video.play().catch((error) => {
          console.log("Desktop video play blocked:", error);
        });
      } else {
        video.pause();
      }
    }

  }, [
    isMobile,
    isVisible,
    isHovered,
    videoSrc,
  ]);


  // -------------------------------------------------------
  // HEXAGON
  // -------------------------------------------------------

  return (
    <div
      ref={wrapperRef}

      className="hexagon-wrapper video"

      style={{
        "--hex-x": x,
        "--hex-y": y,
      }}

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

      {/* Existing golden border */}
      <div className="hexagon-border"></div>


      <div className="hexagon-inner">

        {/* ------------------------------------------------
            STATIC PNG
        ------------------------------------------------- */}

        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="hexagon-static-image"
          />
        )}


        {/* ------------------------------------------------
            VIDEO
        ------------------------------------------------- */}

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


// ---------------------------------------------------------
// HERO SECTION
// ---------------------------------------------------------

export default function HeroSection() {

  const [isMobile, setIsMobile] = useState(false);


  // -------------------------------------------------------
  // CHECK SCREEN SIZE
  // -------------------------------------------------------

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth <= 768
      );

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // -------------------------------------------------------
  // DESKTOP CIRCLE START ANGLE
  // -------------------------------------------------------

  const START_ANGLE = -Math.PI / 2;


  // -------------------------------------------------------
  // CREATE HEXAGON POSITIONS
  // -------------------------------------------------------

  const honeycombPositions = videoPaths.map(
    (path, index) => {

      let x;
      let y;


      if (isMobile) {

        // -----------------------------------------------
        // MOBILE
        // 1 - 2 - 3 - 2 - 1
        // -----------------------------------------------

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

        // -----------------------------------------------
        // DESKTOP / TABLET
        // -----------------------------------------------

        const angle =
          START_ANGLE +
          (index / videoPaths.length) *
            (2 * Math.PI);


        x = Math.cos(angle);
        y = Math.sin(angle);

      }


      return {

        id: index + 1,

        videoPath: path,

        imagePath: imagePaths[index],

        x,

        y,

      };

    }
  );


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

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

        {honeycombPositions.map(
          (hex) => (

            <HexCell

              key={hex.id}

              path={hex.videoPath}

              imagePath={hex.imagePath}

              x={hex.x}

              y={hex.y}

              isMobile={isMobile}

            />

          )
        )}

      </div>

    </section>

  );
}