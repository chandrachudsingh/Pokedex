import React from "react";
import HomePage from "./Components/HomePage";
import PokemonListPage from "./Components/PokemonListPage";
import PokemonDetailsPage from "./Components/PokemonDetailsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookmarksPage from "./Components/BookmarksPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/pokemons" element={<PokemonListPage />} />
          <Route
            path="/pokemons/:pokemon_name"
            element={<PokemonDetailsPage />}
          />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
