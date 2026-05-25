import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import cardsData from "../data/edison_cards_final.json";

import "./CardPage.css";

type Card = {
  id: number;
  name: string;

  aliases?: string[];
  searchNames?: string[];

  edisonText?: string;
  edisonNetText?: string;

  edisonComRulings?: string[];
  edisonNetRulings?: string[];

  currentText?: string;
};

const cards = cardsData as Card[];

type SectionProps = {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
};

function Section({
  title,
  open,
  setOpen,
  children,
}: SectionProps) {
  return (
    <div className="section">
      <button
        className="section-header"
        onClick={() => setOpen(!open)}
      >
        <span className="section-arrow">
          {open ? "▼" : "▶"}
        </span>

        <span className="section-title">
          {title}
        </span>
      </button>

      {open && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default function CardPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const card = useMemo(() => {
    return cards.find(
      (c) => c.id.toString() === id,
    );
  }, [id]);

  const [edisonOpen, setEdisonOpen] = useState(true);

  const [netTextOpen, setNetTextOpen] = useState(
    !!card?.edisonNetText &&
      card.edisonNetText !==
        "No modernized PSCT available.",
  );

  const [rulingsOpen, setRulingsOpen] = useState(true);

  const [currentOpen, setCurrentOpen] =
    useState(false);

  if (!card) {
    return (
      <div className="card-page not-found-page">
        <div className="not-found-text">
          Card not found.
        </div>
      </div>
    );
  }

  return (
    <div className="card-page">
      <div className="card-page-container">
        {/* BACK BUTTON */}

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        {/* TITLE */}

        <div className="title-card">
          <h1 className="card-name">
            {card.name}
          </h1>
        </div>

        {/* EDISON TEXT */}

        {!!card.edisonText && (
          <Section
            title="Edison Text"
            open={edisonOpen}
            setOpen={setEdisonOpen}
          >
            <div className="content-card">
              <p className="body-text">
                {card.edisonText}
              </p>
            </div>
          </Section>
        )}

        {/* MODERNIZED */}

        {!!card.edisonNetText && (
          <Section
            title="Modernized Edison PSCT"
            open={netTextOpen}
            setOpen={setNetTextOpen}
          >
            <div className="content-card">
              <p className="body-text">
                {card.edisonNetText}
              </p>
            </div>
          </Section>
        )}

        {/* RULINGS */}

        {(card.edisonComRulings ||
          card.edisonNetRulings) && (
          <Section
            title="Rulings"
            open={rulingsOpen}
            setOpen={setRulingsOpen}
          >
            {!!card.edisonNetRulings &&
              card.edisonNetRulings.map(
                (ruling, index) => (
                  <div
                    key={`net-${index}`}
                    className="ruling-card net-ruling"
                  >
                    <div className="ruling-source">
                      EdisonFormat.net
                    </div>

                    <p className="body-text">
                      {ruling}
                    </p>
                  </div>
                ),
              )}

            {!!card.edisonComRulings &&
              card.edisonComRulings.map(
                (ruling, index) => (
                  <div
                    key={`com-${index}`}
                    className="ruling-card com-ruling"
                  >
                    <div className="ruling-source">
                      EdisonFormat.com
                    </div>

                    <p className="body-text">
                      {ruling}
                    </p>
                  </div>
                ),
              )}
          </Section>
        )}

        {/* CURRENT TEXT */}

        {!!card.currentText && (
          <Section
            title="Current Card Text"
            open={currentOpen}
            setOpen={setCurrentOpen}
          >
            <div className="content-card">
              <p className="body-text">
                {card.currentText}
              </p>
            </div>
          </Section>
        )}

        {/* LINKS */}

        <div className="links-container">
          <a
            className="link-button"
            href="https://www.edisonformat.com/"
            target="_blank"
            rel="noreferrer"
          >
            EdisonFormat.com
          </a>

          <a
            className="link-button"
            href={`https://edisonformat.net/card?name=${encodeURIComponent(
              card.name,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            EdisonFormat.net
          </a>
        </div>
      </div>
    </div>
  );
}