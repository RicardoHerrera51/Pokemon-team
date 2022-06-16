const BASE_URL = "https://pokeapi.co/api/v2/";

const fetchAllPokemons = async (limit, offset) => {
    const response = await fetch(`${BASE_URL}pokemon?limit=${ limit }&offset=${offset}`);
    const pokemonsResponse = await response.json();

    const pokemonsURLs = pokemonsResponse.results.map(
        pokemon=> pokemon.url
    )
    return pokemonsURLs;
}

const fetchUrlPokemons = async (pokemonsUrl) => {
    const pokemonsPromises = pokemonsUrl.map(
        url => fetch(url)
    )

    const results = await Promise.all(pokemonsPromises);


    const resultsJSON = results.map(
        result => result.json()
    )

    const pokemons = await Promise.all(resultsJSON);

    return pokemons;
}

const transformPokemonData =(pokemonData) => {
    if(!pokemonData) return null;

    return{
        id: pokemonData.id,
        name: pokemonData.name,
        thumbnail: pokemonData.sprites.front_default,
        abilities: pokemonData.abilities.map(
            ability => ability.ability.name
        ),
        types: pokemonData.types.map(
            type => type.type.name
        )
    }
}

const pokemonServices = {
    getAllPokemons: async (limit, offset) =>{
        try {
            const urls = await fetchAllPokemons(limit, offset)
            const pokemons = await fetchUrlPokemons(urls)
    
            const mappedPokemons = pokemons.map(
                pokemon=> transformPokemonData(pokemon)
        )
        console.log(mappedPokemons)
    
        return mappedPokemons
        }
        catch(error) {
            console.error(error)
            return []
        }
    },
    getPokemon: async (name ="") => {
        try {
            const response = await fetch(`${BASE_URL}pokemon/${name}`)
            const data = await response.json();
            if(!data) throw new Error('Pokemon not found');

            const transformPokemon = transformPokemonData(data);

            return {
                succes: true,
                pokemon: transformPokemon
            }

        }
        catch (error){
            console.error({error})
            return{
                success: false,
                pokemon: null
            }
        }
    }
}



export default pokemonServices;