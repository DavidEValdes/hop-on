import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('posts')
            .insert([{ title, content, game, created_at: new Date() }]);

        if (error) {
            console.error('Error inserting post:', error);
            alert('Failed to create post: ' + error.message);
        } else {
            setTitle('');
            setContent('');
            setGame('');
            alert('Post created successfully!');
            navigate(`/`);
        }
    };

    return (
        <div className="create-post-container">
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit} className="create-form">
                <label>
                    Title
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                </label>
                <label>
                    Content
                    <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
                </label>
                <label>
                    Game
                    <input type="text" placeholder="Game" value={game} onChange={e => setGame(e.target.value)} required />
                </label>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}

export default CreatePost;
