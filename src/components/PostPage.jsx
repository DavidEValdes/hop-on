import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import CommentsSection from './CommentsSection'; 


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

    if (!post) return <h2>Loading...</h2>;  

    const handleDelete = async () => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .match({ id: postId });

        if (error) {
            console.error('Error deleting post', error);
            
        } else {
            console.log('Post deleted:', data); 
            navigate('/'); 
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        
    }
};

const handleUpvote = async () => {
    const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 }) 
        .match({ id: post.id });

    if (error) {
        console.error('Error upvoting post:', error);
    } else {
        setPost({ ...post, upvotes: post.upvotes + 1 }); 
    }
};

return (
    <div className="post-page">
        <h1 className="post-title">{post.title}</h1>
        {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
        <p className="post-content">{post.content}</p>
        <small className="post-game">Game: {post.game}</small>
        <p className="post-upvotes">Upvotes: {post.upvotes}</p>
        <button onClick={() => navigate(`/edit/${postId}`)} className="edit-post-button">Edit Post</button>
        <button onClick={handleDelete} className="delete-post-button">Delete Post</button>
        <button onClick={handleUpvote} className="upvote-post-button">Upvote Post</button>
        <CommentsSection postId={postId} />
    </div>
);
}

export default PostPage;
