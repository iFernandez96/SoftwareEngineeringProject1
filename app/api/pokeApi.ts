import { PokemonClient } from "pokenode-ts";

const api = new PokemonClient();

export async function getPokemon(name: string) {
  try {
    const pokemon = await api.getPokemonByName(name.toLowerCase());
    return pokemon;
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return null;
  }
}
