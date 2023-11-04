import React from 'react';

const CharacterModal = ({ character, homeworld, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-white p-4 rounded-lg w-1/2">
        <h3 className="text-2xl font-bold">{character.name}</h3>
        <p>Height: {character.height} meters</p>
        <p>Mass: {character.mass} kg</p>
        <p>Added to API: {new Date(character.created).toLocaleDateString('en-GB')}</p>
        <p>Films: {character.films.length}</p>
        <p>Birth Year: {character.birth_year}</p>

        <h4>Homeworld:</h4>
        {homeworld ? (
          <>
            <p>Name: {homeworld.name}</p>
            <p>Terrain: {homeworld.terrain}</p>
            <p>Climate: {homeworld.climate}</p>
            <p>Residents: {homeworld.residents.length}</p>
          </>
        ) : (
          <p>Loading homeworld information...</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white font-semibold px-3 py-2 rounded-full hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CharacterModal;
