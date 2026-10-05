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

import mandalaBottom from '../../assets/Mandala Bottom.webp';

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
  sectionIndex
}) {
  return (
    <section
      className={`sponsor-section ${sectionClass}`}
      data-section={sectionIndex}
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
     
     DESKTOP ONLY.
     
     Mobile has NO timer and NO automatic scrolling.
     ======================================================= */

  useEffect(() => {

    const el = scrollRef.current;

    if (!el) {
      return;
    }


    const mediaQuery =
      window.matchMedia(
        '(max-width: 900px)'
      );


    let timer = null;

    let isPaused = false;


    /* -----------------------------------------------------
       CLEANUP TIMER
       ----------------------------------------------------- */

    const clearAutoScroll = () => {

      if (timer !== null) {

        clearTimeout(timer);

        timer = null;
      }

    };


    /* -----------------------------------------------------
       FIND CURRENT SECTION
       ----------------------------------------------------- */

    const advance = () => {

      /*
       * Absolute safety check.
       *
       * Even if something triggers advance later,
       * it can NEVER scroll on mobile.
       */
      if (
        mediaQuery.matches ||
        isPaused
      ) {
        return;
      }


      const sectionElements =
        Array.from(
          el.querySelectorAll(
            '.sponsor-section'
          )
        );


      if (!sectionElements.length) {
        return;
      }


      let currentIndex = 0;

      let smallestDistance =
        Infinity;


      sectionElements.forEach(
        (section, index) => {

          const distance =
            Math.abs(
              section.offsetTop -
              el.scrollTop
            );


          if (
            distance <
            smallestDistance
          ) {

            smallestDistance =
              distance;

            currentIndex =
              index;
          }

        }
      );


      const nextIndex =
        (
          currentIndex + 1
        ) %
        sectionElements.length;


      const target =
        sectionElements[nextIndex];


      if (!target) {
        return;
      }


      el.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });

    };


    /* -----------------------------------------------------
       START DESKTOP TIMER
       ----------------------------------------------------- */

    const startTimer = () => {

      clearAutoScroll();


      /*
       * NEVER start timer on mobile.
       */
      if (mediaQuery.matches) {
        return;
      }


      if (isPaused) {
        return;
      }


      timer = setTimeout(() => {

        if (
          !mediaQuery.matches &&
          !isPaused
        ) {

          advance();

          startTimer();
        }

      }, AUTOSCROLL_INTERVAL);

    };


    /* -----------------------------------------------------
       MOUSE ENTER
       ----------------------------------------------------- */

    const handleMouseEnter = () => {

      isPaused = true;

      clearAutoScroll();

    };


    /* -----------------------------------------------------
       MOUSE LEAVE
       ----------------------------------------------------- */

    const handleMouseLeave = () => {

      isPaused = false;


      if (!mediaQuery.matches) {
        startTimer();
      }

    };


    /* -----------------------------------------------------
       SETUP CARD EVENTS
       ----------------------------------------------------- */

    const setupCardEvents = () => {

      const sponsorCards =
        el.querySelectorAll(
          '.sponsor-card'
        );


      sponsorCards.forEach(
        (card) => {

          card.addEventListener(
            'mouseenter',
            handleMouseEnter
          );

          card.addEventListener(
            'mouseleave',
            handleMouseLeave
          );

        }
      );


      return sponsorCards;
    };


    /* -----------------------------------------------------
       REMOVE CARD EVENTS
       ----------------------------------------------------- */

    const removeCardEvents = () => {

      const sponsorCards =
        el.querySelectorAll(
          '.sponsor-card'
        );


      sponsorCards.forEach(
        (card) => {

          card.removeEventListener(
            'mouseenter',
            handleMouseEnter
          );

          card.removeEventListener(
            'mouseleave',
            handleMouseLeave
          );

        }
      );

    };


    /* -----------------------------------------------------
       BREAKPOINT CHANGE
       ----------------------------------------------------- */

    const handleBreakpointChange = () => {

      /*
       * Always stop the old timer first.
       */
      clearAutoScroll();

      isPaused = false;


      /*
       * Mobile:
       * no timer.
       */
      if (mediaQuery.matches) {
        return;
      }


      /*
       * Desktop:
       * restart timer.
       */
      startTimer();

    };


    /* -----------------------------------------------------
       INITIAL SETUP
       ----------------------------------------------------- */

    const sponsorCards =
      setupCardEvents();


    /*
     * IMPORTANT:
     *
     * If this is a phone, this does nothing.
     */
    if (!mediaQuery.matches) {
      startTimer();
    }


    mediaQuery.addEventListener(
      'change',
      handleBreakpointChange
    );


    /* -----------------------------------------------------
       CLEANUP
       ----------------------------------------------------- */

    return () => {

      clearAutoScroll();

      removeCardEvents();

      mediaQuery.removeEventListener(
        'change',
        handleBreakpointChange
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
            ----------------------------------------------- */}

        <main className="sponsi-page">

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
              />

            )
          )}

        </main>

      </div>

    </div>

  );
}
