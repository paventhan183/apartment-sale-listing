import React from 'react';

import ListPage from './components/ListPage';
import DetailsPage from './components/DetailsPage';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Routes>
    //       <Route path="/" element={<ListPage />} />
    //       <Route path="/details/:itemId" element={<DetailsPage />} />
    //     </Routes>
    //   </div>
    // </Router>
    <HashRouter>
      <Routes>
       <Route path="/" element={<ListPage />} />
          <Route path="/details/:itemId" element={<DetailsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
