import { Routes, Route } from "react-router-dom";
import DuelPage from "./pages/DuelPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DuelPage />} />
    </Routes>
  );
}