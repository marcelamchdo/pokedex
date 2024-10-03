import { ref, Ref } from 'vue';

interface Pokemon {
    name: string
    url: string
    type: { name: string; colorName: string }[]
    color: string
    isFavorite: boolean
}


export function useUtils(pokemonList: Ref<Pokemon[]>) {
    const selectedPokemon = ref<Pokemon | null>(null);

    const getPokemonNumber = (url: string, id?: number): string => {
        const segments = url.split('/')
        const pokemonId = id || (url ? segments[segments.length - 2] : null)
        if (!pokemonId) return ''

        return String(pokemonId).padStart(3, '0')
    }

    const getPokemonImage = (url: string, id?: number): string => {
        const segments = url.split('/')
        const pokemonId = id || (url ? segments[segments.length - 2] : null)
        if (!pokemonId) return ''

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
        return imageUrl
    }
    
    //seleciona um pokemon e armazena o pokemon em selectedPokemon
    const selectPokemon = (pokemonName: string) => {
        selectedPokemon.value =
            pokemonList.value.find((p) => p.name === pokemonName) || null
    }

    return {
        getPokemonNumber,
        getPokemonImage,
        selectPokemon,
        selectedPokemon,
    }
}
