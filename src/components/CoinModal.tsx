import { useState } from "react";
import "./CoinModal.css";

import headsImg from "../assets/coin/heads.png";
import tailsImg from "../assets/coin/tails.png";
import edgeImg from "../assets/coin/edge.png";

type CoinFace = "Heads" | "Tails" | "Edge";

export default function CoinModal() {
  const [coinText, setCoinText] = useState("Ready");

  const [coinFace, setCoinFace] =
    useState<CoinFace>("Heads");

  const [isFlipping, setIsFlipping] = useState(false);

  const coinImages = {
    Heads: headsImg,
    Tails: tailsImg,
    Edge: edgeImg,
  };

  function handleFlip() {
    if (isFlipping) {
      return;
    }

    setIsFlipping(true);

    setCoinText("Flipping...");

    let animationStep = 0;

    const interval = setInterval(() => {
      animationStep = (animationStep + 1) % 4;

      const frames: CoinFace[] = [
        "Heads",
        "Edge",
        "Tails",
        "Edge",
      ];

      setCoinFace(frames[animationStep]);
    }, 80);

    setTimeout(() => {
      const result =
        Math.random() < 0.5
          ? "Heads"
          : "Tails";

      clearInterval(interval);

      setCoinFace("Edge");

      setTimeout(() => {
        setCoinFace(result);

        setCoinText(result);

        setIsFlipping(false);
      }, 80);
    }, 960);
  }

  return (
    <div
      className="coin-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="coin-image-container">
        <img
          src={coinImages[coinFace]}
          alt={coinFace}
          className={`coin-image ${
            isFlipping ? "flipping" : ""
          }`}
        />
      </div>

      <div className="coin-result-text">
        {coinText}
      </div>

      <button
        className="coin-flip-button"
        onClick={handleFlip}
        disabled={isFlipping}
      >
        Flip
      </button>
    </div>
  );
}