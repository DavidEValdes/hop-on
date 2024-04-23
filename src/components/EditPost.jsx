import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function EditPost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '', game: '' });

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
        else setPost({ title: data.title, content: data.content, game: data.game });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('posts')
            .update({ title: post.title, content: post.content, game: post.game })
            .match({ id: postId });

        if (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post: ' + error.message);
        } else {
            alert('Post updated successfully!');
            navigate(`/posts/${postId}`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" value={post.title} onChange={handleChange} required />
            <br></br>
            <textarea name="content" placeholder="Content" value={post.content} onChange={handleChange} />
            <br></br>
            <input type="text" name="game" placeholder="Game" value={post.game} onChange={handleChange} required />
            <br></br>
            <button type="submit">Update Post</button>
        </form>
    );
}

export default EditPost;
