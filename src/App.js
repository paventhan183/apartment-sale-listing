import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListPage from './components/ListPage';
import DetailsPage from './components/DetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/details/:itemId" element={<DetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
