// Permanent in-memory cache — no TTL, data persists for the lifetime of the process.
const cache = {};

exports.getMatch = (id) => {
  return cache[id] || null;
};

exports.setMatch = (id, data) => {
  cache[id] = data;
};

exports.clearMatch = (id) => {
  delete cache[id];
};
