import { Routes, Route } from "react-router-dom";
import DuelPage from "./pages/DuelPage";
import SearchPage from "./pages/SearchPage";
import { useState } from "react";
import type { DuelLogEntry } from "./components/DuelLogModal";
//import CardPage from "./pages/CardPage";

export default function App() {
  const [player1LP, setPlayer1LP] = useState(8000);
  const [player2LP, setPlayer2LP] = useState(8000);

  const [displayedPlayer1LP, setDisplayedPlayer1LP] = useState(8000);
  const [displayedPlayer2LP, setDisplayedPlayer2LP] = useState(8000);

  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const [duelLog, setDuelLog] = useState<DuelLogEntry[]>([]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DuelPage
            player1LP={player1LP}
            setPlayer1LP={setPlayer1LP}
            player2LP={player2LP}
            setPlayer2LP={setPlayer2LP}
            displayedPlayer1LP={displayedPlayer1LP}
            setDisplayedPlayer1LP={setDisplayedPlayer1LP}
            displayedPlayer2LP={displayedPlayer2LP}
            setDisplayedPlayer2LP={setDisplayedPlayer2LP}
            player1Name={player1Name}
            setPlayer1Name={setPlayer1Name}
            player2Name={player2Name}
            setPlayer2Name={setPlayer2Name}
            duelLog={duelLog}
            setDuelLog={setDuelLog}
          />
        }
      />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}
