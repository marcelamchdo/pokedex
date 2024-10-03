import { ref } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi'

interface PokemonDetails {
    name: string
    stats: { name: string; base_stat: number }[]
    types: { name: string; colorName: string }[]
    evolutions: { name: string; imageUrl: string }[]
  }
export function usePokemonDetails() {
    const pokemonDetails = ref<PokemonDetails | null>(null)

  const getPokemonDetails = async (pokemonName: string) => {
    if (pokemonName && pokemonName.trim()) {
      try {
        const detailsData = await fetchPokemonDetails(pokemonName)

        if (detailsData) {
          pokemonDetails.value = {
            name: detailsData.name || '',
            stats: detailsData.stats || [],
            types: detailsData.types || [],
            evolutions: detailsData.evolutions || [], 
          }
        } else {
          pokemonDetails.value = {
            name: '',
            stats: [],
            types: [],
            evolutions: [],
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error)
      }
    }
  }

  return {
    pokemonDetails,
    getPokemonDetails,
  }
}
