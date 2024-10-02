import { Ref } from 'vue';

export function useUtils() {
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

    const selectPokemon = (
        pokemonName: string,
        selectedPokemon: Ref<string>
    ) => {
        selectedPokemon.value = pokemonName
    }

    return {
        getPokemonNumber,
        getPokemonImage,
        selectPokemon,
    }
}
