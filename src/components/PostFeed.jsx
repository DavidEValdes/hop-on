import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import moment from 'moment-timezone';

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
        // Ensure the timeString is not empty or undefined
        if (!timeString) {
            return "Time not available";
        }
    
        try {
            // Attempt to parse and format the time
            const dateString = `1970-01-01T${timeString}`; // Assuming timeString is something like "14:45:00"
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid time value');
            }
            // Format it to show only time in 12-hour format with AM/PM
            const timeFormatted = date.toLocaleTimeString('en-US', {
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true
            });
    
            // Return formatted time without time zone
            return timeFormatted;
        } catch (error) {
            console.error('Error formatting time:', error);
            return "Invalid time"; // or any other fallback message
        }
    };
    return (
        <div className="feedContainer">
            <form onSubmit={handleFormSubmit} className="toolbar">
                <span>
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
                </span>
                <button type="button" onClick={handleCreatePost} className="createButton">Create Post</button>
            </form>
            {loading ? <h2>Loading...</h2> : (
                posts.length === 0 ? <div>No posts found.</div> : 
                posts.map(post => (
                    <div key={post.id} className="postCard" onClick={() => navigate(`/posts/${post.id}`)}>
                        <div className="postDetails">
                            <h4 className="postGame">{post.game}</h4>
                            <h4 className="postDisplayTime">@ {formatTime(post.display_time)} </h4>
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
