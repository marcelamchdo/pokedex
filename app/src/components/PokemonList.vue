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
                    :selectPokemon="() => selectPokemon(pokemon.name, pokemon.url)"
                />
            </v-col>
        </v-row>

        <v-btn v-if="!isLoading" @click="loadMore" color="primary">
            Carregar Mais
        </v-btn>
        <p v-if="isLoading">Carregando...</p>

        <PokemonDetails 
        v-if="selectedPokemon" 
        :pokemonName="selectedPokemon" 
        :pokemonImage="getPokemonImage(selectPokemonUrl)"/>
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
</script>
