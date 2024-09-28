<template>
    <div v-if="pokemonDetails">
        <h2>Detalhes do Pokémon: {{ pokemonDetails.name }}</h2>
        <p><strong>Altura:</strong> {{ pokemonDetails.height }}</p>
        <p><strong>Peso:</strong> {{ pokemonDetails.weight }}</p>
        <h3>Estatísticas:</h3>
        <ul>
            <li v-for="stat in pokemonDetails.stats" :key="stat.stat.name">
                {{ stat.stat.name }}: {{ stat.base_stat }}
            </li>
        </ul>
        <h3>Tipos:</h3>
        <ul>
            <li v-for="type in pokemonDetails.types" :key="type.type.name">
                {{ type.type.name }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi'

export default defineComponent({
    props: {
        pokemonName: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const pokemonDetails = ref<any | null>(null)

        watch(
            () => props.pokemonName,
            async (newName) => {
                if (newName) {
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
        }
    },
})
</script>
