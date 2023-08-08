import PokemonOpen from "../Images/pokeball-open.png";

export const formatPokemonCardData = (pokemon) => {
  const { id, name, sprites, types } = pokemon;

  const paddedId = String(id).padStart(4, "0");
  const formattedTypes = types.map(({ type }) => type.name);
  const pokemonImg =
    sprites.other["official-artwork"].front_default ||
    sprites.other.dream_world.front_default;
  return {
    id: paddedId,
    name: removeHyphens(name),
    imgSrc: pokemonImg ? pokemonImg : PokemonOpen,
    types: formattedTypes,
  };
};

export const formatPokemonData = (pokemon, species) => {
  const { stats, abilities, height, weight, moves } = pokemon;
  const { flavor_text_entries, egg_groups, habitat } = species;

  const formattedCardData = formatPokemonCardData(pokemon);
  const { id, name, imgSrc, types } = formattedCardData;

  let description = "";
  if (flavor_text_entries.length > 0) {
    const allDescriptions = flavor_text_entries
      .filter((entry) => entry.language.name === "en")
      .map((entry) => entry.flavor_text)
      .sort(function (a, b) {
        return b.length - a.length;
      });
    description = allDescriptions[0].replace("\f", " ").toLowerCase();
  }
  const heightInMtr = height / 10 + " m";
  const weightInKg = weight / 10 + " kg";
  const habitatName = habitat ? habitat.name : "unknown";
  const abilityList = abilities.map((abilityData) => abilityData.ability.name);
  const formattedStats = stats.map((statsData) => {
    const {
      base_stat,
      stat: { name },
    } = statsData;
    return { name, base_stat };
  });
  const moveNames = moves.map((movesData) => movesData.move.name);
  const eggGroups = egg_groups.map((group) => group.name);

  return {
    id,
    name,
    imgSrc,
    description,
    height: heightInMtr,
    weight: weightInKg,
    habitat: habitatName,
    types,
    abilities: abilityList,
    stats: formattedStats,
    moves: moveNames,
    eggGroups,
    evolution: null,
  };
};

const removeHyphens = (name) => {
  return name.replace("-", " ");
};
