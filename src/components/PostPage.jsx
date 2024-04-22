// src/components/PostPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CommentsSection from './CommentsSection'; // Import the new component

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error) console.error('Error fetching post', error);
        else setPost(data);
    };

    if (!post) return <div>Loading...</div>;

    const handleDelete = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .delete()
                .match({ id: postId });
    
            if (error) {
                console.error('Error deleting post', error);
                // Optionally display an error message to the user
            } else {
                console.log('Post deleted:', data); // You can log the deleted data if needed
                navigate('/'); // Navigate back to the home page or list of posts
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            // Handle unexpected errors
        }
    };
    
    return (
        <div>
            <h1>{post.title}</h1>
            {post.image_url && <img src={post.image_url} alt="Post" />}
            <p>{post.content}</p>
            <small>Game: {post.game}</small>
            <button onClick={() => navigate(`/edit/${postId}`)}>Edit Post</button>
            <button onClick={handleDelete}>Delete Post</button>
            <CommentsSection postId={postId} />
        </div>
    );
}

export default PostPage;
