import React from "react";
import PokemonCard from "./PokemonCard";
import { MdArrowUpward } from "react-icons/md";

const ResultPokemons = ({
  pokemons,
  getQueryParams,
  scrollLoading,
  pokemonsLoading,
}) => {
  const params = getQueryParams();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="pokemon-list-container">
      {pokemonsLoading ? (
        <>
          <div className="pokemons-loader">
            <div></div>
          </div>
        </>
      ) : (
        <>
          <h1 className="pokemon-list-heading">
            {params.search === "pokedex" && Object.keys(params).length === 1
              ? "pokédex"
              : "your pokémon"}
            {pokemons.length < 1 && ":"}
            <span>{pokemons.length < 1 && " no match"}</span>
          </h1>
          <div className="pokemon-list">
            {pokemons.map((pokemon) => {
              const { name, url } = pokemon;
              return <PokemonCard key={url} name={name} pokemon_url={url} />;
            })}
          </div>
          {scrollLoading && (
            <div className="scroll-loader">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          )}
          <button className="scroll-top-btn primary-btn" onClick={scrollToTop}>
            <MdArrowUpward className="up-icon" />
          </button>
        </>
      )}
    </section>
  );
};

export default ResultPokemons;
