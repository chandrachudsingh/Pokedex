import React from "react";
import HomePage from "./Components/HomePage";
import PokemonListPage from "./Components/PokemonListPage";
import PokemonDetailsPage from "./Components/PokemonDetailsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PokemonProvider } from "./ContextAPI/context";

function App() {
  return (
    <PokemonProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/pokemons" element={<PokemonListPage />} />
            <Route
              path="/pokemons/:pokemon_name"
              element={<PokemonDetailsPage />}
            />
            {/* <Route path="/bookmarks" element={<BookmarkPage />} /> */}
          </Routes>
        </Router>
      </div>
    </PokemonProvider>
  );
}

export default App;
