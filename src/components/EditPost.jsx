import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '', game: '', gameImage: '', displayTime: '' });
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState('');

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    const fetchPostDetails = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            console.error('Error fetching post', error);
            alert('Failed to fetch post: ' + error.message);
        } else {
            setPost({
                title: data.title,
                content: data.content,
                game: data.game,
                gameImage: data.game_image,
                displayTime: data.display_time
            });
            setSearchTerm(data.game);
            setSelectedGame(data.game);
        }
    };

    const fetchGames = useCallback(async () => {
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
            setPost(prev => ({ ...prev, game: '' }));
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, apiKey]);

    const handleGameSelect = (e) => {
        const selectedGame = games.find(game => game.name === e.target.value);
        if (selectedGame) {
            setPost({
                ...post,
                game: selectedGame.name,
                gameImage: selectedGame.background_image
            });
            setSelectedGame(selectedGame.name);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('posts')
            .update({
                title: post.title,
                content: post.content,
                game: post.game,
                game_image: post.gameImage,
                display_time: post.displayTime
            })
            .match({ id: postId });

        if (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post: ' + error.message);
        } else {
            alert('Post updated successfully!');
            navigate(`/posts/${postId}`);
        }
    };

    return (
        <div className="edit-post-container">
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <input
                    type="text"
                    placeholder="Search game..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchInput"
                />
                <button type="button" onClick={fetchGames} disabled={loading || !searchTerm} className="createButton">
                    Search Games
                </button>
                {games.length > 0 && !loading && (
                    <div className="gamesList">
                        <select value={post.game} onChange={handleGameSelect} required className="sortDropdown">
                            <option value="">Select a game...</option>
                            {games.map(game => (
                                <option key={game.id} value={game.name}>{game.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedGame && <p>Game selected: {selectedGame}</p>}
                {loading && <p>Loading games...</p>}
                {post.gameImage && (
                    <div className="game-image-container">
                        <img src={post.gameImage} alt="Selected game" className="game-image"/>
                    </div>
                )}
                <textarea
                    name="content"
                    value={post.content}
                    onChange={handleChange}
                    required
                    className="comments-textarea"
                />
                <label>Hop On Time:
                    <input
                        type="time"
                        name="displayTime"
                        value={post.displayTime}
                        onChange={handleChange}
                        required
                        className="searchInput"
                    />
                </label>
                <button type="submit" className="createButton">Update Post</button>
            </form>
        </div>
    );
}

export default EditPost;
