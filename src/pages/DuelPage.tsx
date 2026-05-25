import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DuelPage.css";
import CalculatorModal from "../components/CalculatorModal";
import LPWheel from "../components/LPWheel";
import ModalBackdrop from "../components/ModalBackdrop";
import ResetModal from "../components/ResetModal";
import DuelLogModal from "../components/DuelLogModal";
import CoinModal from "../components/CoinModal";
import DiceModal from "../components/DiceModal";

type DuelPageProps = {
  player1LP: number;
  setPlayer1LP: React.Dispatch<React.SetStateAction<number>>;

  player2LP: number;
  setPlayer2LP: React.Dispatch<React.SetStateAction<number>>;

  displayedPlayer1LP: number;
  setDisplayedPlayer1LP: React.Dispatch<React.SetStateAction<number>>;

  displayedPlayer2LP: number;
  setDisplayedPlayer2LP: React.Dispatch<React.SetStateAction<number>>;

  player1Name: string;
  setPlayer1Name: React.Dispatch<React.SetStateAction<string>>;

  player2Name: string;
  setPlayer2Name: React.Dispatch<React.SetStateAction<string>>;

  duelLog: DuelLogEntry[];
  setDuelLog: React.Dispatch<React.SetStateAction<DuelLogEntry[]>>;
};

type DuelLogEntry = {
  player: 1 | 2;
  operator: "+" | "-" | "/2";
  previousLP: number;
  newLP: number;
  undone?: boolean;
};

type LPAction = {
  player: 1 | 2;
  playerLP?: number;

  type: "set" | "adjust" | "half";

  value?: number;

  mergeWithPrevious?: boolean;
  applyChange?: boolean;
};

export default function DuelPage({
  player1LP,
  setPlayer1LP,

  player2LP,
  setPlayer2LP,

  displayedPlayer1LP,
  setDisplayedPlayer1LP,

  displayedPlayer2LP,
  setDisplayedPlayer2LP,

  player1Name,
  setPlayer1Name,

  player2Name,
  setPlayer2Name,

  duelLog,
  setDuelLog,
}: DuelPageProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<1 | 2 | null>(null);

  const [calculatorVisible, setCalculatorVisible] = useState(false);

  const [pendingLP, setPendingLP] = useState<number | null>(null);

  const [calculatorStartLP, setCalculatorStartLP] = useState<number | null>(
    null,
  );

  const [logVisible, setLogVisible] = useState(false);

  const [resetVisible, setResetVisible] = useState(false);

  const [coinVisible, setCoinVisible] = useState(false);

  const [diceVisible, setDiceVisible] = useState(false);

  const navigate = useNavigate();

  const player1Danger = 1 - displayedPlayer1LP / 8000;
  const player2Danger = 1 - displayedPlayer2LP / 8000;

  function applyLPAction({
    player,
    playerLP,
    type,
    value,
    mergeWithPrevious = false,
    applyChange = true,
  }: LPAction) {
    const currentLP = player === 1 ? player1LP : player2LP;

    let newLP = playerLP ?? currentLP;

    if (type === "set") {
      newLP = value ?? currentLP;
    }

    if (type === "adjust") {
      newLP = Math.max(newLP + (value ?? 0), 0);
    }

    if (type === "half") {
      newLP = Math.ceil(newLP / 2);
    }

    if (applyChange) {
      if (player === 1) {
        setPlayer1LP(newLP);
        setDisplayedPlayer1LP(newLP);
      } else {
        setPlayer2LP(newLP);
        setDisplayedPlayer2LP(newLP);
      }
    }

    setDuelLog((prev) => {
      const lastEntry = prev[prev.length - 1];

      const canMerge =
        mergeWithPrevious &&
        lastEntry &&
        !lastEntry.undone &&
        lastEntry.player === player;

      if (canMerge) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastEntry,
            operator: newLP > lastEntry.previousLP ? "+" : "-",
            newLP,
          },
        ];
      }

      let operator: "+" | "-" | "/2" = "+";

      if (type === "half") {
        operator = "/2";
      } else if (newLP < currentLP) {
        operator = "-";
      }

      return [
        ...prev,
        {
          player,
          operator,
          previousLP: playerLP ?? currentLP,
          newLP,
        },
      ];
    });
  }

  function handleUndo() {
    if (duelLog.length === 0) {
      return;
    }

    const lastActiveIndex = [...duelLog]
      .map((entry, index) => ({
        entry,
        index,
      }))
      .reverse()
      .find(({ entry }) => !entry.undone)?.index;

    if (lastActiveIndex === undefined) {
      return;
    }

    const entry = duelLog[lastActiveIndex];

    if (entry.player === 1) {
      setPlayer1LP(entry.previousLP);
      setDisplayedPlayer1LP(entry.previousLP);
    } else {
      setPlayer2LP(entry.previousLP);
      setDisplayedPlayer2LP(entry.previousLP);
    }

    setDuelLog((prev) =>
      prev.map((log, index) =>
        index === lastActiveIndex
          ? {
              ...log,
              undone: true,
            }
          : log,
      ),
    );
  }

  function handleReset() {
    setPlayer1LP(8000);
    setPlayer2LP(8000);

    setDisplayedPlayer1LP(8000);
    setDisplayedPlayer2LP(8000);

    setDuelLog([]);
  }

  function handleCalculatorClose() {
    if (
      pendingLP !== null &&
      selectedPlayer !== null &&
      calculatorStartLP !== null
    ) {
      const targetLP = pendingLP;

      if (selectedPlayer === 1) {
        let current = calculatorStartLP;

        const interval = setInterval(() => {
          if (current === targetLP) {
            clearInterval(interval);
            return;
          }

          if (current < targetLP) {
            current = Math.min(current + 200, targetLP);
          } else {
            current = Math.max(current - 200, targetLP);
          }

          setPlayer1LP(current);
          setDisplayedPlayer1LP(current);
        }, 30);
      }

      if (selectedPlayer === 2) {
        let current = calculatorStartLP;

        const interval = setInterval(() => {
          if (current === targetLP) {
            clearInterval(interval);
            return;
          }

          if (current < targetLP) {
            current = Math.min(current + 200, targetLP);
          } else {
            current = Math.max(current - 200, targetLP);
          }

          setPlayer2LP(current);
          setDisplayedPlayer2LP(current);
        }, 30);
      }
    }

    setCalculatorVisible(false);
    setPendingLP(null);
    setCalculatorStartLP(null);
  }

  return (
    <>
      <div className="duel-page">
        {/* Background gradients */}

        <div
          className="danger danger-left"
          style={{
            opacity: player1Danger,
          }}
        />

        <div
          className="danger danger-right"
          style={{
            opacity: player2Danger,
          }}
        />

        {/* Main layout */}

        <div className="duel-layout">
          {/* LEFT PLAYER */}

          <div className="player-section">
            <input
              className="player-name red"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />

            <LPWheel
              lp={player1LP}
              displayedLP={displayedPlayer1LP}
              setDisplayedLP={setDisplayedPlayer1LP}
              borderColour="#D83A3A"
              side="left"
              onPress={() => {
                setSelectedPlayer(1);
                setCalculatorStartLP(player1LP);
                setCalculatorVisible(true);
              }}
              onLPCommit={(action) => {
                applyLPAction({
                  player: 1,
                  ...action,
                });
              }}
            />
          </div>

          {/* CENTER */}

          <div className="center-controls">
            <div className="button-row">
              <button
                className="control-button"
                onClick={() => setResetVisible(true)}
              >
                Reset
              </button>

              <button className="control-button" onClick={handleUndo}>
                Undo
              </button>
            </div>

            <button
              className="control-button"
              onClick={() => setLogVisible(true)}
            >
              Log
            </button>

            <div className="button-row">
              <button
                className="small-button"
                onClick={() => setDiceVisible(true)}
              >
                Dice
              </button>

              <button
                className="small-button"
                onClick={() => setCoinVisible(true)}
              >
                Coin
              </button>
            </div>

            <button
              className="control-button"
              onClick={() => navigate("/search")}
            >
              Rulings
            </button>
          </div>

          {/* RIGHT PLAYER */}

          <div className="player-section">
            <input
              className="player-name blue"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />

            <LPWheel
              lp={player2LP}
              displayedLP={displayedPlayer2LP}
              setDisplayedLP={setDisplayedPlayer2LP}
              borderColour="#3A6FD8"
              side="right"
              onPress={() => {
                setSelectedPlayer(2);
                setCalculatorStartLP(player2LP);
                setCalculatorVisible(true);
              }}
              onLPCommit={(action) => {
                applyLPAction({
                  player: 2,
                  ...action,
                });
              }}
            />
          </div>
        </div>
      </div>
      {calculatorVisible && selectedPlayer !== null && (
        <ModalBackdrop onClose={handleCalculatorClose}>
          <CalculatorModal
            currentLP={selectedPlayer === 1 ? player1LP : player2LP}
            position={selectedPlayer}
            onClose={handleCalculatorClose}
            onSubmit={(currentDisplayLP, { type, value }) => {
              let newLP = currentDisplayLP;

              if (type === "+") {
                newLP += value ?? 0;
              }

              if (type === "-") {
                newLP = Math.max(newLP - (value ?? 0), 0);
              }

              if (type === "/2") {
                newLP = Math.ceil(newLP / 2);
              }

              setPendingLP(newLP);

              applyLPAction({
                player: selectedPlayer,
                playerLP: currentDisplayLP,
                type: "set",
                value: newLP,
                applyChange: false,
              });

              return newLP;
            }}
          />
        </ModalBackdrop>
      )}
      {resetVisible && (
        <ModalBackdrop onClose={() => setResetVisible(false)}>
          <ResetModal
            onCancel={() => setResetVisible(false)}
            onConfirm={() => {
              handleReset();
              setResetVisible(false);
            }}
          />
        </ModalBackdrop>
      )}
      {logVisible && (
        <ModalBackdrop onClose={() => setLogVisible(false)}>
          <DuelLogModal
            duelLog={duelLog}
            player1Name={player1Name}
            player2Name={player2Name}
          />
        </ModalBackdrop>
      )}
      {coinVisible && (
        <ModalBackdrop onClose={() => setCoinVisible(false)}>
          <CoinModal />
        </ModalBackdrop>
      )}
      {diceVisible && (
        <ModalBackdrop onClose={() => setDiceVisible(false)}>
          <DiceModal />
        </ModalBackdrop>
      )}
    </>
  );
}
