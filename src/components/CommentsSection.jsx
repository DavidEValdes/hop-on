import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function CommentsSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: false });
    
        if (error) console.error('Error fetching comments', error);
        else setComments(data);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
    
        const newComment = { 
            post_id: postId, 
            text: commentText,
            created_at: new Date().toISOString() 
        };
        
        setComments(currentComments => [{ ...newComment, id: Date.now() }, ...currentComments]);
        setCommentText('');
        
        const { data, error } = await supabase.from('comments').insert([newComment]);
        if (error) {
            console.error('Error adding comment', error);
            
            setComments(currentComments => currentComments.filter(comment => comment.id !== Date.now()));
        } else {
            
            setComments(currentComments => currentComments.map(comment =>
                comment.id === Date.now() ? { ...comment, id: data[0].id } : comment
            ));
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            <form onSubmit={handleAddComment}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    required
                ></textarea>
                <button type="submit">Post Comment</button>
            </form>
            {comments.map(comment => (
                <div key={comment.id}>
                    <p>{comment.text}</p>
                    <small>Posted on: {new Date(comment.created_at).toLocaleString()}</small>
                </div>
            ))}
            
        </div>
    );
}

export default CommentsSection;