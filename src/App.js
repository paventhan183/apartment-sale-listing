import React from 'react';

import ListPage from './components/ListPage';
import DetailsPage from './components/DetailsPage';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <div className="advertisement-contact">
        For Advertisement Contact: 90000000
      </div>
      <HashRouter>
        <Routes>
         <Route path="/" element={<ListPage />} />
          <Route path="/details/:itemId" element={<DetailsPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
