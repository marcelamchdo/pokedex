import axios from 'axios'

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 10000,
})

const handleApiError = (error: any) => {
    console.error('Erro ao fazer a requisição à API:', error)
    throw error
}

export const fetchPokemonList = async (
    offset: number = 0,
    limit: number = 20
) => {
    try {
        const response = await api.get(
            `/pokemon?offset=${offset}&limit=${limit}`
        )
        return response.data
    } catch (error) {
        handleApiError(error)
    }
}

export const fetchPokemonDetails = async (pokemonNameOrId: string | number) => {
    try {
        //detalhes pokemon
        const response = await api.get(`/pokemon/${pokemonNameOrId}`)

        //especies pokemon
        const speciesResponse = await fetchPokemonSpecies(pokemonNameOrId)
        if (!speciesResponse || !speciesResponse.evolution_chain) {
            throw new Error(
                'Espécie do Pokémon ou cadeia de evolução não encontrada.'
            )
        }

        const pokemonColor = speciesResponse.color.name

        const types = response.data.types.map(
            (typeInfo: { type: { name: string } }) => ({
                name: typeInfo.type.name,
                colorName: pokemonColor,
            })
        )

        const pokemonId = response.data.id
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

        //cadeia de evolução
        const evolutionChainId = speciesResponse.evolution_chain.url
            .split('/')
            .slice(-2, -1)[0]
        const evolutionChain =
            (await fetchPokemonEvolutions(evolutionChainId)) || []

        const stats = response.data.stats.map(
            (statInfo: { stat: { name: string }; base_stat: number }) => ({
                name: statInfo.stat.name,
                base_stat: statInfo.base_stat,
            })
        )

        return {
            id: pokemonId,
            imageUrl,
            name: response.data.name,
            url: response.data.url,
            types,
            stats,
            color: pokemonColor,
            evolutions: evolutionChain || [],
        }
    } catch (error) {
        handleApiError(error)
    }
}

export const fetchPokemonSpecies = async (pokemonNameOrId: string | number) => {
    try {
        const response = await api.get(`/pokemon-species/${pokemonNameOrId}`)
        return response.data
    } catch (error) {
        handleApiError(error)
    }
}

export const fetchPokemonEvolutions = async (evolutionChainId: number) => {
    try {
        const response = await api.get(`/evolution-chain/${evolutionChainId}`)
        const evolutions = response.data.chain

        const evolutionChain = []
        let current = evolutions

        while (current) {
            const pokemonId = current.species.url.split('/').slice(-2, -1)[0]
            evolutionChain.push({
                name: current.species.name,
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
            })
            current = current.evolves_to[0]
        }
        return evolutionChain
    } catch (e) {
        handleApiError(e)
        return []
    }
}

export const fetchAllPokemon = async () => {
    try {
        const response = await api.get(`/pokemon?limit=10000`)
        return response.data.results
    } catch (error) {
        console.error('Erro ao buscar a lista completa de Pokémon:', error)
        return []
    }
}
