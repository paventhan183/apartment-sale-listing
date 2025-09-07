import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getListingById } from '../data/listings';
import './DetailsPage.css';

const DetailsPage = () => {
  const { itemId } = useParams();
  const item = getListingById(itemId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isVideoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedFloorPlanIndex, setSelectedFloorPlanIndex] = useState(null);
  const [floorPlanStartIndex, setFloorPlanStartIndex] = useState(0);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
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

  const openFloorPlan = (index) => {
    setSelectedFloorPlanIndex(index);
  };

  const closeFloorPlan = useCallback(() => {
    setSelectedFloorPlanIndex(null);
  }, []);

  const handleNextFloorPlanThumbnails = useCallback(() => {
    setFloorPlanStartIndex(prevIndex => prevIndex + 1);
  }, []);

  const handlePrevFloorPlanThumbnails = useCallback(() => {
    setFloorPlanStartIndex(prevIndex => prevIndex - 1);
  }, []);

  const handleNextGalleryThumbnails = useCallback(() => {
    setGalleryStartIndex(prevIndex => prevIndex + 1);
  }, []);

  const handlePrevGalleryThumbnails = useCallback(() => {
    setGalleryStartIndex(prevIndex => prevIndex - 1);
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

  const showNextFloorPlan = useCallback((e) => {
    e.stopPropagation();
    if (selectedFloorPlanIndex === null || !item.floorPlanUrls) return;
    setSelectedFloorPlanIndex((prevIndex) => (prevIndex + 1) % item.floorPlanUrls.length);
  }, [selectedFloorPlanIndex, item.floorPlanUrls]);

  const showPrevFloorPlan = useCallback((e) => {
    e.stopPropagation();
    if (selectedFloorPlanIndex === null || !item.floorPlanUrls) return;
    setSelectedFloorPlanIndex((prevIndex) => (prevIndex - 1 + item.floorPlanUrls.length) % item.floorPlanUrls.length);
  }, [selectedFloorPlanIndex, item.floorPlanUrls]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeImage();
        closeVideoModal();
        closeFloorPlan();
      } else if (selectedImageIndex !== null) {
        if (event.key === 'ArrowRight') {
          showNextImage(event);
        } else if (event.key === 'ArrowLeft') {
          showPrevImage(event);
        }
      } else if (selectedFloorPlanIndex !== null) {
        if (event.key === 'ArrowRight') {
          showNextFloorPlan(event);
        } else if (event.key === 'ArrowLeft') {
          showPrevFloorPlan(event);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeImage, closeVideoModal, closeFloorPlan, selectedImageIndex, showNextImage, showPrevImage, selectedFloorPlanIndex, showNextFloorPlan, showPrevFloorPlan]);

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

  const formatToLakhs = (amount) => {
    const lakhs = amount / 100000;
    return `${parseFloat(lakhs.toFixed(2))}L`;
  };

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
      {selectedFloorPlanIndex !== null && (
        <div className="modal-overlay" onClick={closeFloorPlan} role="dialog" aria-modal="true">
          <button className="modal-arrow-button prev" onClick={showPrevFloorPlan} aria-label="Previous floor plan">
            &#10094;
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeFloorPlan} aria-label="Close floor plan viewer">
              &times;
            </button>
            <img src={item.floorPlanUrls[selectedFloorPlanIndex]} alt={`Floor plan ${selectedFloorPlanIndex + 1}`} className="modal-image" />
          </div>
          <button className="modal-arrow-button next" onClick={showNextFloorPlan} aria-label="Next floor plan">
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
        {item.minAmount && item.maxAmount && (
          <p className="item-amount-details">
            Price: {formatToLakhs(item.minAmount)} - {formatToLakhs(item.maxAmount)}
          </p>
        )}
        {item.description && (
          <p className="item-description">
            {descriptionText}
            {isLongDescription && (
              <button onClick={toggleDescription} className="show-more-less-button">
                {isDescriptionExpanded ? ' Show less' : ' Show more'}
              </button>
            )}
          </p>
        )}
        
        {(item.address || item.phoneNumber) && (
          <div className="contact-info">
            <h3>Contact & Location</h3>
            {item.address && <p><strong>Address:</strong> {item.address}</p>}
            {item.phoneNumber && <p><strong>Phone:</strong> {item.phoneNumber}</p>}
          </div>
        )}

        {item.landmark && (
          <div className="details-landmark">
            <h3>Landmark</h3>
            <p>{item.landmark}</p>
          </div>
        )}

        {item.nearbySchools && item.nearbySchools.length > 0 && (
          <div className="details-nearby">
            <h3>Nearby Schools</h3>
            <ul>
              {item.nearbySchools.map((school, index) => (
                <li key={index}>{school}</li>
              ))}
            </ul>
          </div>
        )}

        {item.nearbyHospitals && item.nearbyHospitals.length > 0 && (
          <div className="details-nearby">
            <h3>Nearby Hospitals</h3>
            <ul>
              {item.nearbyHospitals.map((hospital, index) => (
                <li key={index}>{hospital}</li>
              ))}
            </ul>
          </div>
        )}

        {item.floorPlanUrls && item.floorPlanUrls.length > 0 && (
          <div className="details-floor-plan">
            <h3>Floor Plan(s)</h3>
            <div className="floor-plan-carousel">
              {item.floorPlanUrls.length > 3 && (
                <button
                  className="carousel-arrow prev"
                  onClick={handlePrevFloorPlanThumbnails}
                  disabled={floorPlanStartIndex === 0}
                  aria-label="Previous floor plans"
                >
                  &#10094;
                </button>
              )}
              <div className="floor-plan-thumbnails-container">
                <div
                  className="floor-plan-thumbnails"
                  style={{ transform: `translateX(-${floorPlanStartIndex * (246 + 10)}px)` }}
                >
                  {item.floorPlanUrls.map((url, index) => (
                    <div
                      key={index}
                      className="floor-plan-thumbnail-container"
                      onClick={() => openFloorPlan(index)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && openFloorPlan(index)}
                    >
                      <img
                        src={url}
                        alt={`Floor plan ${index + 1}`}
                        className="floor-plan-thumbnail"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {item.floorPlanUrls.length > 3 && (
                <button
                  className="carousel-arrow next"
                  onClick={handleNextFloorPlanThumbnails}
                  disabled={floorPlanStartIndex >= item.floorPlanUrls.length - 3}
                  aria-label="Next floor plans"
                >
                  &#10095;
                </button>
              )}
            </div>
          </div>
        )}

        {item.brochureUrl && (
          <div className="details-brochure">
            <h3>Apartment Brochure</h3>
            <a
              href={item.brochureUrl}
              download
              className="brochure-download-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Brochure (PDF)
            </a>
          </div>
        )}
        
        {item.lat && item.lng && (
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
        )}

        {(item.detailImages && item.detailImages.length > 0 || item.videoUrl) && (
          <div className="details-media">
            {item.detailImages && item.detailImages.length > 0 && (
              <>
                <h2>Gallery</h2>
                <div className="gallery-carousel">
                  {item.detailImages.length > 3 && (
                    <button
                      className="carousel-arrow prev"
                      onClick={handlePrevGalleryThumbnails}
                      disabled={galleryStartIndex === 0}
                      aria-label="Previous images"
                    >
                      &#10094;
                    </button>
                  )}
                  <div className="gallery-thumbnails-container">
                    <div
                      className="details-images"
                      style={{ transform: `translateX(-${galleryStartIndex * (250 + 10)}px)` }}
                    >
                      {item.detailImages.map((img, index) => (
                        <div
                          key={index}
                          className="gallery-image-container"
                          onClick={() => openImage(index)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && openImage(index)}
                        >
                          <img
                            src={img}
                            alt={`${item.name} - view ${index + 1}`}
                            className="gallery-image"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {item.detailImages.length > 3 && (
                    <button
                      className="carousel-arrow next"
                      onClick={handleNextGalleryThumbnails}
                      disabled={galleryStartIndex >= item.detailImages.length - 3}
                      aria-label="Next images"
                    >
                      &#10095;
                    </button>
                  )}
                </div>
              </>
            )}

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
        )}
      </div>
    </div>
  );
};

export default DetailsPage;