import itemsData from './items-data.json';

/**
 * Retrieves all listings.
 * In a real app, this would likely be an async API call.
 * @returns {Array} A list of all apartment listings.
 */
export const getAllListings = () => {
  // Simulate receiving a JSON string (like from an API) and parsing it.
  const jsonString = JSON.stringify(itemsData);
  const listings = JSON.parse(jsonString);
  return listings.filter(item => item.show !== false);
};

/**
 * Finds a single listing by its ID.
 * @param {string | number} id The ID of the listing to find.
 * @returns {Object | undefined} The listing object or undefined if not found.
 */
export const getListingById = (id) => {
  const numericId = parseInt(id, 10);
  // Simulate parsing the data to find a specific item.
  const jsonString = JSON.stringify(itemsData);
  const listings = JSON.parse(jsonString);
  return listings.find(item => item.id === numericId);
};