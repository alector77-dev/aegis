import { useState } from "react";
import "./DiceModal.css";

import dice1 from "../assets/dice/1.png";
import dice2 from "../assets/dice/2.png";
import dice3 from "../assets/dice/3.png";
import dice4 from "../assets/dice/4.png";
import dice5 from "../assets/dice/5.png";
import dice6 from "../assets/dice/6.png";

type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;

export default function DiceModal() {
  const [diceText, setDiceText] =
    useState("Ready");

  const [diceFace, setDiceFace] =
    useState<DiceFace>(1);

  const [isRolling, setIsRolling] =
    useState(false);

  const diceImages: Record<DiceFace, string> = {
    1: dice1,
    2: dice2,
    3: dice3,
    4: dice4,
    5: dice5,
    6: dice6,
  };

  const numberWords = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
  ] as const;

  function handleRoll() {
    if (isRolling) {
      return;
    }

    setIsRolling(true);

    setDiceText("Rolling...");

    const result = (
      Math.floor(Math.random() * 6) + 1
    ) as DiceFace;

    const sequence: DiceFace[] = [result];

    for (let i = 0; i < 7; i++) {
      let nextFace: DiceFace;

      do {
        nextFace = (
          Math.floor(Math.random() * 6) + 1
        ) as DiceFace;
      } while (
        nextFace === sequence[sequence.length - 1]
      );

      sequence.push(nextFace);
    }

    sequence.reverse();

    let animationStep = 0;

    const interval = setInterval(() => {
      animationStep =
        (animationStep + 1) % sequence.length;

      setDiceFace(sequence[animationStep]);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);

      setDiceFace(result);

      setDiceText(numberWords[result]);

      setIsRolling(false);
    }, 560);
  }

  return (
    <div
      className="dice-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="dice-image-container">
        <img
          src={diceImages[diceFace]}
          alt={`Dice ${diceFace}`}
          className={`dice-image ${
            isRolling ? "rolling" : ""
          }`}
        />
      </div>

      <div className="dice-result-text">
        {diceText}
      </div>

      <button
        className="dice-roll-button"
        onClick={handleRoll}
        disabled={isRolling}
      >
        Roll
      </button>
    </div>
  );
}