import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostFeed from './components/PostFeed';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import './App.css';

function App() {
  return (
      <div className="appContainer">  
          <Router>
              <Routes>
                  <Route path="/" element={<PostFeed />} />
                  <Route path="/create" element={<PostForm />} />
                  <Route path="/posts/:postId" element={<PostPage />} />
                  <Route path="/edit/:postId" element={<EditPost />} /> 
              </Routes>
          </Router>
      </div>
  );
}

export default App;