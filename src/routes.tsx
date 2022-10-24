import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Game from "./pages/game";
import Home from "./pages/home";
import InsertNewGame from "./pages/insert-new-game";
import Sign from "./pages/sign";
import User from "./pages/user";

export default function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/user" element={<User />} />
        <Route path="/insert-new-game" element={<InsertNewGame />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </Router>
  );
}
