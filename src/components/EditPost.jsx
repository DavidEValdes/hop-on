import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '', game: '', gameImage: '' });
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    useEffect(() => {
        if (searchTerm.length > 2) {
            fetchGames(searchTerm);
        } else {
            setGames([]);
        }
    }, [searchTerm]);
    

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
                gameImage: data.game_image
            });
            setSearchTerm(data.game); // Set search term to the game name
        }
    };

    const fetchGames = useCallback(async (search) => {
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
            if (results.length > 0 && (!post.game || !games.some(g => g.name === post.game))) {
                setPost(prevPost => ({
                    ...prevPost,
                    game: results[0].name,
                    gameImage: results[0].background_image
                }));
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    }, [post.game, games]);

    const handleGameSelect = (e) => {
        const selectedGame = games.find(game => game.name === e.target.value);
        if (selectedGame) {
            setPost({
                ...post,
                game: selectedGame.name,
                gameImage: selectedGame.background_image
            });
            setSearchTerm(selectedGame.name);  // Update the searchTerm to reflect the selected game name
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
                game_image: post.gameImage
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
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {loading ? <p>Loading games...</p> : (
                    <select value={post.game} onChange={handleGameSelect} required>
                        {games.map(game => (
                            <option key={game.id} value={game.name}>{game.name}</option>
                        ))}
                    </select>
                )}
                {post.gameImage && <img src={post.gameImage} alt="Selected game" style={{ width: '100px', height: '100px' }} />}
                <textarea name="content" value={post.content} onChange={handleChange} required />
                <button type="submit">Update Post</button>
            </form>
        </div>
    );
}

export default EditPost;