import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { getPokemon } from "./api/pokeApi";
import { Pokemon } from "pokenode-ts";
import { executeSql, addFavouritePokemon } from "@/database/Database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PokemonSearch() {
    const [userId, setUserId] = useState<number | null>(null);
    const [pokemonName, setPokemonName] = useState("");
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [favouritedPokemon, setFavouritedPokemon] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserId(parsedUser.id);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchFavouritedPokemon();
        }
    }, [userId]);

    const fetchFavouritedPokemon = async () => {
        if (!userId) {
            return;
        }

        const savedPokemon: { pokemon_id: number } [] = await executeSql(
            "SELECT pokemon_id FROM user_likes WHERE user_id = ?;",
            [userId],
            "select"
        );

        if (savedPokemon.length === 0) { //for users with no saved Pokemon
            setFavouritedPokemon([]);
            return;
        }

        const pokemonDetails = (
            await Promise.all(
                savedPokemon.map(async (p) => {
                    try {
                        return await getPokemon(p.pokemon_id.toString());
                    } catch (error) {
                        console.error(`Error fetching Pokémon ID ${p.pokemon_id}:`, error);
                        return null;
                    }
                })
            )
        ).filter((p): p is Pokemon => p !== null);

        setFavouritedPokemon(pokemonDetails);
    };

    const fetchPokemon = async() => {
        if (!pokemonName) {
            return;
        }
        const data = await getPokemon(pokemonName);
        setPokemon(data);
    };

    const handleFavorite = async (pokemon: Pokemon) => {

        if (!userId) {
            return;
        }

        try{
            const alreadyFavourited = favouritedPokemon.some(p => p.id === pokemon.id);
            if (alreadyFavourited) {
                Alert.alert("Already Favourited");
                return;
            }
            
            await addFavouritePokemon(userId, pokemon.id);

            setFavouritedPokemon([...favouritedPokemon, pokemon]);
            Alert.alert("Added to favourites!");
        } catch (error) {
            console.error("Error favouriting", error);
            Alert.alert("Could not add Pokemon to favourites");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pokémon Search</Text>
            {selectedPokemon ? (
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{selectedPokemon.name.toUpperCase()}</Text>
                    {selectedPokemon.sprites.front_default ? (
                        <Image source={{ uri: selectedPokemon.sprites.front_default }} style={styles.image} />
                    ) : (
                        <Text style={styles.errorText}>No Image Available</Text>
                    )}

                    <Text style={styles.info}>Type: {selectedPokemon.types.map(t => t.type.name.toUpperCase()).join(", ")}</Text>
                    <Text style={styles.info}>Height: {selectedPokemon.height / 10}m</Text>
                    <Text style={styles.info}>Weight: {selectedPokemon.weight / 10}kg</Text>
                    <Text style={[styles.info, { textDecorationLine: "underline" }]}>Base Stats</Text>
                    {selectedPokemon.stats.map(stat => (
                        <Text key={stat.stat.name} style={styles.info}>{stat.stat.name.toUpperCase()}: {stat.base_stat}</Text>
                    ))}

                    <TouchableOpacity onPress={() => handleFavorite(selectedPokemon)} style={styles.saveButton}>
                        <Text style={styles.buttonText}>Add to Favorites</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedPokemon(null)} style={styles.backButton}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* List of Favorited Pokémon */}
                    <Text style={styles.subtitle}>Your Favourited Pokémon</Text>
                    <FlatList
                        data={favouritedPokemon}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={() => setSelectedPokemon(item)}>
                                {item.sprites.front_default ? (
                                    <Image source={{ uri: item.sprites.front_default }} style={styles.image} />
                                ) : (
                                    <Text style={styles.errorText}>No Image Available</Text>
                                )}
                                <Text style={styles.name}>{item.name.toUpperCase()}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Search & Add Pokémon */}
                    <Text style={styles.subtitle}>Search & Add Pokémon</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Pokémon Name"
                        placeholderTextColor="#bbb"
                        value={pokemonName}
                        onChangeText={setPokemonName}
                    />
                    <Button title="Search" onPress={fetchPokemon} />

                    {pokemon && (
                        <TouchableOpacity style={styles.card} onPress={() => setSelectedPokemon(pokemon)}>
                            <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
                            {pokemon.sprites.front_default ? (
                                <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
                            ) : (
                                <Text style={styles.errorText}>No Image Available</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#25292e", 
        padding: 20, 
        alignItems: "center",
        justifyContent: "center",
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: "#fff", 
        marginBottom: 20 
    },
    subtitle: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#ddd", 
        marginTop: 20 
    },
    name: { 
        fontSize: 10, 
        fontWeight: "bold", 
        color: "#fff" 
    },
    info: { 
        color: "#fff", 
        fontSize: 16, 
        marginVertical: 2 
    },
    errorText: { 
        color: "#ff4444", 
        fontSize: 16, 
        marginTop: 10 
    },
    buttonText: { 
        color: "#fff", 
        fontSize: 18, 
        textAlign: "center" 
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 10 
    },
    detailsContainer: { 
        backgroundColor: "#333", 
        padding: 20, 
        borderRadius: 10, 
        alignItems: "center", 
        position: "absolute", 
        top: "20%" 
    },
    saveButton: { 
        backgroundColor: "#4CAF50", 
        padding: 10, 
        borderRadius: 8, 
        marginTop: 10 
    },
    backButton: { 
        backgroundColor: "#ff4444", 
        padding: 10, 
        borderRadius: 8, 
        marginTop: 10 
    },
    card: { 
        backgroundColor: "#333", 
        padding: 20, 
        borderRadius: 10, 
        alignItems: "center",
        margin: 10, 
        width: 125 
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
    image: { 
        width: 100, 
        height: 100, 
        resizeMode: "contain", 
        marginVertical: 10 
    }
});