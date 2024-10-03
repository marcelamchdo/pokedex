<template>
    <v-container fluid>
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
                <FavoriteCard
                    :pokemon="pokemon"
                    :isFavorite="true"
                    :toggleFavorite="toggleFavorite"
                    :pokemonNumber="getPokemonNumber(pokemon.url)"
                    :pokemonImage="getPokemonImage(pokemon.url)"
                    :selectPokemon="selectPokemon"
                />
            </v-col>
        </v-row>

        <p v-if="filteredFavorites.length === 0">
            Você não tem Pokémons favoritos.
        </p>
    </v-container>
</template>

<script lang="ts">
import '../styles/index.css'
import FavoriteCard from './FavoriteCard.vue'
import { useFavorites } from '../composables/useFavorites'
import { useUtils } from '../composables/useUtils.ts'

import { ref } from 'vue'

interface Pokemon {
    name: string
    url: string
    type: { name: string; colorName: string }[]
    color: string
    isFavorite: boolean
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
    setup(props) {
        const favoritePokemonsRef = ref(props.favoritePokemons);
        const pokemonListRef = ref(props.pokemonList);

        const { selectedPokemon, selectPokemon } = useUtils(pokemonListRef);

        const { filteredFavorites, toggleFavorite } =
            useFavorites(favoritePokemonsRef, pokemonListRef)

        return {
            filteredFavorites,
            toggleFavorite,
            selectPokemon,
            selectedPokemon,
        }
    },
}
</script>
