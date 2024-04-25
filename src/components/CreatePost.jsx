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
    const [selectedGame, setSelectedGame] = useState('');  // To display the selected game
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
            const results = response.data.results;
            setGames(results);
            if (results.length > 0) {
                setGame(results[0].name);
                setGameImage(results[0].background_image);
                setSearchTerm(results[0].name); // Optionally update searchTerm to the first result's name
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameChange = (e) => {
        const selectedGame = games.find(g => g.name === e.target.value);
        if (selectedGame) {
            setGame(selectedGame.name);
            setGameImage(selectedGame.background_image);
            setSearchTerm(selectedGame.name);
        }
    };

    const handleSelectGame = () => {
        setSelectedGame(game); // Set the selected game to display
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('posts')
            .insert([{ title, content, game, game_image: gameImage, created_at: new Date() }]);
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
            <form onSubmit={handleSubmit} className="create-form">
                <input
                    type="text"
                    placeholder="Search game..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" onClick={fetchGames} disabled={loading || !searchTerm}>
                    Search Games
                </button>
                {games.length > 0 && !loading && (
                    <div>
                        <select
                            value={game}
                            onChange={handleGameChange}
                            required
                            size={games.length > 0 ? "5" : undefined}
                        >
                            {games.map((game) => (
                                <option key={game.id} value={game.name}>
                                    {game.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={handleSelectGame}>Select</button>
                    </div>
                )}
                {selectedGame && <p>Game selected: {selectedGame}</p>}
                {loading && <p>Loading games...</p>}
                {gameImage && <img src={gameImage} alt={game} style={{ width: '100px', height: '100px', marginTop: '10px' }} />}
                <textarea
                    placeholder="Content"
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
