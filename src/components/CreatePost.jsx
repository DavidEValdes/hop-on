import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import axios from 'axios';

const apiKey = import.meta.env.VITE_RAWG_API_KEY; // Ensure this is set in your environment

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            fetchGames(searchTerm);
        }
    }, [searchTerm]);

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
            setGames(response.data.results);
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameChange = (e) => {
        const selectedGame = games.find(game => game.id.toString() === e.target.value);
        setGame(selectedGame.name);
        setGameImage(selectedGame.background_image);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
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
                {loading ? (
                    <p>Loading games...</p>
                ) : (
                    <select
                        onChange={handleGameChange}
                        required
                    >
                        <option value="">Select a Game</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                )}
                {gameImage && <img src={gameImage} alt={game} style={{ width: '100%', marginTop: '10px' }} />}
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
