import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import { getPokemon } from "./api/pokeApi";
import { Pokemon } from "pokenode-ts";

export default function PokemonSearch() {
    const [pokemonName, setPokemonName] = useState("");
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    const fetchPokemon = async() => {
        if (!pokemonName) {
            return;
        }
        const data = await getPokemon(pokemonName);
        setPokemon(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokémon Search</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Pokémon Name"
                value={pokemonName}
                onChangeText={setPokemonName}
            />
            <Button title="Search" onPress={fetchPokemon} />
            {pokemon && (
                <View style={styles.result}>
                    <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
                    {pokemon?.sprites?.front_default? (
                        <Image source={{uri: pokemon.sprites.front_default}} style={styles.image} />
                    ) : (
                        <Text style={styles.errorText}>No Image Available</Text>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#25292e", 
        padding: 20 
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: "#fff", 
        marginBottom: 20 
    },
    input: { 
        width: "80%", 
        padding: 10, 
        borderWidth: 1, 
        borderColor: "#555", 
        borderRadius: 8, 
        color: "#fff", 
        backgroundColor: "#333", 
        marginBottom: 10 
    },
    result: { 
        marginTop: 20, 
        alignItems: "center" 
    },
    name: { 
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#fff" 
    },
    image: { 
        width: 150, 
        height: 150, 
        marginTop: 10 
    },
    errorText: { 
        color: "#ff4444", 
        fontSize: 16, 
        marginTop: 10 
    }
});