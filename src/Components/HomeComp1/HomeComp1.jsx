import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

import './HomeComp1.css';

import LightRays from './LightRays';
import BlurText from './BlurText';
import ModernScene from './ModernScene';

// =========================================================
// TRADITIONAL ASSETS
// =========================================================

import curtainImg from './assets/traditional/curtain_half.webp';

import scene1 from './assets/traditional/scene_1.webp';
import scene2 from './assets/traditional/scene_2.webp';
import scene3 from './assets/traditional/scene_3.webp';
import scene4 from './assets/traditional/scene_4.webp';
import scene5 from './assets/traditional/scene_5.webp';
import scene6 from './assets/traditional/scene_6.webp';
import scene7 from './assets/traditional/scene_7.webp';
import scene8 from './assets/traditional/scene_8.webp';
import scene9 from './assets/traditional/scene_9.webp';

// =========================================================
// MODERN / CONCERT ASSETS
// =========================================================

import stageModernBg from './assets/modern/stage_modern.webp';

import audienceLeft from './assets/modern/audience_left.webp';
import audienceRight from './assets/modern/audience_right.webp';

import taaranganaHeading from './assets/modern/taarangana_heading.webp';
import ethereaHeading from './assets/modern/etherea_heading.webp';

import taaranganaLogo from './assets/modern/taarangana_logo.webp';
import igdtuwLogo from './assets/modern/igdtuw_logo.webp';

import singer1 from './assets/modern/singer_1.webp';
import singer2 from './assets/modern/singer_2.webp';
import singer3 from './assets/modern/singer_3.webp';
import singer4 from './assets/modern/singer_4.webp';
import singer5 from './assets/modern/singer_5.webp';

import logo1 from './assets/logo1.webp';
import logo2 from './assets/logo2.webp';
import logo3 from './assets/logo3.webp';
import logo4 from './assets/logo4.webp';
import logo5 from './assets/logo5.webp';
import logo6 from './assets/logo6.webp';
import logo7 from './assets/logo7.webp';

// =========================================================
// TRADITIONAL SCENES
// =========================================================

const SCENES = [
  scene1,
  scene2,
  scene3,
  scene4,
  scene5,
  scene6,
  scene7,
  scene8,
  scene9
];

// =========================================================
// MODERN ASSETS
// =========================================================

const MODERN_ASSETS = [
  stageModernBg,

  audienceLeft,
  audienceRight,

  taaranganaHeading,
  ethereaHeading,

  taaranganaLogo,
  igdtuwLogo,

  singer1,
  singer2,
  singer3,
  singer4,
  singer5,

  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7
];

// =========================================================
// NAVARASA
// =========================================================

const NAVARASA = [
  'Shringara',
  'Bhayanaka',
  'Raudra',
  'Karuna',
  'Vira',
  'Hasya',
  'Bibhatsa',
  'Adbhuta',
  'Shanta'
];

// =========================================================
// NAVARASA COLORS
// =========================================================

const RASA_COLORS = [
  '#dc15cf',
  '#61028e',
  '#ff0000',
  '#34399b',
  '#00a2ff',
  '#ffc400',
  '#03ad00',
  '#00ddff',
  '#fff9e6'
];

const CYCLE_MS = 2000;
const TRANSITION_MS = 1000;

// =========================================================
// IMAGE PRELOADER
// =========================================================

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      console.error('Failed to load image:', src);

      // IMPORTANT:
      // A failed image does NOT count as loaded.
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
}

// =========================================================
// TRADITIONAL SCENE
// =========================================================

function TraditionalScene({
  onEtherefy,
  modernAssetsLoaded
}) {
  const [traditionalAssetsLoaded, setTraditionalAssetsLoaded] =
    useState(false);

  const [curtainOpen, setCurtainOpen] =
    useState(false);

  const [sceneIndex, setSceneIndex] =
    useState(0);

  const [prevIndex, setPrevIndex] =
    useState(null);

  const [rasaVisible, setRasaVisible] =
    useState(false);

  const startTimeRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  // =======================================================
  // LOAD TRADITIONAL ASSETS
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadTraditionalAssets = async () => {
      const traditionalAssets = [
        curtainImg,
        ...SCENES
      ];

      try {
        await Promise.all(
          traditionalAssets.map((src) =>
            preloadImage(src)
          )
        );

        if (cancelled) return;

        // This is reached ONLY if every traditional
        // asset successfully loaded.
        setTraditionalAssetsLoaded(true);

      } catch (error) {
        if (cancelled) return;

        console.error(
          'Traditional assets could not all be loaded.',
          error
        );

        // Remains false.
        // Curtains stay closed and carousel does not start.
        setTraditionalAssetsLoaded(false);
      }
    };

    loadTraditionalAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  // =======================================================
  // START CAROUSEL ONLY AFTER TRADITIONAL ASSETS LOAD
  // =======================================================

  useEffect(() => {
    if (!traditionalAssetsLoaded) {
      return;
    }

    startTimeRef.current = Date.now();

    const update = () => {
      if (!startTimeRef.current) {
        return;
      }

      const elapsed =
        Date.now() - startTimeRef.current;

      const currentIndex =
        Math.floor(
          elapsed / CYCLE_MS
        ) % SCENES.length;

      setSceneIndex((prev) => {
        if (prev !== currentIndex) {
          setPrevIndex(prev);
          return currentIndex;
        }

        return prev;
      });

      animationFrameRef.current =
        requestAnimationFrame(update);
    };

    animationFrameRef.current =
      requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, [traditionalAssetsLoaded]);

  // =======================================================
  // OPEN CURTAINS ONLY AFTER TRADITIONAL ASSETS LOAD
  // =======================================================

  useEffect(() => {
    if (!traditionalAssetsLoaded) {
      return;
    }

    // Traditional screen is now completely loaded.
    setCurtainOpen(true);

    const timer = setTimeout(() => {
      setRasaVisible(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [traditionalAssetsLoaded]);

  return (
    <div className="trad-scene-container">

      {/* ===================================================
          TRADITIONAL IMAGE CAROUSEL
          =================================================== */}

      <div className="homecomp1-scene-stack">

        {SCENES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={`homecomp1-scene-layer ${
              i === sceneIndex
                ? 'active'
                : ''
            } ${
              i === prevIndex
                ? 'previous'
                : ''
            }`}
            style={{
              transitionDuration:
                `${TRANSITION_MS}ms`,

              zIndex:
                i === sceneIndex
                  ? 3
                  : i === prevIndex
                    ? 2
                    : 1
            }}
          />
        ))}

      </div>

      {/* ===================================================
          LIGHT RAYS
          =================================================== */}

      <LightRays
        color={
          RASA_COLORS[sceneIndex]
        }
        intensity={0.7}
      />

      {/* ===================================================
          NAVARASA LABEL
          =================================================== */}

      <div className="homecomp1-rasa-label">

        {rasaVisible && (
          <BlurText
            key={sceneIndex}
            text={NAVARASA[sceneIndex]}
            delay={500}
            animateBy="words"
            direction="bottom"
          />
        )}

      </div>

      {/* ===================================================
          ETHEREFY BUTTON

          Only appears after ALL modern assets
          have successfully loaded.
          =================================================== */}

      {modernAssetsLoaded && (
        <div className="homecomp1-cta-wrap">

          <button
            className="homecomp1-cta"
            type="button"
            onClick={onEtherefy}
            onTouchEnd={(e) => {
              e.preventDefault();
              onEtherefy();
            }}
          >
            Let's Etherefy!
          </button>

        </div>
      )}

      {/* ===================================================
          CURTAINS
          =================================================== */}

      <div
        className={`homecomp1-curtains${
          curtainOpen
            ? ' opening'
            : ''
        }`}
      >

        <div className="homecomp1-curtain-left">

          <img
            src={curtainImg}
            alt=""
          />

        </div>

        <div className="homecomp1-curtain-right">

          <img
            src={curtainImg}
            alt=""
          />

        </div>

      </div>

    </div>
  );
}

// =========================================================
// CHROMA GLITCH FILTER
// =========================================================

function ChromaGlitchFilter() {
  return (
    <svg
      style={{
        position: 'absolute',
        width: 0,
        height: 0
      }}
      aria-hidden="true"
    >

      <defs>

        <filter id="chroma-glitch">

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="0"
            result="noise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distorted"
          />

          <feColorMatrix
            in="distorted"
            type="matrix"
            values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="red"
          />

          <feColorMatrix
            in="distorted"
            type="matrix"
            values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="green"
          />

          <feColorMatrix
            in="distorted"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
            result="blue"
          />

          <feOffset
            in="red"
            dx="-5"
            dy="0"
            result="redShifted"
          />

          <feOffset
            in="green"
            dx="0"
            dy="0"
            result="greenShifted"
          />

          <feOffset
            in="blue"
            dx="5"
            dy="0"
            result="blueShifted"
          />

          <feBlend
            in="redShifted"
            in2="blueShifted"
            mode="screen"
            result="rb"
          />

          <feBlend
            in="rb"
            in2="greenShifted"
            mode="screen"
          />

        </filter>

      </defs>

    </svg>
  );
}

// =========================================================
// MAIN COMPONENT
// =========================================================

export default function HomeComp1() {
  const [currentScene, setCurrentScene] =
    useState('traditional');

  const [visitCount, setVisitCount] =
    useState(0);

  const [modernAssetsLoaded, setModernAssetsLoaded] =
    useState(false);

  const rootRef =
    useRef(null);

  const glitchOverlayRef =
    useRef(null);

  // =======================================================
  // VISIT COUNTER
  // =======================================================

  useEffect(() => {
    const storedCount =
      localStorage.getItem(
        'taarangana_visits'
      );

    const newCount =
      storedCount
        ? parseInt(storedCount, 10) + 1
        : 1;

    localStorage.setItem(
      'taarangana_visits',
      newCount
    );

    setVisitCount(newCount);
  }, []);

  // =======================================================
  // LOAD MODERN ASSETS IN BACKGROUND
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const loadModernAssets = async () => {
      try {
        await Promise.all(
          MODERN_ASSETS.map((src) =>
            preloadImage(src)
          )
        );

        if (cancelled) return;

        // Every modern asset successfully loaded.
        setModernAssetsLoaded(true);

      } catch (error) {
        if (cancelled) return;

        console.error(
          'Modern assets could not all be loaded.',
          error
        );

        // Remains false.
        // Let's Etherefy button will not appear.
        setModernAssetsLoaded(false);
      }
    };

    // Starts immediately in the background.
    loadModernAssets();

    return () => {
      cancelled = true;
    };
  }, []);

  // =======================================================
  // START TRANSITION
  // =======================================================

  const startTransition = () => {
    if (currentScene !== 'traditional') {
      return;
    }

    // Extra safety check.
    if (!modernAssetsLoaded) {
      return;
    }

    const isMobile =
      window.innerWidth <= 768;

    const glitchIterations =
      isMobile ? 4 : 8;

    const tl = gsap.timeline({
      onStart: () => {
        if (rootRef.current) {
          rootRef.current.classList.add(
            'glitching'
          );
        }
      }
    });

    const displacementMap =
      document.querySelector(
        '#chroma-glitch feDisplacementMap'
      );

    const offsets =
      document.querySelectorAll(
        '#chroma-glitch feOffset'
      );

    tl.to(
      glitchOverlayRef.current,
      {
        opacity: 1,
        duration: 0.1
      }
    );

    for (
      let i = 0;
      i < glitchIterations;
      i++
    ) {
      const time = i * 0.05;

      tl.to(
        displacementMap,
        {
          attr: {
            scale:
              gsap.utils.random(
                80,
                220
              )
          },
          duration: 0.03
        },
        time
      );

      tl.to(
        offsets[0],
        {
          attr: {
            dx:
              gsap.utils.random(
                -50,
                50
              )
          },
          duration: 0.03
        },
        time
      );

      tl.to(
        offsets[2],
        {
          attr: {
            dx:
              gsap.utils.random(
                -50,
                50
              )
          },
          duration: 0.03
        },
        time
      );
    }

    const transitionTime =
      isMobile
        ? 0.25
        : 0.4;

    const cleanupTime =
      isMobile
        ? 0.35
        : 0.5;

    tl.add(
      () => {
        setCurrentScene('modern');
      },
      transitionTime
    );

    tl.to(
      glitchOverlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      },
      cleanupTime
    );

    tl.to(
      displacementMap,
      {
        attr: {
          scale: 0
        },
        duration: 0.4,
        ease: 'back.out(2)'
      },
      cleanupTime
    );

    tl.to(
      offsets[0],
      {
        attr: {
          dx: -5
        },
        duration: 0.4
      },
      cleanupTime
    );

    tl.to(
      offsets[2],
      {
        attr: {
          dx: 5
        },
        duration: 0.4
      },
      cleanupTime
    );

    tl.set(
      rootRef.current,
      {
        className: 'homecomp1-root'
      },
      cleanupTime + 0.4
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className={`homecomp1-root scene-${currentScene}`}
      ref={rootRef}
    >

      <ChromaGlitchFilter />

      <div
        className="chroma-glitch-overlay"
        ref={glitchOverlayRef}
      />

      {/* ===================================================
          VISIT COUNTER
          =================================================== */}

      <div
        className={`site-visit-counter ${currentScene}-counter`}
      >
        <span className="counter-label">
          Visits
        </span>

        <span className="counter-number">
          {visitCount.toLocaleString()}
        </span>
      </div>

      {/* ===================================================
          MAIN CONTENT
          =================================================== */}

      <div className="scene-main-content">

        {currentScene === 'traditional' ? (

          <TraditionalScene
            onEtherefy={startTransition}
            modernAssetsLoaded={
              modernAssetsLoaded
            }
          />

        ) : (

          <ModernScene />

        )}

      </div>

    </div>
  );
}