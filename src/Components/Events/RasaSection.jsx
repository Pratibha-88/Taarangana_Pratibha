import { useState, useEffect } from "react";
import "./RasaSection.css";

const events = [
  {
    id: 1,
    title: "Antra",
    rasa: "Adbhuta",
    emotion: "Wonder",
    eventType: "Group Singing",
    description:
      "When multiple voices blend into harmony, something greater than the individual emerges.",
    whyRasa:
      "Group singing evokes awe through collective resonance, unpredictability, and the sheer wonder of shared musical expression.",
    time: "10:00 AM",
    venue: "Main Auditorium",
    borderColor: "#55e6d0a5",
    rasaColor: "#55e6d1",
  },

  {
    id: 2,
    title: "Rap Battle",
    rasa: "Raudra",
    emotion: "Fury",
    eventType: "Solo Rap",
    description:
      "Channel raw intensity, confrontation, and unfiltered emotion through aggressive cadence and lyrical warfare.",
    whyRasa:
      "Rap battles embody fury through verbal confrontation, intense energy, and the raw power of unfiltered expression.",
    time: "11:30 AM",
    venue: "Open Arena",
    borderColor: "rgba(239,68,68,0.5)",
    rasaColor: "#f87171",
  },

  {
    id: 3,
    title: "Nukkad Natak",
    rasa: "Bibhatsa",
    emotion: "Disgust",
    eventType: "Street Theatre",
    description:
      "Confront social evils head-on, exposing corruption, injustice, and hypocrisy through powerful street performances.",
    whyRasa:
      "Street theatre channels disgust at social injustice into powerful performances that confront audiences with uncomfortable truths.",
    time: "2:00 PM",
    venue: "Central Quad",
    borderColor: "#06fe7a80",
    rasaColor: "#06fe7a",
  },

  {
    id: 4,
    title: "Slam Poetry",
    rasa: "Bhayanaka",
    emotion: "Fear",
    eventType: "Open Mic",
    description:
      "True expression requires vulnerability. Face the fear of being seen, heard, and judged.",
    whyRasa:
      "Slam poetry embodies fear through the vulnerability of standing alone, bearing your soul, and facing judgment from the audience.",
    time: "3:30 PM",
    venue: "Poetry Corner",
    borderColor: "#652dd489",
    rasaColor: "#7c49e4",
  },

  {
    id: 5,
    title: "Aalap",
    rasa: "Shanta",
    emotion: "Peace",
    eventType: "Solo Singing",
    description:
      "A solitary voice, unaccompanied and introspective, creates an atmosphere of calm and contemplation.",
    whyRasa:
      "Solo singing in the aalap form represents the pursuit of inner peace through meditative, unhurried musical exploration.",
    time: "5:00 PM",
    venue: "Serene Hall",
    borderColor: "rgba(255, 249, 206, 0.5)",
    rasaColor: "#fff7af",
  },

  {
    id: 6,
    title: "Lilac Dreams",
    rasa: "Shringara",
    emotion: "Love & Beauty",
    eventType: "Fashion Show",
    description:
      "Celebrate aesthetic pleasure, grace, confidence, and allure through visual and stylistic expression.",
    whyRasa:
      "Fashion embodies love and beauty through the celebration of aesthetics, self-expression, and the art of visual allure.",
    time: "6:30 PM",
    venue: "Grand Runway",
    borderColor: "rgba(187, 72, 236, 0.5)",
    rasaColor: "rgb(209, 137, 240)",
  },

  {
    id: 7,
    title: "Mr. & Ms. Taarangana",
    rasa: "Hasya",
    emotion: "Joy & Laughter",
    eventType: "Talent & Personality",
    description:
      "Entertainment, wit, spontaneity, and audience engagement define this celebration of joy and laughter.",
    whyRasa:
      "This event captures joy through humor, spontaneity, and the infectious energy of performers connecting with their audience.",
    time: "8:00 PM",
    venue: "Main Stage",
    borderColor: "rgba(234,179,8,0.5)",
    rasaColor: "#facc15",
  },

  {
    id: 8,
    title: "Urban Thump",
    rasa: "Veera",
    emotion: "Heroic Energy",
    eventType: "Group Dance",
    description:
      "High-impact choreography demands strength, stamina, and collective discipline.",
    whyRasa:
      "Group dance embodies heroic energy through synchronized power, physical prowess, and the courage to command the stage.",
    time: "9:30 PM",
    venue: "Dance Arena",
    borderColor: "rgba(22, 181, 249, 0.5)",
    rasaColor: "rgb(22, 181, 249)",
  },

  {
    id: 9,
    title: "Rangmancha",
    rasa: "Karuna",
    emotion: "Compassion",
    eventType: "Solo Acting",
    description:
      "Step into another's emotional reality through empathy, vulnerability, and deep human connection.",
    whyRasa:
      "Solo acting channels compassion by requiring the performer to deeply inhabit another's pain, joy, and emotional truth.",
    time: "11:00 PM",
    venue: "Theatre Hall",
    borderColor: "#3f90f480",
    rasaColor: "#3f90f4",
  },
];

export default function RasaComponent() {
  const [selected, setSelected] = useState(null);

  // Listen for clicks from the Event section
  useEffect(() => {
    const handleOpenRasa = (event) => {
      const eventId = event.detail?.id;

      const rasaEvent = events.find(
        (e) => e.id === eventId
      );

      if (!rasaEvent) return;

      // Scroll to the Rasa section
      const rasaSection =
        document.getElementById("rasa-section");

      if (rasaSection) {
        rasaSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Wait for the scroll animation to begin,
      // then open the selected Rasa popup
      setTimeout(() => {
        setSelected(rasaEvent);
      }, 500);
    };

    window.addEventListener(
      "open-rasa",
      handleOpenRasa
    );

    return () => {
      window.removeEventListener(
        "open-rasa",
        handleOpenRasa
      );
    };
  }, []);

  // Reset body scroll when modal is closed safely
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div
      id="rasa-section"
      className="rasa-container"
    >
      <div className="rasa-header">
        <h1 className="rasa-title">
          The Nine <span>Rasas</span>
        </h1>

        <p className="rasa-subtitle">
          Each event embodies one of the nine classical
          emotions — discover the essence that resonates
          with your soul
        </p>
      </div>

      <div className="rasa-grid">
        {events.map((e) => (
          <button
            key={e.id}
            className="rasa-card"
            style={{
              "--card-border": e.borderColor,
              "--rasa-color": e.rasaColor,
            }}
            onClick={() => setSelected(e)}
          >
            <h3 className="rasa-card-title">
              {e.title}
            </h3>

            <p className="rasa-card-rasa">
              {e.rasa} · {e.emotion}
            </p>

            <p className="rasa-card-desc">
              {e.eventType} – {e.description}
            </p>

            <div className="rasa-card-meta">
              <span>{e.time}</span>
              <span>{e.venue}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="rasa-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="rasa-dialog"
            onClick={(ev) => ev.stopPropagation()}
            style={{
              "--rasa-color": selected.rasaColor,
            }}
          >
            <button
              className="rasa-dialog-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <div className="rasa-dialog-body">
              <h2 className="rasa-dialog-title">
                {selected.title}
              </h2>

              <p className="rasa-dialog-rasa">
                {selected.rasa} · {selected.emotion}
              </p>

              <div className="rasa-dialog-meta">
                <span>{selected.time}</span>
                <span>{selected.venue}</span>
              </div>

              <p className="rasa-dialog-desc">
                {selected.eventType} –{" "}
                {selected.description}
              </p>

              <div className="rasa-why-box">
                <p className="rasa-why-title">
                  Why {selected.rasa}?
                </p>

                <p className="rasa-why-text">
                  {selected.whyRasa}
                </p>
              </div>

              <button className="rasa-register-btn">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}