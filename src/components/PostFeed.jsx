import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPosts = useCallback(async (term) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, game, content, upvotes, comments_count, created_at, display_time, game_image')
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
        }, 500);
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
        event.preventDefault();
    };
    const formatTime = (timeString) => {
        // Create a full date-time string by appending a safe base date
        const dateString = `1970-01-01 ${timeString}`;
        // Parse it as local time
        const date = new Date(dateString);
        // Format it to show only time in 12-hour format with AM/PM
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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
                            <h4 className="postDisplayTime">@ {formatTime(post.display_time)}</h4>
                            <p className="postContent">{post.content}</p>
                            <div className="postMeta">
                                <p>Upvotes: {post.upvotes}</p>
                                <div className="commentsMeta">
                                    <p>Comments: {post.comments_count}</p>
                                </div>
                                <span>Posted at: {new Date(post.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
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
