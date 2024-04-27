import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const navigate = useNavigate();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: apiKey,
                    search: searchTerm,
                    page_size: 10
                }
            });
            setGames(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching games:', error);
            setLoading(false);
        }
    };

    const handleGameChange = (e) => {
        const selected = games.find(g => g.name === e.target.value);
        if (selected) {
            setGame(selected.name);
            setGameImage(selected.background_image);
            setSelectedGame(selected.name); // Directly update selectedGame here
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGame) { // Ensure a game is selected
            alert("Please search for and select a game before submitting.");
            return;
        }

        const timeParts = selectedTime.split(':');
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 24h to 12h format

        const displayTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

        const { error } = await supabase
            .from('posts')
            .insert([{ 
                title, 
                content, 
                game: selectedGame, // Use selectedGame here to ensure consistency
                game_image: gameImage, 
                created_at: new Date(),
                display_time: displayTime
            }]);

        if (error) {
            console.error('Error inserting post:', error);
            alert('Failed to create post: ' + error.message);
        } else {
            alert('Post created successfully!');
            navigate('/');
        }
    };

    return (
        <div className="create-post-container">
            <h1>Create a New Post</h1>
            {gameImage && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: '20px', 
                    marginBottom: '20px' 
                }}>
                    <div style={{
                        width: '120px', 
                        height: '120px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        <img src={gameImage} alt={selectedGame} style={{ 
                            width: 'auto',
                            height: '100%',
                            display: 'block'
                        }} />
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="create-form">
                <label>Game:
                    <input
                        type="text"
                        placeholder="Search game..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="button" className="search-games-button" onClick={fetchGames} disabled={loading || !searchTerm}>
    
                        Search Games
                    </button>
                    {games.length > 0 && !loading && (
                        <select
                        className="create-post-dropdown" // Use the new class name here
                        value={selectedGame}
                        onChange={handleGameChange}
                        required
                    >
                        <option value="">Select a game...</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.name}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                    )}
                </label>
                {selectedGame && (
                    <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        backgroundColor: 'var(--background-color)',
                        padding: '10px 20px',
                        borderRadius: 'var(--border-radius)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        marginTop: '10px',
                        textAlign: 'center',
                        border: '1px solid var(--secondary-color)'
                    }}>
                        Game selected: {selectedGame}
                    </p>
                )}
                <label>Hop On Time:
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                    />
                </label>
                <textarea
                    placeholder="Additional Details"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit" className="createButton">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
