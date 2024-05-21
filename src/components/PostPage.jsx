import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CommentsSection from './CommentsSection';
import axios from 'axios';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [gameSlug, setGameSlug] = useState('');

    useEffect(() => {
        fetchPost();
    }, [postId]);

    useEffect(() => {
        if (post && post.game) {
            fetchGameSlug(post.game);
        }
    }, [post]);

    const fetchPost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) {
            console.error('Error fetching post', error);
        } else {
            setPost(data);
        }
    };

    const fetchGameSlug = async (gameName) => {
        try {
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: apiKey,
                    search: gameName
                }
            });
            if (response.data.results.length > 0) {
                const exactMatch = response.data.results.find(game => game.name.toLowerCase() === gameName.toLowerCase());
                setGameSlug(exactMatch ? exactMatch.slug : response.data.results[0].slug);
            }
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    if (!post) return <h2>Loading...</h2>;

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const { error } = await supabase
                .from('posts')
                .delete()
                .match({ id: postId });

            if (error) {
                console.error('Error deleting post', error);
            } else {
                navigate('/');
            }
        }
    };

    const handleUpvote = async () => {
        const { error } = await supabase
            .from('posts')
            .update({ upvotes: post.upvotes + 1 })
            .match({ id: post.id });

        if (error) {
            console.error('Error upvoting post:', error);
        } else {
            setPost({ ...post, upvotes: post.upvotes + 1 });
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return "Time not available";
        const dateString = `1970-01-01T${timeString}`;
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="post-page">
            <div className="post-details">
                {post && (
                    <>
                        <h2 className="post-game">{post.game}</h2>
                        <p className="post-display-time">@ {post.display_time ? formatTime(post.display_time) : 'Loading...'}</p>
                        {post.game_image && <img src={post.game_image} alt="Post" className="post-image" />}
                        {gameSlug && (
                            <Link to={`/games/${gameSlug}`} className="view-game-details-button">
                                View Game Details
                            </Link>
                        )}
                        <p className="postContent">{post.content}</p>
                    </>
                )}
            </div>
            {post && (
                <div className="button-container">
                    <p className="post-upvotes">Upvotes: {post.upvotes}</p>
                    <span className="dateSpan">Created at: {new Date(post.created_at).toLocaleString()}</span>
                    <button onClick={() => navigate(`/edit/${postId}`)} className="edit-post-button">Edit Post</button>
                    <button onClick={handleDelete} className="delete-post-button">Delete Post</button>
                    <button onClick={handleUpvote} className="upvote-post-button">Upvote Post</button>
                </div>
            )}
            <CommentsSection postId={postId} />
        </div>
    );
}

export default PostPage;
