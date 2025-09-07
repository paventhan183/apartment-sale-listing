import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../data/listings';
import './DetailsPage.css';

const DetailsPage = () => {
  const { itemId } = useParams();
  const item = getListingById(itemId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const openImage = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImage = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const openVideoModal = () => {
    setVideoModalOpen(true);
  };

  const closeVideoModal = useCallback(() => {
    setVideoModalOpen(false);
  }, []);

  const showNextImage = useCallback((e) => {
    e.stopPropagation();
    if (selectedImageIndex === null || !item.detailImages) return;
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % item.detailImages.length);
  }, [selectedImageIndex, item.detailImages]);

  const showPrevImage = useCallback((e) => {
    e.stopPropagation();
    if (selectedImageIndex === null || !item.detailImages) return;
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + item.detailImages.length) % item.detailImages.length);
  }, [selectedImageIndex, item.detailImages]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeImage();
        closeVideoModal();
      } else if (selectedImageIndex !== null) {
        if (event.key === 'ArrowRight') {
          showNextImage(event);
        } else if (event.key === 'ArrowLeft') {
          showPrevImage(event);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeImage, closeVideoModal, selectedImageIndex, showNextImage, showPrevImage]);

  if (!item) {
    return (
      <div className="details-page">
        <h1>Listing Not Found</h1>
        <p>The listing you are looking for does not exist.</p>
        <Link to="/" className="back-link">Back to Listings</Link>
      </div>
    );
  }

  const DESCRIPTION_CHAR_LIMIT = 150;
  const isLongDescription = item.description.length > DESCRIPTION_CHAR_LIMIT;

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const descriptionText = isLongDescription && !isDescriptionExpanded
    ? `${item.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...`
    : item.description;

  return (
    <div className="details-page">
      {selectedImageIndex !== null && (
        <div className="modal-overlay" onClick={closeImage} role="dialog" aria-modal="true">
          <button className="modal-arrow-button prev" onClick={showPrevImage} aria-label="Previous image">
            &#10094;
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeImage} aria-label="Close image viewer">
              &times;
            </button>
            <img src={item.detailImages[selectedImageIndex]} alt="Enlarged view" className="modal-image" />
          </div>
          <button className="modal-arrow-button next" onClick={showNextImage} aria-label="Next image">
            &#10095;
          </button>
        </div>
      )}
      {isVideoModalOpen && (
        <div className="modal-overlay" onClick={closeVideoModal} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeVideoModal} aria-label="Close video player">
              &times;
            </button>
            <video controls autoPlay className="modal-video">
              <source src={item.videoUrl} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </div>
        </div>
      )}
      <Link to="/" className="back-link">‹ Back to Listings</Link>
      <div className="details-content">
        <h1>{item.name}</h1>
        <p className="item-description">
          {descriptionText}
          {isLongDescription && (
            <button onClick={toggleDescription} className="show-more-less-button">
              {isDescriptionExpanded ? ' Show less' : ' Show more'}
            </button>
          )}
        </p>
        
        <div className="contact-info">
          <h3>Contact & Location</h3>
          <p><strong>Address:</strong> {item.address}</p>
          <p><strong>Phone:</strong> {item.phoneNumber}</p>
        </div>
        
        <div className="details-map">
          <h3>On the Map</h3>
          <iframe
            title="Listing Location"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${item.lat},${item.lng}&t=&z=15&ie=UTF8&iwloc=A&output=embed`}
          ></iframe>
        </div>

        <div className="details-media">
          <h2>Gallery</h2>
          <div className="details-images">
            {item.detailImages && item.detailImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${item.name} - view ${index + 1}`}
                className="gallery-image"
                onClick={() => openImage(index)}
              />
            ))}
          </div>

          {item.videoUrl && (
            <div className="details-video">
              <h2>Video Tour</h2>
              <div className="video-thumbnail-container" onClick={openVideoModal} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && openVideoModal()}>
                <video width="100%">
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
                <div className="play-button-overlay" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;