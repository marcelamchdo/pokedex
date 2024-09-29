<template>
    <v-container fluid>
        <v-img :src="pokedexImage" class="pokedex-image"></v-img>

        <v-row
            justify="center"
            align="center"
            class="d-flex"
            style="min-height: 100vh"
        >
            <v-col
                v-if="pokemonList.length"
                v-for="pokemon in pokemonList"
                :key="pokemon.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="d-flex justify-center"
            >
                <PokemonCard
                    :pokemon="pokemon"
                    :isFavorite="isFavorite(pokemon.name)"
                    :toggleFavorite="toggleFavorite"
                    :pokemonNumber="getPokemonNumber(pokemon.url)"
                    :pokemonImage="getPokemonImage(pokemon.url)"
                    @select="selectPokemon"
                />
            </v-col>
        </v-row>

        <v-btn v-if="!isLoading" @click="loadMore" color="primary">
            Carregar Mais
        </v-btn>
        <p v-if="isLoading">Carregando...</p>

        <PokemonDetails v-if="selectedPokemon" :pokemonName="selectedPokemon" />
    </v-container>
</template>

<script lang="ts">
import PokemonCard from './PokemonCard.vue'
import PokemonDetails from './PokemonDetails.vue'
import pokedexImage from '../assets/Pokedex.png'
import '../styles/index.css'

interface Pokemon {
    name: string;
    url: string;
    types: string[];
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
            type: Array,
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
    },
    data() {
        return {
            pokedexImage,
            selectedPokemon: '',
        }
    },
    methods: {
        selectPokemon(pokemonName: string) {
            this.selectedPokemon = pokemonName;
        },
        isFavorite(pokemonName: string) {
            return this.favoritePokemons.includes(pokemonName)
        },
        getPokemonNumber(url: string) {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `${pokemonId.padStart(3, '0')}`
        },
        getPokemonImage(url: string) {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
        },
    },
}
</script>
