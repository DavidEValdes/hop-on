import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: apiKey,
            dates: '2020-01-01,2021-12-31',
            ordering: '-added',
            page_size: 10
          }
        });
        setGames(response.data.results);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2> 
      </div>
    );
  }

  return (
    <div>
      <h1>Popular Games</h1>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            <h3>{game.name}</h3>
            <img src={game.background_image} alt={game.name} style={{ width: '200px' }} />
            <p>Rating: {game.rating} / Released: {game.released}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamesPage;
