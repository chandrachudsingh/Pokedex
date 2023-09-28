import React, { useEffect, useState } from "react";
import PokemonFilterSection from "./PokemonFilterSection";
import ResultPokemons from "./ResultPokemons";
import { useSearchParams } from "react-router-dom";

const PokemonListPage = () => {
  const [page, setPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [scrollLoading, setScrollLoading] = useState(false);
  const [pokemonsLoading, setPokemonsLoading] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [searchPokemons, setSearchPokemons] = useState([]);
  const [displayPokemons, setDisplayPokemons] = useState([]);
  const [abilityPokemons, setAbilityPokemons] = useState([]);
  const [groupPokemons, setGroupPokemons] = useState([]);
  const [habitatPokemons, setHabitatPokemons] = useState([]);
  const [locationPokemons, setLocationPokemons] = useState([]);
  const [typePokemons, setTypePokemons] = useState([]);
  const pageSize = 10;
  const api = "https://pokeapi.co/api/v2/";

  const [searchParams, setSearchParams] = useSearchParams();

  const getQueryParams = () => {
    let params = {};
    searchParams.forEach((value, key) => {
      params = { ...params, [key]: value.toLowerCase() };
    });
    return params;
  };

  const getResults = async (url, searchText) => {
    const response = await fetch(url);
    const result = await response.json();
    const pokemonList = result.results;
    const list = pokemonList.filter((pokemon) => pokemon.name === searchText);
    return list;
  };

  const getParamSearch = async () => {
    setPokemonsLoading(true);
    let search = searchParams.get("search");
    if (search) {
      search = search.toLowerCase();
    }
    // search by name
    if (!search || search === "pokedex") {
      setSearchItem({
        name: "pokedex",
        url: api + "pokemon/?offset=0&limit=10000",
      });
    } else {
      const pokemonList = await getResults(
        api + "pokemon/?offset=0&limit=10000",
        search
      );
      if (pokemonList.length > 0) {
        setSearchItem(pokemonList[0]);
      } else {
        // search by ability
        const pokemonList2 = await getResults(
          api + "ability/?offset=0&limit=1000",
          search
        );
        if (pokemonList2.length > 0) {
          setSearchItem(pokemonList2[0]);
        } else {
          // search by move
          const pokemonList3 = await getResults(
            api + "move/?offset=0&limit=1000",
            search
          );
          if (pokemonList3.length > 0) {
            setSearchItem(pokemonList3[0]);
          } else {
            setSearchItem([]);
          }
        }
      }
    }
  };

  const getAllFilteredPokemons = async () => {
    setPokemonsLoading(true);
    if (!searchItem) {
      return;
    }

    const params = getQueryParams();

    if (searchItem.name === "pokedex") {
      const response = await fetch(searchItem.url);
      let result = await response.json();
      result = result.results;
      setSearchPokemons(result);
    } else {
      if (searchItem.length === 0) {
        setPokemonsLoading(false);
        setSearchPokemons([]);
        return;
      }
      const searchType = searchItem.url
        .replace(api, "")
        .replaceAll("/", "")
        .replace(/[0-9]/g, "");
      if (searchType === "pokemon") {
        setSearchPokemons([searchItem]);
      } else {
        const response = await fetch(searchItem.url);
        let result = await response.json();
        if (searchType === "ability") {
          result = result.pokemon;
          if (result.length === 0) {
            setPokemonsLoading(false);
          }
          const pokemonList = result.map(({ pokemon }) => pokemon);
          setSearchPokemons(pokemonList);
        } else {
          result = result.learned_by_pokemon;
          if (result.length === 0) {
            setPokemonsLoading(false);
          }
          setSearchPokemons(result);
        }
      }
    }

    if ("ability" in params) {
      const url = api + `ability/${params.ability}`;
      const response = await fetch(url);
      let result = await response.json();
      result = result.pokemon;
      const pokemonList = result.map(({ pokemon }) => pokemon.name);
      setAbilityPokemons(pokemonList);
      if (
        "group" in params === false &&
        "habitat" in params === false &&
        "location" in params === false &&
        "type" in params === false
      ) {
        setPokemonsLoading(false);
      }
    } else {
      setAbilityPokemons([]);
    }

    if ("group" in params) {
      const url = api + `egg-group/${params.group}`;
      const response = await fetch(url);
      let result = await response.json();
      result = result.pokemon_species;
      const pokemonList = result.map((pokemon) => pokemon.name);
      setGroupPokemons(pokemonList);
      if (
        "habitat" in params === false &&
        "location" in params === false &&
        "type" in params === false
      ) {
        setPokemonsLoading(false);
      }
    } else {
      setGroupPokemons([]);
    }

    if ("habitat" in params) {
      const url = api + `pokemon-habitat/${params.habitat}`;
      const response = await fetch(url);
      let result = await response.json();
      result = result.pokemon_species;
      const pokemonList = result.map((pokemon) => pokemon.name);
      setHabitatPokemons(pokemonList);
      if ("location" in params === false && "type" in params === false) {
        setPokemonsLoading(false);
      }
    } else {
      setHabitatPokemons([]);
    }

    if ("location" in params) {
      const url = api + `location-area/${params.location}`;
      const response = await fetch(url);
      let result = await response.json();
      result = result.pokemon_encounters;
      const pokemonList = result.map(({ pokemon }) => pokemon.name);
      setLocationPokemons(pokemonList);
      if ("type" in params === false) {
        setPokemonsLoading(false);
      }
    } else {
      setLocationPokemons([]);
    }

    if ("type" in params) {
      const url = api + `type/${params.type}`;
      const response = await fetch(url);
      let result = await response.json();
      result = result.pokemon;
      const pokemonList = result.map(({ pokemon }) => pokemon.name);
      setTypePokemons(pokemonList);
      setPokemonsLoading(false);
    } else {
      setTypePokemons([]);
    }

    if (
      "ability" in params === false &&
      "group" in params === false &&
      "habitat" in params === false &&
      "location" in params === false &&
      "type" in params === false
    ) {
      setPokemonsLoading(false);
    }
  };

  const getCommonPokemons = () => {
    if (searchPokemons.length === 0) {
      return;
    }

    let commonPokemons = searchPokemons;
    if (abilityPokemons.length > 0) {
      commonPokemons = commonPokemons.filter((pokemon) =>
        abilityPokemons.includes(pokemon.name)
      );
    }
    if (groupPokemons.length > 0) {
      commonPokemons = commonPokemons.filter((pokemon) =>
        groupPokemons.includes(pokemon.name)
      );
    }
    if (habitatPokemons.length > 0) {
      commonPokemons = commonPokemons.filter((pokemon) =>
        habitatPokemons.includes(pokemon.name)
      );
    }
    if (locationPokemons.length > 0) {
      commonPokemons = commonPokemons.filter((pokemon) =>
        locationPokemons.includes(pokemon.name)
      );
    }
    if (typePokemons.length > 0) {
      commonPokemons = commonPokemons.filter((pokemon) =>
        typePokemons.includes(pokemon.name)
      );
    }
    setPokemons(commonPokemons);
  };

  const addNextPage = () => {
    const limit = page * pageSize;

    const newPokemons = pokemons.slice(0, limit);
    setDisplayPokemons(newPokemons);
    setScrollLoading(false);
  };

  const handleInfiniteScroll = async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;

    if (innerHeight + scrollTop + 1 >= scrollHeight) {
      setScrollLoading(true);
      setPage((prevPage) => {
        return prevPage + 1;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, []);

  useEffect(() => {
    getAllFilteredPokemons();
  }, [searchParams, searchItem]);

  useEffect(() => {
    getParamSearch();
  }, []);

  useEffect(() => {
    getCommonPokemons();
  }, [
    searchPokemons,
    abilityPokemons,
    groupPokemons,
    habitatPokemons,
    locationPokemons,
    typePokemons,
  ]);

  useEffect(() => {
    addNextPage();
  }, [page, pokemons]);

  return (
    <div className="pokemon-list-page">
      <PokemonFilterSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getQueryParams={getQueryParams}
        setPage={setPage}
      />
      <ResultPokemons
        pokemons={displayPokemons}
        getQueryParams={getQueryParams}
        scrollLoading={scrollLoading}
        pokemonsLoading={pokemonsLoading}
      />
    </div>
  );
};

export default PokemonListPage;
