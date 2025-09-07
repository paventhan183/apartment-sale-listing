import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllListings } from '../data/listings';
import './ListPage.css';

const ListPage = () => {
  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem('searchTerm') || ''
  );
  const [allItems] = useState(getAllListings());
  const [filteredItems, setFilteredItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter items whenever searchTerm or allItems changes
  useEffect(() => {
    sessionStorage.setItem('searchTerm', searchTerm);
    if (!searchTerm) {
      setFilteredItems(allItems);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = allItems.filter(item =>
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.description.toLowerCase().includes(lowercasedTerm) ||
      (item.placeName && item.placeName.toLowerCase().includes(lowercasedTerm)) ||
      (item.address && item.address.toLowerCase().includes(lowercasedTerm))
    );
    setFilteredItems(results);
    setVisibleCount(8); // Reset visible items on new search
  }, [searchTerm, allItems]);

  // Handles lazy loading on scroll
  useEffect(() => {
    let throttleTimeout = null;
    const handleScroll = () => {
      if (throttleTimeout) {
        return;
      }
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        const isAtBottom =
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100; // 100px buffer

        if (isAtBottom && visibleCount < filteredItems.length) {
          setVisibleCount(prevCount => prevCount + 8);
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [visibleCount, filteredItems]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const formatToLakhs = (amount) => {
    const lakhs = amount / 100000;
    return `${parseFloat(lakhs.toFixed(2))}L`;
  };

  return (
    <div className="search-page">
      <h1>Apartment Sale Listings</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search for listings..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search for listings"
        />
        {searchTerm && (
          <button onClick={handleReset} className="reset-button">Reset</button>
        )}
      </div>
      <div className="results-grid">
        {filteredItems.length > 0 ? (
          filteredItems.slice(0, visibleCount).map(item => (
            <Link to={`/details/${item.id}`} key={item.id} className="grid-item-link">
              <div className="grid-item">
                <img src={item.imageUrl} alt={item.name} className="grid-item-image" />
                <div className="grid-item-content">
                  <h2>{item.name}</h2>
                  <p className="item-place">{item.placeName}</p>
                  {item.minAmount && item.maxAmount && (
                    <p className="item-amount">{formatToLakhs(item.minAmount)} - {formatToLakhs(item.maxAmount)}</p>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No listings found for "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
};

export default ListPage;