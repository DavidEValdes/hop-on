import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GameDetailPage = () => {
    const { gameSlug } = useParams();
    const [game, setGame] = useState(null);
    const apiKey = import.meta.env.VITE_RAWG_API_KEY;

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`https://api.rawg.io/api/games/${gameSlug}`, {
                    params: {
                        key: apiKey,
                    }
                });
                setGame(response.data);
            } catch (error) {
                console.error('Error fetching game details:', error);
            }
        };

        fetchGameDetails();
    }, [gameSlug]);

    if (!game) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="game-detail-container">
            <h1 className="game-title">{game.name}</h1>
            <div className="game-image-container">
                <img src={game.background_image} alt={game.name} className="game-image"/>
            </div>
            <div className="game-info">
                <p><strong>Released:</strong> {game.released || 'N/A'}</p>
                <p><strong>Rating:</strong> {game.rating ? `${game.rating} /5` : 'N/A'}</p>
                <p><strong>Metacritic:</strong> {game.metacritic || 'N/A'}</p>
                <p><strong>Platforms:</strong> {game.platforms.map(platform => platform.platform.name).join(', ')}</p>
                <p><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(', ')}</p>
                <p><strong>Publishers:</strong> {game.publishers.map(publisher => publisher.name).join(', ') || 'N/A'}</p>
                <p><strong>Developers:</strong> {game.developers.map(developer => developer.name).join(', ') || 'N/A'}</p>
                <p><strong>Tags:</strong> {game.tags.map(tag => tag.name).join(', ') || 'N/A'}</p>
                <p><strong>ESRB Rating:</strong> {game.esrb_rating ? game.esrb_rating.name : 'Not Rated'}</p>
            </div>
        </div>
    );
};

export default GameDetailPage;
