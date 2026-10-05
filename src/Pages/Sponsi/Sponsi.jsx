import React, { useEffect, useMemo, useRef } from 'react';
import './Sponsi.css';

import Navbar from '../../Components/Navbar/Navbar';

import bgImage from '../../assets/bgsponsi.webp';

import sponsorHeading from '../../assets/Sponsor.webp';
import sponsorTop from '../../assets/Sponsor Top.webp';
import sponsorBottom from '../../assets/Sponsor Bottom.webp';

import titleSponsorImg from '../../assets/Title Sponsor.webp';

import goldSponsor1 from '../../assets/Gold Sponsor 1.webp';
import goldSponsor2 from '../../assets/Gold Sponsor 2.webp';

import silverSponsor1 from '../../assets/Silver Sponsor 1.webp';
import silverSponsor2 from '../../assets/Silver Sponsor 2.webp';
import silverSponsor3 from '../../assets/Silver Sponsor 3.webp';

import bronzeSponsor1 from '../../assets/Bronze Sponsor 1.webp';
import bronzeSponsor2 from '../../assets/Bronze Sponsor 2.webp';
import bronzeSponsor3 from '../../assets/Bronze Sponsor 3.webp';

import categorySponsor1 from '../../assets/Category Sponsor 1.webp';
import categorySponsor2 from '../../assets/Category Sponsor 2.webp';
import categorySponsor3 from '../../assets/Category Sponsor 3.webp';
import categorySponsor4 from '../../assets/Category Sponsor 4.webp';
import categorySponsor5 from '../../assets/Category Sponsor 5.webp';

import dangler1 from '../../assets/Dangler 1.webp';
import dangler2 from '../../assets/Dangler 2.webp';
import dangler3 from '../../assets/Dangler 3.webp';
import danglerTop from '../../assets/Dangler Top.webp';

import mandalaBottom from '../../assets/Mandala.webp';
import demo1 from '../../assets/Demo 1.webp';
import demo2 from '../../assets/Demo 2.webp';
import demo3 from '../../assets/Demo 3.webp';
import demo4 from '../../assets/Demo 4.webp';
import demo5 from '../../assets/Demo 5.webp';
import demo6 from '../../assets/Demo 6.webp';
import demo7 from '../../assets/Demo 7.webp';
import demo8 from '../../assets/Demo 8.webp';
import demo9 from '../../assets/Demo 9.webp';
import demo10 from '../../assets/Demo 10.webp';
import demo11 from '../../assets/Demo 11.webp';
import demo12 from '../../assets/Demo 12.webp';
import demo13 from '../../assets/Demo 13.webp';
import demo14 from '../../assets/Demo 14.webp';


/* =========================================================
   DEMO LOGOS
   ========================================================= */

const DEMO_LOGOS = [
  demo1,
  demo2,
  demo3,
  demo4,
  demo5,
  demo6,
  demo7,
  demo8,
  demo9,
  demo10,
  demo11,
  demo12,
  demo13,
  demo14
];


/* =========================================================
   DANGLERS
   ========================================================= */

const DANGLERS_LEFT = [
  dangler1,
  dangler2,
  dangler3
];


/* =========================================================
   SPONSOR TIERS
   ========================================================= */

const TIERS = [
  {
    type: 'title-gold',
    sectionClass: 'section-title-gold',
    withTitle: true,

    goldFrames: [
      goldSponsor1,
      goldSponsor2
    ]
  },

  {
    type: 'silver',
    sectionClass: 'section-title-silver',

    frames: [
      silverSponsor1,
      silverSponsor2,
      silverSponsor3
    ],

    count: 3
  },

  {
    type: 'bronze',
    sectionClass: 'section-title-bronze',

    frames: [
      bronzeSponsor1,
      bronzeSponsor2,
      bronzeSponsor3
    ],

    count: 3
  },

  {
    type: 'category',
    sectionClass: 'section-title-category',

    frames: [
      categorySponsor1,
      categorySponsor2,
      categorySponsor3,
      categorySponsor4,
      categorySponsor5
    ],

    count: 5
  }
];


const AUTOSCROLL_INTERVAL = 5000;

const TOUCH_RESUME_DELAY = 800;

const SCROLL_SETTLE_TOLERANCE = 1.5;

const SMOOTH_SCROLL_TIMEOUT = 1800;

/*
 * The content is rendered one extra time so that
 * after the last section the first one can slide
 * back up from the bottom of the viewport instead
 * of jumping.
 */
const CYCLES = [0, 1];


/* =========================================================
   SPONSOR CARD
   ========================================================= */

function SponsorCard({
  sponsor,
  positionClass,
  type
}) {
  return (
    <div
      className={`sponsor-card ${type}-card ${positionClass || ''}`}
      data-sponsor={sponsor.id}
    >

      <div
        className="sponsor-glow"
        aria-hidden="true"
      />

      <img
        src={sponsor.image}
        alt={`${sponsor.type || type} sponsor`}
        className="sponsor-frame"
        draggable="false"
      />

      {sponsor.logo && (
        <img
          src={sponsor.logo}
          alt={`${sponsor.type || type} sponsor logo`}
          className="sponsor-logo"
          draggable="false"
        />
      )}

    </div>
  );
}


/* =========================================================
   SPONSOR SECTION
   ========================================================= */

function SponsorSection({
  sectionClass,
  cards,
  type,
  sectionIndex,
  cycle = 0
}) {
  return (
    <section
      className={`sponsor-section ${sectionClass}`}
      data-section={sectionIndex}
      data-cycle={cycle}
    >

      <div
        className={`sponsors-layout ${type}-layout tree-node`}
      >

        {cards.map((card) => (
          <SponsorCard
            key={card.id}
            sponsor={card}
            type={card.type || type}
            positionClass={
              card.position
                ? `pos-${card.position}`
                : ''
            }
          />
        ))}

      </div>

    </section>
  );
}


/* =========================================================
   DANGLER CLUSTER
   ========================================================= */

function DanglerCluster({
  side
}) {
  return (
    <div
      className={`dangler-cluster ${side}-cluster`}
      aria-hidden="true"
    >

      <img
        src={danglerTop}
        className="dangler-top"
        alt=""
        draggable="false"
      />

      <div className="dangler-row">

        {DANGLERS_LEFT.map((src, index) => (
          <div
            key={index}
            className={`dangler sway-${index + 1}`}
          >

            <img
              src={src}
              alt=""
              draggable="false"
            />

          </div>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Sponsi() {

  const scrollRef = useRef(null);


  /* =======================================================
     BUILD SPONSOR DATA
     ======================================================= */

  const sections = useMemo(() => {

    let logoCursor = 0;

    const nextLogo = () => {
      const logo =
        DEMO_LOGOS[
          logoCursor % DEMO_LOGOS.length
        ];

      logoCursor += 1;

      return logo;
    };


    return TIERS.map((tier) => {

      /* -----------------------------------------------
         TITLE + GOLD
         ----------------------------------------------- */

      if (tier.type === 'title-gold') {

        const cards = [];

        cards.push({
          id: 'title-1',

          image: titleSponsorImg,

          type: 'title',

          position: 'center',

          logo: nextLogo()
        });


        tier.goldFrames.forEach(
          (frame, idx) => {

            cards.push({
              id: `gold-${idx + 1}`,

              image: frame,

              type: 'gold',

              position:
                idx === 0
                  ? 'left'
                  : 'right',

              logo: nextLogo()
            });

          }
        );


        return {
          sectionClass:
            tier.sectionClass,

          type: 'title-gold',

          cards
        };
      }


      /* -----------------------------------------------
         OTHER TIERS
         ----------------------------------------------- */

      const cards = tier.frames.map(
        (frame, idx) => ({

          id:
            `${tier.type}-${idx + 1}`,

          image: frame,

          type: tier.type,

          position:
            `node-${idx + 1}`,

          logo: nextLogo()
        })
      );


      return {
        sectionClass:
          tier.sectionClass,

        type: tier.type,

        cards
      };

    });

  }, []);


  /* =======================================================
     AUTO SCROLL

     RUNS EVERYWHERE, DESKTOP AND MOBILE.

     The sections are rendered TWICE, so the first one
     can slide up from the bottom after the last one
     instead of jumping.

     The position is always rebased back into the first
     copy, which is invisible because both copies are
     pixel identical.

     Auto scroll pauses while a sponsor card is hovered
     or touched, and it resumes from the exact position
     the user left behind.
     ======================================================= */

  useEffect(() => {

    const el = scrollRef.current;

    if (!el) {
      return;
    }


    let timer = null;

    let resumeTimer = null;

    let isPaused = false;

    let scrollTarget = null;

    let scrollTargetAt = 0;

    let touchOnCard = false;

    let touchMoved = false;

    let lastTouchAt = 0;


    /* -----------------------------------------------------
       TIMERS
       ----------------------------------------------------- */

    const clearAutoScroll = () => {

      if (timer !== null) {

        clearTimeout(timer);

        timer = null;
      }

    };


    const clearResumeTimer = () => {

      if (resumeTimer !== null) {

        clearTimeout(resumeTimer);

        resumeTimer = null;
      }

    };


    /* -----------------------------------------------------
       CYCLE GEOMETRY
       ----------------------------------------------------- */

    const getTop = (node) => {

      if (!node) {
        return 0;
      }

      return (
        node.getBoundingClientRect().top -
        el.getBoundingClientRect().top +
        el.scrollTop
      );

    };


    const getCycleSections = (cycle) =>

      Array.from(
        el.querySelectorAll(
          `.sponsor-section[data-cycle="${cycle}"]`
        )
      );


    /*
     * Height of one full cycle.
     *
     * Content at any position and at that position
     * plus one cycle height are pixel identical,
     * which is what makes the rebase invisible.
     */
    const getCycleHeight = () => {

      const first = getCycleSections(0)[0];

      const second = getCycleSections(1)[0];

      if (!first || !second) {
        return 0;
      }

      return getTop(second) - getTop(first);

    };


    /*
     * Pulls the position back into the first copy.
     *
     * The visible content never changes.
     */
    const rebase = () => {

      const height = getCycleHeight();

      if (
        height > 0 &&
        el.scrollTop >= height - 1
      ) {

        el.scrollTop =
          el.scrollTop - height;

      }

    };


    /*
     * Section closest to the current position.
     *
     * Recomputed on every step, so if the user scrolled
     * below the current section the carousel carries on
     * from where the user is.
     */
    const findCurrentIndex = (tops) => {

      let currentIndex = 0;

      let smallestDistance = Infinity;

      tops.forEach((top, index) => {

        const distance =
          Math.abs(top - el.scrollTop);

        if (
          distance <
          smallestDistance
        ) {

          smallestDistance = distance;

          currentIndex = index;
        }

      });

      return currentIndex;

    };


    /* -----------------------------------------------------
       ADVANCE
       ----------------------------------------------------- */

    const advance = () => {

      if (isPaused) {
        return;
      }


      const sections = getCycleSections(0);

      if (!sections.length) {
        return;
      }


      /*
       * Always work from a position inside the first
       * copy, so the next step is always reachable.
       */
      rebase();


      const tops = sections.map(getTop);

      const currentIndex = findCurrentIndex(tops);

      const isWrap =
        currentIndex === sections.length - 1;

      const nextIndex =
        isWrap ? 0 : currentIndex + 1;


      /*
       * FROM THE LAST SECTION:
       *
       * the first section of the next copy is the
       * target, so it slides up from the bottom
       * instead of jumping down from the top.
       */
      const target =
        tops[nextIndex] +
        (isWrap ? getCycleHeight() : 0);

      const maxScroll =
        el.scrollHeight - el.clientHeight;

      const finalTarget =
        Math.min(target, maxScroll);

      if (
        finalTarget <= el.scrollTop
      ) {
        return;
      }

      scrollTarget = finalTarget;

      scrollTargetAt = Date.now();

      el.scrollTo({
        top: finalTarget,
        behavior: 'smooth'
      });

    };


    const startTimer = () => {

      clearAutoScroll();

      if (isPaused) {
        return;
      }

      timer = setTimeout(() => {

        advance();

        startTimer();

      }, AUTOSCROLL_INTERVAL);

    };


    /* -----------------------------------------------------
       PAUSE / RESUME
       ----------------------------------------------------- */

    const pauseAutoScroll = () => {

      isPaused = true;

      clearAutoScroll();

      clearResumeTimer();

    };


    const resumeAutoScroll = (delay = 0) => {

      clearResumeTimer();

      if (delay <= 0) {

        isPaused = false;

        startTimer();

        return;
      }

      resumeTimer = setTimeout(() => {

        resumeTimer = null;

        isPaused = false;

        startTimer();

      }, delay);

    };


    /* -----------------------------------------------------
       HOVER
       ----------------------------------------------------- */

    const isRecentTouch = () =>

      Date.now() - lastTouchAt < 1200;


    const handleCardEnter = () => {

      if (isRecentTouch()) {
        return;
      }

      pauseAutoScroll();

    };


    const handleCardLeave = () => {

      if (isRecentTouch()) {
        return;
      }

      resumeAutoScroll(0);

    };


    /* -----------------------------------------------------
       TOUCH
       ----------------------------------------------------- */

    const isCardTarget = (target) =>

      !!(
        target &&
        target.closest &&
        target.closest('.sponsor-card')
      );


    const handleTouchStart = (event) => {

      lastTouchAt = Date.now();

      touchMoved = false;

      touchOnCard =
        isCardTarget(event.target);

      pauseAutoScroll();

    };


    const handleTouchMove = () => {

      touchMoved = true;

    };


    const handleTouchEnd = () => {

      const wasOnCard = touchOnCard;

      touchOnCard = false;


      /*
       * A tap on a card keeps the carousel paused
       * until the user touches somewhere else.
       */
      if (wasOnCard && !touchMoved) {
        return;
      }

      resumeAutoScroll(TOUCH_RESUME_DELAY);

    };


    /* -----------------------------------------------------
       SCROLL
       ----------------------------------------------------- */

    const handleScroll = () => {

      /*
       * A smooth scroll has landed, or it was
       * interrupted and is no longer worth waiting
       * for.
       */
      if (
        scrollTarget !== null &&
        (
          Math.abs(el.scrollTop - scrollTarget) <
            SCROLL_SETTLE_TOLERANCE ||
          Date.now() - scrollTargetAt >
            SMOOTH_SCROLL_TIMEOUT
        )
      ) {

        scrollTarget = null;

      }


      /*
       * Mid animation the rebase waits, so a running
       * smooth scroll is never cut short.
       */
      if (scrollTarget === null) {
        rebase();
      }

    };


    /* -----------------------------------------------------
       SETUP
       ----------------------------------------------------- */

    const sponsorCards =
      Array.from(
        el.querySelectorAll('.sponsor-card')
      );


    sponsorCards.forEach((card) => {

      card.addEventListener(
        'mouseenter',
        handleCardEnter
      );

      card.addEventListener(
        'mouseleave',
        handleCardLeave
      );

    });


    el.addEventListener(
      'touchstart',
      handleTouchStart,
      { passive: true }
    );

    el.addEventListener(
      'touchmove',
      handleTouchMove,
      { passive: true }
    );

    el.addEventListener(
      'touchend',
      handleTouchEnd,
      { passive: true }
    );

    el.addEventListener(
      'touchcancel',
      handleTouchEnd,
      { passive: true }
    );

    el.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );


    startTimer();


    /* -----------------------------------------------------
       CLEANUP
       ----------------------------------------------------- */

    return () => {

      clearAutoScroll();

      clearResumeTimer();


      sponsorCards.forEach((card) => {

        card.removeEventListener(
          'mouseenter',
          handleCardEnter
        );

        card.removeEventListener(
          'mouseleave',
          handleCardLeave
        );

      });


      el.removeEventListener(
        'touchstart',
        handleTouchStart
      );

      el.removeEventListener(
        'touchmove',
        handleTouchMove
      );

      el.removeEventListener(
        'touchend',
        handleTouchEnd
      );

      el.removeEventListener(
        'touchcancel',
        handleTouchEnd
      );

      el.removeEventListener(
        'scroll',
        handleScroll
      );

    };

  }, []);


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div className="sponsi-container">

      <Navbar isVisible={true} />


      <div
        className="sponsi-scroll"
        ref={scrollRef}
        aria-label="Sponsors scroll container"
      >


        {/* -----------------------------------------------
            BACKGROUND
            ----------------------------------------------- */}

        <div
          className="sponsi-background"
          style={{
            backgroundImage:
              `url("${bgImage}")`
          }}
          aria-hidden="true"
        />


        {/* -----------------------------------------------
            FIXED DECORATIONS
            ----------------------------------------------- */}

        <div
          className="sponsi-decoration-layer"
          aria-hidden="true"
        >

          <DanglerCluster side="left" />

          <DanglerCluster side="right" />


          <img
            src={mandalaBottom}
            alt=""
            className="
              mandala-top
              gear-spin-left
            "
            draggable="false"
          />


          <img
            src={mandalaBottom}
            alt=""
            className="
              mandala-top
              gear-spin-right
            "
            draggable="false"
          />


          <img
            src={mandalaBottom}
            alt=""
            className="
              mandala-bottom
              gear-spin-left
            "
            draggable="false"
          />


          <img
            src={mandalaBottom}
            alt=""
            className="
              mandala-bottom
              gear-spin-right
            "
            draggable="false"
          />

        </div>


        {/* -----------------------------------------------
            FIXED SPONSOR HEADER
            ----------------------------------------------- */}

        <div
          className="sponsi-fixed-header"
          aria-hidden="true"
        >

          <div className="sponsi-header-banner">

            <img
              src={sponsorTop}
              alt=""
              className="
                sponsor-top-decoration
              "
              draggable="false"
            />


            <img
              src={sponsorHeading}
              alt="Our Sponsors"
              className="
                sponsor-heading
              "
              draggable="false"
            />


            <img
              src={sponsorBottom}
              alt=""
              className="
                sponsor-bottom-decoration
              "
              draggable="false"
            />

          </div>

        </div>


        {/* -----------------------------------------------
            ALL SPONSOR CONTENT

            Rendered twice so the carousel can loop
            downward forever.
            ----------------------------------------------- */}

        <main className="sponsi-page">

          {CYCLES.map((cycle) => (

            <div
              key={cycle}
              className={
                cycle === 0
                  ? 'sponsi-cycle'
                  : 'sponsi-cycle sponsi-cycle-clone'
              }
              aria-hidden={
                cycle === 0
                  ? undefined
                  : 'true'
              }
            >

              {sections.map(
                (section, index) => (

                  <SponsorSection
                    key={section.type}
                    sectionClass={
                      section.sectionClass
                    }
                    cards={
                      section.cards
                    }
                    type={
                      section.type
                    }
                    sectionIndex={
                      index
                    }
                    cycle={
                      cycle
                    }
                  />

                )
              )}

            </div>

          ))}

        </main>

      </div>

    </div>

  );
}