// Simple in-memory cache with 5-minute TTL
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

exports.getMatch = (id) => {
  const item = cache[id];
  if (!item) return null;
  
  if (Date.now() - item.timestamp > CACHE_TTL) {
    delete cache[id];
    return null; // Expired
  }
  return item.data;
};

exports.setMatch = (id, data) => {
  cache[id] = {
    data,
    timestamp: Date.now()
  };
};

exports.clearMatch = (id) => {
  delete cache[id];
};
