import "./DuelLogModal.css";

export type DuelLogEntry = {
  player: 1 | 2;
  previousLP: number;
  operator: "+" | "-" | "/2";
  newLP: number;
  undone?: boolean;
};

type DuelLogModalProps = {
  duelLog: DuelLogEntry[];
  player1Name: string;
  player2Name: string;
};

export default function DuelLogModal({
  duelLog,
  player1Name,
  player2Name,
}: DuelLogModalProps) {
  return (
    <div
      className="duel-log-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="duel-log-scroll">
        {[...duelLog].reverse().map((entry, index) => {
          const playerName =
            entry.player === 1
              ? player1Name
              : player2Name;

          const changeAmount = Math.abs(
            entry.newLP - entry.previousLP,
          );

          return (
            <div
              key={index}
              className="duel-log-entry"
            >
              <div
                className={`duel-log-player ${
                  entry.player === 1
                    ? "player1-text"
                    : "player2-text"
                }`}
              >
                {playerName}
              </div>

              <div
                className={`duel-log-details ${
                  entry.undone ? "undone-text" : ""
                }`}
              >
                {entry.previousLP} {entry.operator}{" "}
                {entry.operator !== "/2"
                  ? changeAmount
                  : ""}
                {" → "}
                {entry.newLP}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}