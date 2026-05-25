import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SearchPage.css";

import rawCards from "../data/edison_cards_final.json";

type Card = {
  id: number;
  name: string;
  aliases: string[];
  searchNames: string[];

  edisonText?: string;
  edisonComRulings?: string[];

  edisonNetText?: string;
  edisonNetRulings?: string[];

  currentText?: string;
};

const cards = rawCards as Card[];

function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[.,'"*:;’]/g, "")
    .trim();
}

export default function SearchPage() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredCards = useMemo<Card[]>(() => {
    const normalizedSearch = normalize(search);

    if (!normalizedSearch) {
      return [];
    }

    return cards
      .filter((card) =>
        card.searchNames.some((searchName) =>
          searchName.includes(normalizedSearch),
        ),
      )
      .slice(0, 40);
  }, [search]);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-top-bar">
          <button
            className="search-back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <input
            className="search-input"
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-results">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              className="search-card-row"
              onClick={() => navigate(`/card/${card.id}`)}
            >
              {card.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}