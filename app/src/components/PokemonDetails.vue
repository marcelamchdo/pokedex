<template>
    <v-container fluid v-if="pokemonDetails && pokemonDetails.name">
        <v-row
            justify="center"
            align="center"
            class="d-flex"
            style="min-height: 100vh"
        >
            <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center">
                <v-card>
                    <v-img :src="pokemonImage" alt="Pokemon" height:300px />

                    <v-card-title class="text-center">
                        {{ capitalize(pokemonDetails.name) }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <div v-if="pokemonDetails && pokemonDetails.stats && pokemonDetails.types">
        <h3>Estatísticas:</h3>
        <ul>
            <li v-for="stat in pokemonDetails.stats" :key="stat.name">
                {{ stat.name }}: {{ stat.base_stat }}
            </li>
        </ul>
    </div>

    <v-row
        justify="center"
        class="pokemon-types"
        v-if="pokemonDetails && pokemonDetails.stats && pokemonDetails.types"
    >
        <v-chip
            v-for="type in pokemonDetails.types"
            :key="type.name"
            class="pokemon-chip"
            :style="{ backgroundColor: type.colorName }"
        >
            {{ type.name }}
        </v-chip>
    </v-row>

    <h3 v-if="pokemonDetails.evolutions && pokemonDetails.evolutions.length">
        Evolutions
    </h3>
    <v-row v-if="pokemonDetails.evolutions && pokemonDetails.evolutions.length">
        <v-col
            v-for="evolution in pokemonDetails.evolutions"
            :key="evolution.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="d-flex justify-center"
        >
            <v-card>
                <v-img
                    :src="evolution.imageUrl"
                    alt="Evolução"
                    height="150px"
                    contain
                ></v-img>
                <v-card-title class="text-center">
                    {{ capitalize(evolution.name) }}
                </v-card-title>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi'

export default defineComponent({
    props: {
        pokemonName: {
            type: String,
            required: true,
            validator: (value: string) => !!value,
        },
        pokemonImage: { type: String, required: true },
    },

    setup(props) {
        const pokemonDetails = ref<any | null>(null)

        const capitalize = (str: string) => {
            if (!str) return ''
            return str.charAt(0).toUpperCase() + str.slice(1)
        }

        watch(
            () => props.pokemonName,
            async (newName) => {
                if (newName && newName.trim()) {
                    try {
                        const detailsData = await fetchPokemonDetails(newName)
                        pokemonDetails.value = detailsData
                    } catch (e) {
                        console.error('Erro ao buscar detalhes do Pokémon', e)
                    }
                }
            },
            { immediate: true }
        )

        return {
            pokemonDetails,
            capitalize,
        }
    },
})
</script>
