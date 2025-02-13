import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getPokemon } from "./api/pokeApi";
import { Pokemon } from "pokenode-ts";
import { Dimensions } from "react-native";
import Song from "./song";

const screenWidth = Dimensions.get("window").width;
const baseColumns = 2;
const numColumns = screenWidth > 600 ? 5 : baseColumns;
const itemSize = screenWidth / numColumns - 20; 


export default function Pokedex() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const fetchedPokemon = await Promise.all(
                    Array.from({length: 151}, (_, i) => getPokemon((i + 1).toString()))
                );
                setPokemonList(fetchedPokemon.filter((p): p is Pokemon => p !== null));
            } catch (error) {
                console.error("Error fetching Pokemon: ", error);
            }
        };
        fetchPokemonList();
    }, []);


    return (
        <View style={styles.container}>
            <Song />
            <Text style={styles.title}>P
                <Image
                    source={require("@/assets/images/pokeball.png")}
                    style={styles.pokeball}
                />
                kédex</Text>
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
                    <Text style={[styles.info, {textDecorationLine: "underline"}]}>Base Stats</Text>
                    {selectedPokemon.stats.map(stat => (
                        <Text key={stat.stat.name} style={styles.info}>{stat.stat.name.toUpperCase()}: {stat.base_stat}</Text>
                    ))}
                    <TouchableOpacity onPress={() => setSelectedPokemon(null)}>
                        <Text style={styles.backButton}>Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={pokemonList}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={numColumns}
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
            )}
        </View>

        
        
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: "#25292e", 
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 75
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginBottom: 10
    },
    title: { 
        textAlign: "center",
        fontSize: 28, 
        fontWeight: "bold", 
        color: "#fff", 
        marginBottom: 20 
    },
    card: { 
        width: itemSize,
        aspectRatio: 1,
        backgroundColor: "#333", 
        padding: 10, 
        borderRadius: 10, 
        alignItems: "center",
        justifyContent: "center", 
        margin: 5 
    },
    image: { 
        width: 100, 
        height: 100,
        resizeMode: "contain",
        marginVertical: 10,
        overflow: "visible"
    },
    name: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#fff", 
        marginTop: 5 
    },
    detailsContainer: { 
        backgroundColor: "#333", 
        padding: 20, 
        borderRadius: 10, 
        alignItems: "center", 
        position: "absolute", 
        top: "23%",
    },
    info: { 
        color: "#fff", 
        fontSize: 16, 
        marginVertical: 2 
    },
    backButton: { 
        color: "#ff4444", 
        fontSize: 18, 
        marginTop: 10 
    },
    errorText: { 
        color: "#ff4444", 
        fontSize: 16, 
        marginTop: 10 
    },
    pokeball: {     
        resizeMode:"contain",
        width: 18,
        height: 18,
    }
});