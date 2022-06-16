import "./App.css";
import pokemonServices from "./Services/Pokedex/Pokedex.service";
import Pokedex from "./Components/Pokedex/Pokedex";
import Search from "./Components/Search/Search";
import Card from "./Components/Card/Card";
import PartyPokemon from "./Components/Party/PartyPokemon";
import Party from "./Components/Party/Party";

import { useState, useEffect } from "react";


function App() {
  const [pokemons, setPokemons] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState(null);
  const [party, setParty] = useState([]);
  const [offset, setOffset] = useState(0)

  useEffect(() =>{
    const fetchPokemons = async () => {
      try {
        const response = await pokemonServices.getAllPokemons(10, offset);
        setPokemons(response)
      }
      catch(error) {
        console.error(error)
      }
    }

    fetchPokemons();
  }, [offset]) 

  const onAddToPartyHandler = (id) =>{
    const pokemon = id ? pokemons.find(poke => poke.id === id) : searchPokemon;

    if (pokemon && party.length < 6) {
      setParty([
        ...party,
        {
          ...pokemon,
          partyId: `${pokemon.name}_${pokemon.id}_${new Date().getTime() / 1000}`,
        },
      ]);
    }
    console.log(party);
  }

  const onDeleteInPartyHandler = (partyId) => {
    const newParty = party.filter((poke) => poke.partyId !== partyId);
    setParty(newParty);
  };

  const onSearchHandler = async(name) => {
    try {
      const response = await pokemonServices.getPokemon(name)
      if(!response['succes']){
        throw new Error('Cannot find pokemon');
      }
      setSearchPokemon(response['pokemon']);
      console.log(searchPokemon);
    }
    catch (error){
      console.error({error})

    }
  }

  const PreviousPage = async() =>{
    try{
      if(offset == 0) throw new Error('you cannot regress more');

      setOffset(offset - 10);
    }
    catch (error) {
      console.error({error})
    }
  }
  const NextPage = async() =>{
    try{
      if(offset == 1110) throw new Error('you cannot advance more');

      setOffset(offset + 10);
    }
    catch (error) {
      console.error({error})
    }
  }

 // fetchPokemons();
    return (
    <div className="flex flex-col w-full min-h-fullscreen bg-gray-200">   
      <header className="flex justify-center items-center w-full h-16 sticky top-0 left-0 bg-red-600 z-10">
        <h1 className="text-white font-oswald">Pokedex National</h1>
      </header>
      <main className="p-8 flex flex-col justify-center gap-8">
      <Party party={party} onDeleteInParty={onDeleteInPartyHandler}/>
      
      <Search onSubmit={onSearchHandler}/>
      {searchPokemon && <div className="self-center"><Card pokemon={searchPokemon} onAdd= {() => {onAddToPartyHandler()}}/></div>}
      <Pokedex pokemons={pokemons} onAddToParty = {onAddToPartyHandler}/>
      </main> 
      <footer className="bg-blue-600 py-10 flex justify-center">
        <button className="bg-gray-500 mx-3 p-2 rounded-lg text-white shadow-lg" onClick={PreviousPage}>Previous</button>
        <button className="bg-gray-500 mx-3 py-2 px-5 rounded-lg text-white shadow-lg" onClick={NextPage} >Next</button>
      </footer>
      </div>
  );
}

export default App;
