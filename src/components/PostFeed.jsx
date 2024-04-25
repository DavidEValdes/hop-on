import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Use useCallback to ensure fetchPosts is not recreated unless necessary
    const fetchPosts = useCallback(async (term) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .ilike('game', `%${term}%`)
                .order(sortBy, { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            } else {
                setPosts(data);
            }
        } catch (error) {
            console.error('Network or other error', error);
        } finally {
            setLoading(false);
        }
    }, [sortBy]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts(searchTerm);
        }, 500); // Debounce the search term input
        return () => clearTimeout(timer);
    }, [searchTerm, fetchPosts]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleCreatePost = () => {
        navigate('/create');
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    };

    return (
        <div className="feedContainer">
            <form onSubmit={handleFormSubmit} className="toolbar">
                <input
                    type="text"
                    placeholder="Search by game..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="created_at">Sort by Time</option>
                    <option value="upvotes">Sort by Upvotes</option>
                </select>
                <button type="button" onClick={handleCreatePost} className="createButton">Create Post</button>
            </form>
            {loading ? <h2>Loading...</h2> : (
                posts.length === 0 ? <div>No posts found.</div> : 
                posts.map(post => (
                    <div key={post.id} className="postCard" onClick={() => navigate(`/posts/${post.id}`)}>
                        <div className="postDetails">
                            <h4 className="postGame">{post.game}</h4>
                            <p className="postContent">{post.content}</p>
                            <div className="postMeta">
                                <span>Created at: {new Date(post.created_at).toLocaleString()}</span>
                                <p>Upvotes: {post.upvotes}</p>
                            </div>
                        </div>
                        {post.game_image && <img src={post.game_image} alt={post.title} className="postImage" />}
                    </div>
                ))
            )}
        </div>
    );
}

export default PostFeed;
