import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import Layout from './routes/Layout';
import GamesPage from'./routes/GamesPage';
import GameDetailPage from './components/GameDetailPage'
import AboutPage from './routes/AboutPage';
import './App.css';


function App() {
  return (
      <div className="appContainer">  
          <Router>
              <Routes>
                  <Route path="/" element={<Layout />}>
                      <Route index element={<PostFeed />} />
                      <Route path="create" element={<CreatePost />} />
                      <Route path="posts/:postId" element={<PostPage />} />
                      <Route path="edit/:postId" element={<EditPost />} />
                      <Route path="games" element={<GamesPage />} /> 
                      <Route path="games/:gameSlug" element={<GameDetailPage />} /> 
                      <Route path="about" element={<AboutPage />} /> 
                  </Route>  
              </Routes>
          </Router>
      </div>
  );
}

export default App;
