'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import CharacterModal from './components/CharacterModal';

const fetchStarWarsPeople = async (page) => {
  const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
  return response.data;
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('homeworld');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);

  const { data: starWarsPeople, isLoading, isError } = useQuery(['starWarsPeople', currentPage], () =>
    fetchStarWarsPeople(currentPage)
  );

  const openCharacterModal = (character) => {
    setSelectedCharacter(character);
    fetchHomeworldInfo(character.homeworld);
  };

  const closeCharacterModal = () => {
    setSelectedCharacter(null);
    setHomeworld(null);
  };

  const fetchHomeworldInfo = async (homeworldUrl) => {
    try {
      const response = await axios.get(homeworldUrl);
      setHomeworld(response.data);
    } catch (error) {
      console.error('Error fetching homeworld information', error);
      setHomeworld(null);
    }
  };

  const filteredCharacters = starWarsPeople?.results
    ?.filter((character) => {
      const matchSearch = character.name.toLowerCase().includes(searchText.toLowerCase());
      const matchFilter =
        (filterOption === 'homeworld' && character.homeworld) ||
        (filterOption === 'film' && character.films.length > 0) ||
        (filterOption === 'species' && character.species.length > 0);

      return matchSearch && matchFilter;
    }) || [];

  const totalPages = Math.ceil(starWarsPeople?.count / 10) || 1;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (

    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Star Wars Characters:</h2>
      <div>
        <input
          type="text"
          placeholder="Search by character name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="homeworld">Homeworld</option>
          <option value="film">Film</option>
          <option value="species">Species</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="loader">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          </div>
        ) : isError ? (
          <p>Error loading data</p>
        ) : (
          filteredCharacters.map((character, index) => (
            <div
              key={character.name}
              className="bg-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-300"
              onClick={() => openCharacterModal(character)}
            >
              <Image
                src={`https://picsum.photos/200/200?random=${index}`}
                alt={character.name}
                width={200}
                height={200}
                className="rounded-full mb-2"
              />
              <p className="text-xl font-semibold">{character.name}</p>
              <p className="text-sm text-gray-600">Species: {character.species[0] || 'Unknown'}</p>
            </div>
          ))
        )}
      </div>
      {selectedCharacter && (
          <CharacterModal
          character={selectedCharacter}
          homeworld={homeworld}
          onClose={closeCharacterModal}
        />

)}

      <div className="pagination mt-4 bottom-0">
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => goToPage(i + 1)}
      className={`bg-blue-500 text-white font-semibold px-3 py-2 rounded-full hover:bg-blue-600 mx-2 ${i + 1 === currentPage ? 'bg-blue-600' : ''}`}
    >
      {i + 1}
    </button>
  ))}
</div>
    </div>
  );
}

