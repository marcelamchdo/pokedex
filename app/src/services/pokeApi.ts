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
        const response = await api.get(`/pokemon/${pokemonNameOrId}`);
    
        const speciesResponse = await fetchPokemonSpecies(pokemonNameOrId);
        const pokemonColor = speciesResponse.color.name; 

        const types = response.data.types.map((typeInfo: { type: { name: string } }) => ({
          name: typeInfo.type.name,
          colorName: pokemonColor,
        }));

        const stats = response.data.stats.map((statInfo: {
            stat: { name: string }, base_stat: number }) => ({
            name: statInfo.stat.name,
            base_stat: statInfo.base_stat,
            }))
    
        return {
          name: response.data.name,
          url: response.data.url,
          types,
          stats,
          color: pokemonColor, 
        };
    } catch (error) {
        handleApiError(error);
    }
}

export const fetchPokemonSpecies = async (pokemonNameOrId: string | number) => {
    try {
        const response = await api.get(`/pokemon-species/${pokemonNameOrId}`)
        return response.data
    } catch (error) {
        handleApiError(error);
    }
}
