import React, { useState, useEffect, useReducer } from 'react';
import { supabase } from '../supabaseClient';

function CommentsSection({ postId }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0); // simple counter to force render
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId);

        if (error) console.error('Error fetching comments', error);
        else setComments(data);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
    
        const newComment = { post_id: postId, text: commentText };
    
        // Optimistically update UI
        setComments(currentComments => [...currentComments, { ...newComment, id: Date.now() }]);
        setCommentText('');
    
        // Attempt to insert the comment into the database
        const { data, error } = await supabase
            .from('comments')
            .insert([newComment]);
    
        if (error) {
            console.error('Error adding comment', error);
            // Rollback the optimistic update
            setComments(currentComments => currentComments.filter(comment => comment.id !== Date.now()));
        } else {
            // Correctly replace the temporary ID with the real one from the database
            setComments(currentComments => {
                return currentComments.map(comment =>
                    comment.id === Date.now() ? { ...comment, id: data[0].id } : comment
                );
            });
        }
    };

    return (
        <div>
            <h3>Comments</h3>
            {comments.map(comment => (
                <div key={comment.id}>
                    <p>{comment.text}</p>
                </div>
            ))}
            <form onSubmit={handleAddComment}>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    required
                ></textarea>
                <button type="submit">Post Comment</button>
            </form>
        </div>
    );
}

export default CommentsSection;