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
                v-for="pokemon in filteredFavorites"
                :key="pokemon.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="d-flex justify-center"
            >
            {{ console.log('Rendering Pokémon:', pokemon) }}
                <FavoriteCard
                    :pokemon="pokemon"
                    :isFavorite="true"
                    :toggleFavorite="toggleFavorite"
                    :pokemonNumber="getPokemonNumber(pokemon.url)"
                    :pokemonImage="getPokemonImage(pokemon.url)"
                    :selectPokemon="selectPokemon"
                />
                {{ console.log('Rendering Pokemon:', pokemon) }} 
            </v-col>
        </v-row>

        <p v-if="filteredFavorites.length === 0">
            Você não tem Pokémons favoritos.
        </p>

    </v-container>
</template>

<script lang="ts">
import pokedexImage from '../assets/Pokedex.png'
import '../styles/index.css'
import FavoriteCard from './FavoriteCard.vue'

interface Pokemon {
    name: string
    url: string
    types: { type: { name: string; url: string }; color: string }[]
    color: string
    isFavorite: boolean;
}

export default {
    components: {
        FavoriteCard,
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
    computed: {
        filteredFavorites() {
            const filtered = this.favoritePokemons.filter(p => p.isFavorite);
            return filtered;
        }
    },
    data() {
        return {
            pokedexImage,
            selectedPokemon: '',
        }
    },
    methods: {
        selectPokemon(pokemonName: string) {
            this.selectedPokemon = pokemonName
        },
        isFavorite(pokemonName: string) {
            return this.favoritePokemons.some((fav) => fav.name === pokemonName)
        },
    }
}
</script>
