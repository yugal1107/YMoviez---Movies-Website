import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import CastMovies from "./pages/CastMovies";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:movieid" element={<Movie />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/cast/:castid/:castname" element={<CastMovies />} />
      </Routes>
    </Router>
  );
}

export default App;
