<template>
    <v-container>
        <h2>Pokémons Favoritos</h2>
        <v-row v-if="favoritePokemons && favoritePokemons.length > 0">
            <v-col
                v-for="pokemon in favoritePokemons"
                :key="pokemon.name"
                cols="12"
                sm="6"
                md="4"
            >
                <v-card
                v-if="pokemon && pokemon.name && pokemon.url"
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
                        <v-row v-if="pokemon.types && pokemon.types.length > 0" justify="start" class="pokemon-types">
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
        <p v-else>Nenhum Pokémon favorito encontrado.</p>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Pokemon {
    name: string
    url?: string
    types?: string[]
}

export default defineComponent({
    props: {
        favoritePokemons: {
            type: Array as () => Pokemon[],
            required: true,
        },
        toggleFavorite: {
            type: Function,
            required: true,
        },
    },

    setup() {
        const router = useRouter()

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

        return {
            capitalize,
            getPokemonImage,
            selectPokemon,
        }
    },
})
</script>
