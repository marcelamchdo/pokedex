<template>
<<<<<<< HEAD
    <v-container fluid>
        <v-img :src="pokedexImage" class="pokedex-image"></v-img>

        <v-row
            justify="center"
            align="center"
            class="d-flex"
            style="min-height: 100vh"
        >
=======
    <v-container>
        <v-img :src="pokedexImage" class="pokedex-image"></v-img>

        <v-row>
>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
            <v-col
                v-for="pokemon in pokemonList"
                :key="pokemon.name"
                cols="12"
                sm="6"
                md="4"
<<<<<<< HEAD
                lg="3"
                class="d-flex justify-center"
            >
                <PokemonCard
                    :pokemon="pokemon"
                    :isFavorite="isFavorite(pokemon.name)"
                    :toggleFavorite="toggleFavorite"
                    :pokemonNumber="getPokemonNumber(pokemon.url)"
                    :pokemonImage="getPokemonImage(pokemon.url)"
                    :selectPokemon="() => selectPokemon(pokemon.name, pokemon.url)"
                />
            </v-col>
        </v-row>

=======
            >
                <v-card
                    class="pokemon-card"
                    @click="selectPokemon(pokemon.name)"
                >
                    <div class="pokemon-number-badge">
                        {{ getPokemonNumber(pokemon.url) }}
                    </div>
                    <div class="pokemon-image-container">
                        <v-img
                            :src="getPokemonImage(pokemon.url)"
                            alt="Imagem do Pokémon"
                            height="200px"
                            contain
                        ></v-img>
                    </div>

                    <div class="pokemon-info-container">
                        <v-card-text>
                            <v-row align="center" justify="space-between">
                                <v-col cols="8">
                                    <v-card-title class="pokemon-title">
                                        {{ capitalize(pokemon.name) }}
                                    </v-card-title>
                                </v-col>
                            </v-row>

                            <v-row justify="start" class="pokemon-types">
                                <v-chip
                                    v-for="type in pokemon.types"
                                    :key="type"
                                    class="mr-2 pokemon-chip"
                                    outlined
                                    :style="{
                                        backgroundColor:
                                            pokemon.color || '#ffffff',
                                        color:
                                            pokemon.color === 'white' ||
                                            pokemon.color === '#FFFFFF' ||
                                            pokemon.color === 'yellow' ||
                                            pokemon.color === '#FFFF00'
                                                ? 'black'
                                                : 'white',
                                        filter: 'brightness(1) saturate(0.5)'
                                    }"
                                >
                                    {{ type }}
                                </v-chip>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-card>
            </v-col>
        </v-row>

>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
        <v-btn v-if="!isLoading" @click="loadMore" color="primary">
            Carregar Mais
        </v-btn>
        <p v-if="isLoading">Carregando...</p>

<<<<<<< HEAD
        <PokemonDetails 
        v-if="selectedPokemon" 
        :pokemonName="selectedPokemon" 
        :pokemonImage="getPokemonImage(selectPokemonUrl)"/>
=======
        <PokemonDetails v-if="selectedPokemon" :pokemonName="selectedPokemon" />
>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
    </v-container>
</template>

<script lang="ts">
<<<<<<< HEAD
import PokemonCard from './PokemonCard.vue'
import PokemonDetails from './PokemonDetails.vue'
import pokedexImage from '../assets/Pokedex.png'
import '../styles/index.css'

interface Pokemon {
    name: string;
    url: string;
    type: { name: string; colorName: string }[]; 
    color: string;
}

export default {
    components: {
        PokemonCard,
        PokemonDetails,
    },
    props: {
        pokemonList: {
            type: Array as () => Pokemon[],
            required: true,
        },
        favoritePokemons: {
            type: Array as () => Pokemon[],
            required: true,
        },
        toggleFavorite: {
            type: Function,
            required: true,
        },
        isLoading: {
            type: Boolean,
            required: true,
        },
        loadMore: {
            type: Function,
            required: true,
        },
        getPokemonNumber: {
            type: Function,
            required: true,
        },
        getPokemonImage: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            pokedexImage,
            selectedPokemon: '',
            selectPokemonUrl: '',
        }
    },
    methods: {
        selectPokemon(pokemonName: string, pokemonUrl: string) {
            this.selectedPokemon = pokemonName
            this.selectPokemonUrl = pokemonUrl
        },
        isFavorite(pokemonName: string) {
            return this.favoritePokemons.some((fav) => fav.name === pokemonName)
        },
    }
}
=======
import { defineComponent, ref } from 'vue';
import {
    fetchPokemonList,
    fetchPokemonDetails,
    fetchPokemonSpecies,
} from '../services/pokeApi';
import PokemonDetails from './PokemonDetails.vue';
import '../styles/pokemonList.css'; // Importa o CSS separado
import pokedexImage from '../assets/Pokedex.png';

export default defineComponent({
    components: {
        PokemonDetails,
    },
    setup() {
        const pokemonList = ref<any[]>([]);
        const offset = ref(0);
        const isLoading = ref(false);
        const selectedPokemon = ref<string | null>(null);
        const favorites = ref<string[]>([]);

        const capitalize = (str: string) => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        const loadMore = async () => {
            isLoading.value = true;
            try {
                const listData = await fetchPokemonList(offset.value, 20);
                const pokemonListResults = listData.results;

                const pokemonDetails = pokemonListResults.map(
                    async (pokemon: any) => {
                        const details = await fetchPokemonDetails(pokemon.name);
                        const speciesData = await fetchPokemonSpecies(
                            pokemon.name,
                        );
                        return {
                            ...pokemon,
                            types: details.types.map((t: any) => t.type.name),
                            color: speciesData.color.name,
                        };
                    },
                );

                const pokemonWithDetails = await Promise.all(pokemonDetails);
                pokemonList.value = [
                    ...pokemonList.value,
                    ...pokemonWithDetails,
                ];
                offset.value += 20;
            } catch (error) {
                console.error('Erro ao carregar mais Pokémon', error);
            } finally {
                isLoading.value = false;
            }
        };

        const selectPokemon = (pokemonName: string) => {
            selectedPokemon.value = pokemonName;
        };

        const getPokemonNumberForImage = (url: string) => {
            const segments = url.split('/');
            return segments[segments.length - 2];
        };

        const getPokemonImage = (url: string) => {
            const pokemonId = getPokemonNumberForImage(url);
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        };

        const getPokemonNumber = (url: string) => {
            const segments = url.split('/');
            const number = segments[segments.length - 2];
            return `#${number.padStart(3, '0')}`;
        };

        loadFavorites();
        loadMore();

        return {
            pokemonList,
            loadMore,
            isLoading,
            selectedPokemon,
            selectPokemon,
            getPokemonNumber,
            getPokemonImage,
            capitalize,
            pokedexImage,
            getPokemonNumberForImage,
        };
    },
});
>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
</script>
