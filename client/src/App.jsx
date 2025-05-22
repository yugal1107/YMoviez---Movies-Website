import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movie from "./pages/Movie";
import Search from "./pages/Search";
import CastMovies from "./pages/CastMovies";
import CarouselUI from "./components/Carousel";
import GenreMovies from "./pages/GenreMovies";
import MovieChatbot from "./pages/MovieChatbot";
import "./styles/animations.css"; // Add this import for the shimmer effect
import { Toaster } from "react-hot-toast";
import PlaylistPage from "./pages/PlaylistPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import ContentTypePage from "./pages/ContentTypePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
        }}
      />
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
        <Route path="playlists" element={<PlaylistPage />} />
        <Route path="/playlist/:playlistid" element={<PlaylistDetailPage />} />
        <Route path="/content/:contentType" element={<ContentTypePage />} />
      </Routes>
      <MovieChatbot />
    </Router>
  );
}

export default App;
