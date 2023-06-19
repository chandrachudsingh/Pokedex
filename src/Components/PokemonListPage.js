import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import { MdCatchingPokemon } from "react-icons/md";
import PokemonFilterSection from "./PokemonFilterSection";

const PokemonListPage = () => {
  const pageSize = 10;

  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const url = "https://pokeapi.co/api/v2/pokemon";
  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchValue = useMemo(() => searchParams.get("value"));

  const getQueryParams = () => {
    return getSearchValue;
  };

  const getAllPokemons = async (searchVal) => {
    try {
      if (!searchVal) {
        const response = await fetch(
          url + `?offset=${offset}&limit=${pageSize}`
        );
        const result = await response.json();
        const pokemonList = result.results;
        setPokemons((prevPokemons) => [...prevPokemons, ...pokemonList]);
      } else {
        const data = [{ name: searchVal, url: url + "/" + searchVal }];
        setPokemons(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInfiniteScroll = async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (innerHeight + scrollTop >= scrollHeight) {
      setOffset((prevOffset) => {
        return prevOffset + pageSize;
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    const value = getQueryParams();
    if (value === null || value === "pokedex") {
      getAllPokemons("");
    } else {
      getAllPokemons(value);
    }
  }, [offset]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  return (
    <div className="pokemon-list-page">
      <PokemonFilterSection />
      <section className="pokemon-list-container">
        <h1 className="pokemon-list-heading">
          {getSearchValue === "pokedex" ? "pokédex" : "your pokemon"}
        </h1>
        <div className="pokemon-list">
          {pokemons.map((pokemon) => {
            const { name, url } = pokemon;
            return <PokemonCard key={name} name={name} pokemon_url={url} />;
          })}
        </div>
        {loading && <MdCatchingPokemon className="loading-icon" />}
      </section>
    </div>
  );
};

export default PokemonListPage;
