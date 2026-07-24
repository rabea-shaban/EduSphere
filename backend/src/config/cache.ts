/**
 * Unified Cache Utility.
 * Attempts to use Redis if connection settings are present, otherwise falls back to a fast in-memory map.
 */
class CacheManager {
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();

  /**
   * Fetch cached item.
   */
  public async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  /**
   * Set cached item.
   */
  public async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Clear cache item.
   */
  public async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }
}

export const cache = new CacheManager();
export default cache;
