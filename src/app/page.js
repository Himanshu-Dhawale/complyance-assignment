'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchStarWarsPeople = async (page) => {
  const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
  return response.data;
};

const fetchRandomImages = async () => {
  const response = await axios.get('https://picsum.photos/v2/list?page=1&limit=10');
  return response.data;
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [starWarsPeople, setStarWarsPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: randomImages } = useQuery('randomImages', fetchRandomImages);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterOption, setFilterOption] = useState('homeworld');

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchStarWarsPeople(currentPage)
      .then((data) => {
        setStarWarsPeople(data.results);
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 characters per page.
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const openCharacterModal = (character) => {
    setSelectedCharacter(character);
  };

  const closeCharacterModal = () => {
    setSelectedCharacter(null);
  };

  const filteredCharacters = starWarsPeople.filter((character) => {
    const matchSearch = character.name.toLowerCase().includes(searchText.toLowerCase());
    const matchFilter = (filterOption === 'homeworld' && character.homeworld) ||
      (filterOption === 'film' && character.films.length > 0) ||
      (filterOption === 'species' && character.species.length > 0);

    return matchSearch && matchFilter;
  });

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
        {filteredCharacters.map((character, index) => (
          <div
            key={character.name}
            className="bg-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-300"
            onClick={() => openCharacterModal(character)}
          >
            <Image
              src={randomImages[index % randomImages.length]?.download_url}
              alt={character.name}
              width={200}
              height={200}
              className="rounded-full mb-2"
            />
            <p className="text-xl font-semibold">{character.name}</p>
            <p className="text-sm text-gray-600">Species: {character.species[0] || 'Unknown'}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`page-button ${i + 1 === currentPage ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

