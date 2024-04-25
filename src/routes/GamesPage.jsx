import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rating');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.rawg.io/api/games', {
          params: {
            key: apiKey,
            tags: 'co-op',
            search: searchTerm,
            ordering: sortOrder === 'rating' ? '-rating' : '-released',
            page_size: pageSize,
            page: currentPage
          }
        });
        setGames(response.data.results);
        setTotalGames(response.data.count);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchTerm, sortOrder, pageSize, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="gamesContainer">
      <h1 className="gamesTitle">All Co-Op Games</h1>
      <div className="totalGamesDisplay">Total Games: {totalGames}</div>
      <br></br>
      <div>
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="sortDropdown"
      >
        <option value="rating">Sort by Rating</option>
        <option value="released">Sort by Release Date</option>
      </select>
      <select
        value={pageSize}
        onChange={(e) => setPageSize(e.target.value)}
        className="pageSizeDropdown"
      >
        <option value="10">10 Games</option>
        <option value="20">20 Games</option>
        <option value="50">50 Games</option>
        <option value="100">100 Games</option>
      </select>
      </div>
      {loading ? (
        <h2>Loading...</h2>
      ) : games.length === 0 ? (
        <div>No games found. Please adjust your search or filter settings.</div>
      ) : (
        <>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage <= 1}>←</button>
            <span>Page {currentPage} of {Math.ceil(totalGames / pageSize)}</span>
            <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalGames / pageSize)}>→</button>
          </div>
          <ul className="gamesList">
  {games.map(game => (
    <li key={game.id} className="gameCard">
      <Link to={`/games/${game.slug}`} className="gameLink">
        <img src={game.background_image} alt={game.name} className="gameImage" />
        <h3 className = "gameTitle">{game.name}</h3>
        <div className="gameDetails">
          <div className="gameRating">Rating: {game.rating}</div>
          <div className="gameReleased">Released: {game.released || <span className="noReleaseDate">N/A</span>}</div>
        </div>
      </Link>
    </li>
  ))}
</ul>

          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage <= 1}>←</button>
            <span>Page {currentPage} of {Math.ceil(totalGames / pageSize)}</span>
            <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(totalGames / pageSize)}>→</button>
          </div>
        </>
      )}
    </div>
  );
};

export default GamesPage;
