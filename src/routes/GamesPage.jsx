import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
      const immediate = !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          timeout = null;
      }, wait);
      if (immediate) {
          func.apply(this, args);
      }
  };
};
const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  const fetchGames = useCallback(debounce(() => {
    setLoading(true);
    const params = {
      key: apiKey,
      search: searchTerm,
      ordering: sortOrder,
      page_size: pageSize,
      page: currentPage
    };
    axios.get('https://api.rawg.io/api/games', { params })
      .then(response => {
        if (response.data && response.data.results.length > 0) {
          setGames(response.data.results);
          setTotalGames(response.data.count);
        } else {
          setGames([]); // Handle no results case
          setTotalGames(0);
        }
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        setGames([]); // Ensure clearing games on error
        setTotalGames(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 300), [searchTerm, sortOrder, pageSize, currentPage]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="gamesContainer">
      <h1>Browse All Games</h1>
      <div>Total Games: {totalGames.toLocaleString()}</div>
      <div>
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="searchInput"
      />
      <select
        value={sortOrder}
        onChange={handleSortChange}
        className="pageSizeDropdown"
      >
        <option value="">Popular Games</option>
        <option value="-rating">Sort by Rating</option>
        <option value="-released">Sort by Release Date</option>
      </select>
      <select
        value={pageSize}
        onChange={handlePageSizeChange}
        className="pageSizeDropdown"
      >
        <option value="10">10 Games</option>
        <option value="20">20 Games</option>
        <option value="40">40 Games</option>
        
      </select>
      </div>
      <span>
  <button 
    onClick={() => setCurrentPage(p => p > 1 ? p - 1 : 1)}
    className="button-white-text"
    style={{
      backgroundColor: 'var(--background-color)',
      border: 'none',
      
      
    }}
  >
    ←
  </button>
  <span>Page {currentPage} of {Math.ceil(totalGames / pageSize).toLocaleString()}</span>
  <button 
    onClick={() => setCurrentPage(p => p < Math.ceil(totalGames / pageSize) ? p + 1 : p)}
    className="button-white-text"
    style={{
      backgroundColor: 'var(--background-color)',
      border: 'none',
     
    
    }}
    
  >
    →
  </button>
</span>
      {loading ? (
        <h2>Loading...</h2>
      ) : games.length === 0 ? (
        <div>No games found, please try again or refresh the page.</div>
        
      ) : (
        <>
          <ul className="gamesList">
            {games.map(game => (
              <li key={game.id} className="gameCard">
                <Link to={`/games/${game.slug}`} className="gameLink">
                  <img src={game.background_image} alt={game.name} className="gameImage" />
                  <h3>{game.name}</h3>
                  <div className="gameDetails">
                    <div className="gameRating">Rating: {game.rating || 'N/A'}</div>
                    <div className="gameReleased">Released: {game.released || 'N/A'}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <span>
  <button 
    onClick={() => setCurrentPage(p => p > 1 ? p - 1 : 1)}
    className="button-white-text"
    style={{
      backgroundColor: 'var(--background-color)',
    
      border: 'none',
      
      
    }}

   
  >
    ←
  </button>
  <span>Page {currentPage} of {Math.ceil(totalGames / pageSize).toLocaleString()}</span>
  <button 
    onClick={() => setCurrentPage(p => p < Math.ceil(totalGames / pageSize) ? p + 1 : p)}
    className="button-white-text"
    style={{
      backgroundColor: 'var(--background-color)',
      
      border: 'none',
   
      
    }}
    
  >
    →
  </button>
</span>

        </>
      )}
    </div>
  );
};

export default GamesPage;
