"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCachePattern = exports.cacheMiddleware = void 0;
const memoryCache = new Map();
/**
 * Cache middleware for Express GET requests.
 * @param durationInSeconds Cache duration in seconds (default: 60s)
 */
const cacheMiddleware = (durationInSeconds = 60) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }
        const key = `cache:${req.originalUrl || req.url}:${req.user?._id || 'public'}`;
        const cached = memoryCache.get(key);
        if (cached && Date.now() < cached.expiry) {
            res.setHeader('X-Cache', 'HIT');
            res.setHeader('Cache-Control', `private, max-age=${durationInSeconds}, stale-while-revalidate=30`);
            return res.status(200).json(cached.data);
        }
        // Intercept res.json to store in cache
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                memoryCache.set(key, {
                    data: body,
                    expiry: Date.now() + durationInSeconds * 1000,
                });
            }
            res.setHeader('X-Cache', 'MISS');
            res.setHeader('Cache-Control', `private, max-age=${durationInSeconds}, stale-while-revalidate=30`);
            return originalJson(body);
        };
        next();
    };
};
exports.cacheMiddleware = cacheMiddleware;
/**
 * Invalidate cache entries matching a pattern or clear all.
 */
const clearCachePattern = (pattern) => {
    if (!pattern) {
        memoryCache.clear();
        return;
    }
    for (const key of memoryCache.keys()) {
        if (key.includes(pattern)) {
            memoryCache.delete(key);
        }
    }
};
exports.clearCachePattern = clearCachePattern;
exports.default = exports.cacheMiddleware;
