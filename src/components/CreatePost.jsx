import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchGames = async (search) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: apiKey,
                    search: search,
                    page_size: 10
                }
            });
            const results = response.data.results;
            setGames(results);
            if (results.length > 0) {
                setGame(results[0].name);
                setGameImage(results[0].background_image);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchGames = useCallback(debounce(fetchGames, 300), []);

    useEffect(() => {
        if (searchTerm && searchTerm !== game) {
            debouncedFetchGames(searchTerm);
        }
    }, [searchTerm, game, debouncedFetchGames]);

    const handleGameChange = (e) => {
        const selectedGame = games.find(game => game.name === e.target.value);
        if (selectedGame) {
            setGame(selectedGame.name);
            setGameImage(selectedGame.background_image);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if a game has been selected
        if (!game) {
            alert('Please select a game before submitting.');
            return; // Prevent the form from submitting
        }
    
        // Proceed with submitting the post
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
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setLoading(true);
                    }}
                />
                {searchTerm && !loading ? ( // Render select only when there is a search term and not loading
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
                ) : null}
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
