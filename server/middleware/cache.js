const cacheStore = new Map();

const cache = (ttlSeconds = 30) => {
  return (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = req.originalUrl;
    const cached = cacheStore.get(key);

    if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
      return res.json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cacheStore.set(key, { data, timestamp: Date.now() });
      return originalJson(data);
    };

    next();
  };
};

cache.clear = (pattern) => {
  if (pattern) {
    for (const key of cacheStore.keys()) {
      if (key.includes(pattern)) cacheStore.delete(key);
    }
  } else {
    cacheStore.clear();
  }
};

module.exports = cache;
