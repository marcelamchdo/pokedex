<template>
    <v-container>
        <h2>Pokémons Favoritos</h2>
        <v-row>
            <v-col
                v-for="pokemon in favoritePokemons"
                :key="pokemon.name"
                cols="12"
                sm="6"
                md="4"
            >
                <v-card
                    v-if="pokemon && pokemon.name"
                    class="pokemon-card"
                    @click="selectPokemon(pokemon.name)"
                >
                    <v-img
                        v-if="pokemon.url"
                        :src="getPokemonImage(pokemon.url)"
                        alt="Imagem do Pokémon"
                        height="150px"
                        contain
                    ></v-img>

                    <v-card-text>
                        <v-card-title>{{
                            capitalize(pokemon.name)
                        }}</v-card-title>
                        <v-row justify="start" class="pokemon-types">
                            <v-chip
                                v-for="type in pokemon.types"
                                :key="type"
                                class="mr-2"
                                outlined
                                color="primary"
                            >
                                {{ type }}
                            </v-chip>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const favoritePokemons = ref<any[]>([])
        const router = useRouter()

        const loadFavorites = () => {
            const storedFavorites = localStorage.getItem('pokemonFavorites')
            if (storedFavorites) {
                favoritePokemons.value = JSON.parse(storedFavorites)
            }
        }

        const capitalize = (str: string) => {
            if (!str) return ''
            return str.charAt(0).toUpperCase() + str.slice(1)
        }

        const getPokemonImage = (url: string) => {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
        }

        const selectPokemon = (pokemonName: string) => {
            router.push(`/pokemon/${pokemonName}`)
        }

        loadFavorites()

        return {
            favoritePokemons,
            capitalize,
            getPokemonImage,
            selectPokemon,
        }
    },
})
</script>
