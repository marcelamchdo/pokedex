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
                <v-card
                    class="pokemon-card"
                    @click="selectPokemon(pokemon.name)"
                    :style="{
                        position: 'relative',
                        minHeight: '300px',
                        maxWidth: '300px',
                        margin: 'auto',
                    }"
                >
                    <v-icon
                        class="icon-favorite"
                        @click.stop="toggleFavorite(pokemon.name)"
                        :size="32"
                        :style="{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            color: isFavorite(pokemon.name) ? 'red' : 'grey',
                            zIndex: 2,
                            cursor: 'pointer',
                        }"
                    >
                        {{
                            isFavorite(pokemon.name)
                                ? 'mdi-heart'
                                : 'mdi-heart-outline'
                        }}
                    </v-icon>

                    <div
                        class="pokemon-number-badge"
                        style="
                            position: absolute;
                            top: 16px;
                            left: 16px;
                            font-size: 14px;
                            z-index: 1;
                        "
                    >
                        #{{ getPokemonNumber(pokemon.url) }}
                    </div>

                    <div class="pokemon-image-container" style="margin: 32px 0">
                        <v-img
                            :src="getPokemonImage(pokemon.url)"
                            alt="Imagem do Pokémon"
                            height="150px"
                            contain
                        ></v-img>
                    </div>

                    <div
                        class="pokemon-info-container"
                        style="padding-top: 16px"
                    >
                        <v-card-text>
                            <v-card-title
                                class="pokemon-title"
                                style="text-align: center"
                            >
                                {{ capitalize(pokemon.name) }}
                            </v-card-title>

                            <v-row justify="center" class="pokemon-types">
                                <v-chip
                                    v-for="type in pokemon.types"
                                    :key="type"
                                    class=""
                                >
                                    {{ type }}
                                </v-chip>
                            </v-row>
                        </v-card-text>
                    </div>
                </v-card>
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
import PokemonDetails from './PokemonDetails.vue'
import pokedexImage from '../assets/Pokedex.png'
import '../styles/index.css'

export default {
    components: {
        PokemonDetails,
    },
    props: {
        pokemonList: {
            type: Array,
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
            selectedPokemon: null,
            offset: 0,
        }
    },
    methods: {
        selectPokemon(pokemonName) {
            this.selectedPokemon = pokemonName
            console.log('Pokémon selecionado:', pokemonName)
        },
        isFavorite(pokemonName) {
            return this.favoritePokemons.includes(pokemonName)
        },
        getPokemonNumber(url) {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `${pokemonId.padStart(3, '0')}`
        },
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        getPokemonImage(url) {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
        },
    },
}
</script>
