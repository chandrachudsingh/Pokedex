import React, { useEffect, useState } from "react";
import { FaHome, FaFilter } from "react-icons/fa";
import { MdBookmarks } from "react-icons/md";
import { Link } from "react-router-dom";

const PokemonFilterSection = ({
  searchParams,
  setSearchParams,
  getQueryParams,
  setPage,
}) => {
  const [filterBar, setFilterBar] = useState(false);
  const [abilities, setAbilities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);

  const fetchResults = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    return result.results;
  };

  const getAbilities = async () => {
    const url = "https://pokeapi.co/api/v2/ability/?offset=0&limit=1000";

    const abilityList = await fetchResults(url);
    setAbilities(abilityList);
  };

  const getGroups = async () => {
    const url = "https://pokeapi.co/api/v2/egg-group/";

    const groupsList = await fetchResults(url);
    setGroups(groupsList);
  };

  const getHabitats = async () => {
    const url = "https://pokeapi.co/api/v2/pokemon-habitat/";

    const habitatsList = await fetchResults(url);
    setHabitats(habitatsList);
  };

  const getLocations = async () => {
    const url = "https://pokeapi.co/api/v2/location-area/?offset=0&limit=1000";

    const locationList = await fetchResults(url);
    setLocations(locationList);
  };

  const getTypes = async () => {
    const url = "https://pokeapi.co/api/v2/type/";

    const typesList = await fetchResults(url);
    setTypes(typesList);
  };

  const getFilters = () => {
    getAbilities();
    getGroups();
    getHabitats();
    getLocations();
    getTypes();
  };

  const setFilters = () => {
    const params = getQueryParams();
    for (const key in params) {
      if (key !== "search") {
        searchParams.get(key);
        const doc = document.getElementById(key);
        if (doc) {
          doc.value = params[key].toLowerCase();
          doc.classList.add("bold-font");
        }
      }
    }
  };

  const setSearchParamsValues = (e) => {
    const field = e.target.id;
    const value = e.target.value;

    if (value) {
      searchParams.set(field, value);
      setSearchParams(searchParams);
      e.target.classList.add("bold-font");
    } else {
      searchParams.delete(field);
      setSearchParams(searchParams);
      e.target.classList.remove("bold-font");
    }

    window.scrollTo({ top: 0 });
    setPage(1);
  };

  const clearParams = () => {
    const params = getQueryParams();
    for (const key in params) {
      if (key !== "search") {
        searchParams.delete(key);
        setSearchParams(searchParams);
      }
    }

    const fields = document.querySelectorAll(".select-filter select");
    fields.forEach((field) => {
      field.selectedIndex = 0;
      field.classList.remove("bold-font");
    });
  };

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    setFilters();
  }, [abilities, groups, habitats, locations, types]);

  return (
    <section className="pokemon-filter-container">
      <div className="filter-header">
        <Link to="/" className="home-btn secondary-btn">
          <FaHome />
        </Link>
        <button
          className="filter-btn primary-btn"
          onClick={() => setFilterBar(!filterBar)}
        >
          <FaFilter />
          filter
        </button>
        <Link to="/bookmarks" className="bookmarks-btn secondary-btn">
          <MdBookmarks />
        </Link>
      </div>
      <div
        className={`filter-options-container ${filterBar && "show-filters"}`}
      >
        <div className="filter-options">
          <div className="select-filter">
            <select
              name="ability"
              id="ability"
              onChange={(e) => setSearchParamsValues(e)}
            >
              <option value="">select ability</option>
              {abilities.map((ability) => {
                return (
                  <option key={ability.url} value={ability.name}>
                    {ability.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select-filter">
            <select
              name="group"
              id="group"
              onChange={(e) => setSearchParamsValues(e)}
            >
              <option value="">select egg-group</option>
              {groups.map((group) => {
                return (
                  <option key={group.url} value={group.name}>
                    {group.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select-filter">
            <select
              name="habitat"
              id="habitat"
              onChange={(e) => setSearchParamsValues(e)}
            >
              <option value="">select habitat</option>
              {habitats.map((habitat) => {
                return (
                  <option key={habitat.url} value={habitat.name}>
                    {habitat.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select-filter">
            <select
              name="location"
              id="location"
              onChange={(e) => setSearchParamsValues(e)}
            >
              <option value="">select location</option>
              {locations.map((location) => {
                const { name, url } = location;
                const shortName =
                  name.length > 20 ? name.substr(0, 20) + "..." : name;
                return (
                  <option key={url} value={name}>
                    {shortName}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select-filter">
            <select
              name="type"
              id="type"
              onChange={(e) => setSearchParamsValues(e)}
            >
              <option value="">select Type</option>
              {types.map((type) => {
                return (
                  <option key={type.url} value={type.name}>
                    {type.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <button className="reset-btn primary-btn" onClick={clearParams}>
          reset
        </button>
      </div>
      <div className="border-line"></div>
    </section>
  );
};

export default PokemonFilterSection;
