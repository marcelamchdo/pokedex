<template>
    <v-container class="cards-list" fluid>
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
                    :pokemonNumber="getPokemonNumber(pokemon.url, pokemon.id)"
                    :pokemonImage="getPokemonImage(pokemon.url, pokemon.id)"
                    :selectPokemon="() => selectPokemon(pokemon.name)"
                />
            </v-col>
        </v-row>

        <v-btn v-if="!isLoading" @click="loadMore" class="btn-loadmore">
            Load More
        </v-btn>
        <p v-if="isLoading">Carregando...</p>

        <PokemonDetails
            v-if="selectedPokemon"
            :dialog="dialog"
            :pokemonName="selectedPokemon.name"
            :pokemonImage="getPokemonImage(selectPokemonUrl)"
            v-model="dialog"
            @update:dialog="dialog = $event"
        />
    </v-container>
</template>

<script lang="ts">
import PokemonCard from './PokemonCard.vue'
import PokemonDetails from './PokemonDetails.vue'
import '../styles/index.css'
import { ref, watch } from 'vue'
import { useUtils } from '../composables/useUtils'
import { useFavorites } from '../composables/useFavorites'

interface Pokemon {
    name: string
    url: string
    id?: number | null
    type: { name: string; colorName: string }[]
    color: string
    isFavorite: boolean
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
    setup(props) {
        const pokemonListRef = ref<Pokemon[]>([])
        const favoritePokemonsRef = ref<Pokemon[]>(props.favoritePokemons)
        const { selectedPokemon } = useUtils(pokemonListRef)
        const { isFavorite } = useFavorites(favoritePokemonsRef, pokemonListRef)
        const selectPokemonUrl = ref<string>('')
        const dialog = ref<boolean>(false)

        watch(
            () => props.pokemonList,
            (newPokemonList) => {
                pokemonListRef.value = newPokemonList
            },
            { immediate: true }
        )

        const handleSelectPokemon = (pokemonName: string) => {
            const pokemon = pokemonListRef.value.find(
                (p) => p.name.toLowerCase() === pokemonName.toLowerCase()
            )
            if (pokemon) {
                selectedPokemon.value = pokemon
                selectPokemonUrl.value = pokemon.url
                dialog.value = true
            } else {
                console.log('Pokemon não encontrado:', pokemonName)
            }
        }

        return {
            pokemonListRef,
            favoritePokemonsRef,
            selectedPokemon,
            selectPokemonUrl,
            selectPokemon: handleSelectPokemon,
            isFavorite,
            dialog,
            ...props,
        }
    },
}
</script>
