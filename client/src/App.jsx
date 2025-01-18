import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import CastMovies from "./pages/CastMovies";
import CarouselUI from "./components/Carousel";
import GenreMovies from "./pages/GenreMovies";
import MovieChatbot from "./pages/MovieChatbot";

function App() {
  return (
    <Router>
      <Navbar />
      <MovieChatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:movieid" element={<Movie />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/cast/:castid/:castname" element={<CastMovies />} />
        <Route path="/chatbot" element={<MovieChatbot />} />
        <Route path="/genre/:genreId" element={<GenreMovies />} />
        <Route path="/demo" element={<CarouselUI />} />
      </Routes>
    </Router>
  );
}

export default App;
