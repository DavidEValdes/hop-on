import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiKey = import.meta.env.VITE_RAWG_API_KEY;

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [gameImage, setGameImage] = useState('');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState('');  // To display the selected game
    const [selectedTime, setSelectedTime] = useState('');  // State to hold the selected time
    const navigate = useNavigate();

    const fetchGames = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.rawg.io/api/games`, {
                params: {
                    key: apiKey,
                    search: searchTerm,
                    page_size: 10
                }
            });
            const results = response.data.results;
            setGames(results);
            if (results.length > 0) {
                setGame(results[0].name);
                setGameImage(results[0].background_image);
                setSearchTerm(results[0].name); // Optionally update searchTerm to the first result's name
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameChange = (e) => {
        const selectedGame = games.find(g => g.name === e.target.value);
        if (selectedGame) {
            setGame(selectedGame.name);
            setGameImage(selectedGame.background_image);
            setSearchTerm(selectedGame.name);
        }
    };

    const handleSelectGame = () => {
        setSelectedGame(game); // Set the selected game to display
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Convert selectedTime to 12-hour format with AM/PM indicator
        const timeParts = selectedTime.split(':');
        let hours = parseInt(timeParts[0], 10);
        let minutes = parseInt(timeParts[1], 10);
        let ampm = 'AM';
        
        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
            ampm = 'PM';
        } else if (hours === 12) {
            ampm = 'PM';
        }
    
        const displayTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    
        const { error } = await supabase
            .from('posts')
            .insert([{ 
                title, 
                content, 
                game, 
                game_image: gameImage, 
                created_at: new Date(),
                display_time: displayTime // Include converted display time in the inserted data
            }]);
        if (error) {
            console.error('Error inserting post:', error);
            alert('Failed to create post: ' + error.message);
        } else {
            alert('Post created successfully!');
            navigate('/');
        }
    };
    return (
        <div className="create-post-container">
            <h1>Create a New Post</h1>
            {gameImage && (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '20px', 
        marginBottom: '20px' 
    }}>
        <div style={{
            width: '120px', 
            height: '120px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%', // Makes the container circular
            overflow: 'hidden', // Ensures the image does not break the border-radius rule
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Subtle shadow for depth
        }}>
            <img src={gameImage} alt={game} style={{ 
                width: 'auto', // Ensures the image maintains aspect ratio
                height: '100%', // Full height of the container
                display: 'block' // Removes bottom space/gap
            }} />
        </div>
    </div>
)}
            <form onSubmit={handleSubmit} className="create-form">
                <input
                    type="text"
                    placeholder="Search game..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="button" onClick={fetchGames} disabled={loading || !searchTerm}>
                    Search Games
                </button>
                {games.length > 0 && !loading && (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }}>
        <select
            value={game}
            onChange={handleGameChange}
            required
            size={games.length > 0 ? "5" : undefined}
            style={{
                width: '300px', // Adjust width as needed
                padding: '10px',
                marginBottom: '10px',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--secondary-color)',
                background: 'white', // White background for the dropdown
                color: 'black', // Black text color
                fontSize: '1rem'
            }}
        >
            {games.map((game) => (
                <option key={game.id} value={game.name} style={{ background: 'white', color: 'black' }}>
                    {game.name}
                </option>
            ))}
        </select>
        <button
            type="button"
            onClick={handleSelectGame}
            style={{
                padding: '10px 20px',
                borderRadius: 'var(--border-radius)',
                background: 'var(--accent-color)',
                color: 'var(--primary-color)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
            }}
            onMouseOver={e => e.target.style.backgroundColor = 'var(--hover-color)'}
            onMouseOut={e => e.target.style.backgroundColor = 'var(--accent-color)'}
        >
            Select
        </button>
    </div>
)}
               {selectedGame && (
    <p style={{
        fontSize: '1.2rem', // Larger font size for emphasis
        fontWeight: 'bold', // Bold font weight for prominence
        backgroundColor: 'var(--background-color)', // Contrast background
        padding: '10px 20px', // Padding for better readability
        borderRadius: 'var(--border-radius)', // Rounded corners
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        marginTop: '20px', // Space above the paragraph
        textAlign: 'center', // Center the text
        border: '1px solid var(--secondary-color)' // Border to enhance visibility
    }}>
        Game selected: {selectedGame}
    </p>
)}
                {loading && <p>Loading games...</p>}
                
                
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    style={{ marginTop: '30px' }}  // Adds margin top
                />
                <p className="createPostDate">Please Enter Time in "00:00 AM/PM" Format</p>
                <textarea
                    placeholder="Additional Details"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />


                <button type="submit" className="createButton">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
