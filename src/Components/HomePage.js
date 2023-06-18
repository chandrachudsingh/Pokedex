import React, { useEffect, useRef, useState } from "react";
import pokemonLogo from "../Images/pokemon-logo2.png";
import Pokeball from "../Images/pokeball.png";
import { MdCatchingPokemon } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const searchBtnRef = useRef();

  const url = "https://pokeapi.co/api/v2/pokemon/";
  const navigate = useNavigate();

  const searchPokemon = async () => {
    if (searchText) {
      const response = await fetch(`${url}${searchText}`);
      if (response.ok) {
        navigate(`/pokemons?value=${searchText}`);
      } else {
        // error
      }
      // error
    }
  };

  useEffect(() => {
    const input = document.getElementById("txsearch");

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtnRef.current.click();
      }
    });
  }, []);

  return (
    <main className="home-page">
      <div className="pokemon-logo-container">
        <img src={pokemonLogo} alt="Pokemon Logo" />
      </div>
      <div className="search-field">
        <input
          type="text"
          id="txsearch"
          placeholder="Search Pokemon"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="search-btn"
          ref={searchBtnRef}
          onClick={searchPokemon}
        >
          <FaSearch className="search-icon" />
        </button>
      </div>

      <Link to="/pokemons?value=pokedex" className="pokedex-btn">
        {/* <MdCatchingPokemon className="pokeball-icon" /> */}
        <img src={Pokeball} alt="" />
        <p>Pokédex</p>
      </Link>
    </main>
  );
};

export default HomePage;
