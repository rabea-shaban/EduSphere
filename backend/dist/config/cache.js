"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
/**
 * Unified Cache Utility.
 * Attempts to use Redis if connection settings are present, otherwise falls back to a fast in-memory map.
 */
class CacheManager {
    memoryCache = new Map();
    /**
     * Fetch cached item.
     */
    async get(key) {
        const cached = this.memoryCache.get(key);
        if (!cached)
            return null;
        if (Date.now() > cached.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        return cached.value;
    }
    /**
     * Set cached item.
     */
    async set(key, value, ttlSeconds = 3600) {
        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.memoryCache.set(key, { value, expiresAt });
    }
    /**
     * Clear cache item.
     */
    async del(key) {
        this.memoryCache.delete(key);
    }
}
exports.cache = new CacheManager();
exports.default = exports.cache;
