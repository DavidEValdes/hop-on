import React, { useState} from 'react';
import { supabase } from '../supabaseClient';

function PostForm() {
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
            
            
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
            <input type="text" placeholder="Game" value={game} onChange={e => setGame(e.target.value)} required />
            <button type="submit">Create Post</button>
        </form>
    );
}

export default PostForm;
