import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';


function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [sortBy, searchTerm]);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .ilike('title', `%${searchTerm}%`)
            .order(sortBy, { ascending: false });

        if (error) console.error('Error fetching posts:', error);
        else setPosts(data);
    };

    const handleCreatePost = () => {
        navigate('/create');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <div className="feedContainer">
            <div className="toolbar">
                <input type="text" placeholder="Search by title..." onChange={handleSearchChange} />
                <select onChange={handleSortChange} value={sortBy}>
                    <option value="created_at">Sort by Time</option>
                    <option value="upvotes">Sort by Upvotes</option>
                </select>
                <button onClick={handleCreatePost} className="createButton">Create Post</button>
            </div>
            {posts.length === 0 ? <div>No posts found.</div> : 
                posts.map(post => (
                    <div key={post.id} className="postCard" onClick={() => navigate(`/posts/${post.id}`)}>
                        <h3 className="postTitle">{post.title}</h3>
                        {post.image_url && <img src={post.image_url} alt="Post" className="postImage" />}
                        <p className="postContent">{post.content}</p>
                        <small className="postGame">Game: {post.game}</small>
                        <div className="postMeta">
                        <span>Created at: {new Date(post.created_at).toLocaleString()}</span>
                        <p>Upvotes: {post.upvotes}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default PostFeed;
