const mongoose = require('mongoose');

// Cache Schema
const cacheSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    source: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
});

// Auto-delete expired documents
cacheSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

const ApiCache = mongoose.model('ApiCache', cacheSchema);

class CacheManager {
    /**
     * Generate cache key
     * @param {string} category - API category (weather, horoscope, etc.)
     * @param {string} identifier - Specific identifier (city, date, etc.)
     * @param {string} date - Date string (YYYY-MM-DD)
     * @returns {string} Cache key
     */
    static generateKey(category, identifier = '', date = null) {
        const dateStr = date || new Date().toISOString().split('T')[0];
        return `${category}:${identifier}:${dateStr}`.toLowerCase();
    }

    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {Object|null} Cached data or null if not found/expired
     */
    static async get(key) {
        try {
            const cached = await ApiCache.findOne({
                key: key,
                expiresAt: { $gt: new Date() }
            });

            if (cached) {
                console.log(`[Cache HIT] ${key}`);
                return {
                    category: cached.category,
                    date: cached.createdAt.toISOString().split('T')[0],
                    data: cached.data,
                    source: cached.source,
                    cached: true,
                    lastUpdated: cached.createdAt
                };
            }

            console.log(`[Cache MISS] ${key}`);
            return null;
        } catch (error) {
            console.error(`[Cache Error] Failed to get ${key}:`, error.message);
            return null;
        }
    }

    /**
     * Set cache data
     * @param {string} key - Cache key
     * @param {Object} data - Data to cache
     * @param {string} category - API category
     * @param {string} source - Data source
     * @param {number} expirySeconds - Cache expiry in seconds
     */
    static async set(key, data, category, source, expirySeconds = 3600) {
        try {
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + expirySeconds);

            await ApiCache.findOneAndUpdate(
                { key },
                {
                    key,
                    data,
                    category,
                    source,
                    expiresAt,
                    createdAt: new Date()
                },
                { upsert: true, new: true }
            );

            console.log(`[Cache SET] ${key} (expires: ${expiresAt.toISOString()})`);
        } catch (error) {
            console.error(`[Cache Error] Failed to set ${key}:`, error.message);
        }
    }

    /**
     * Delete cached data
     * @param {string} key - Cache key or pattern
     */
    static async delete(key) {
        try {
            if (key.includes('*')) {
                // Pattern matching for bulk delete
                const pattern = key.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                const result = await ApiCache.deleteMany({ key: { $regex: regex } });
                console.log(`[Cache DELETE] Pattern ${key} - ${result.deletedCount} entries removed`);
            } else {
                const result = await ApiCache.deleteOne({ key });
                console.log(`[Cache DELETE] ${key} - ${result.deletedCount ? 'Success' : 'Not found'}`);
            }
        } catch (error) {
            console.error(`[Cache Error] Failed to delete ${key}:`, error.message);
        }
    }

    /**
     * Clear all cache for a category
     * @param {string} category - Category to clear
     */
    static async clearCategory(category) {
        try {
            const result = await ApiCache.deleteMany({ category });
            console.log(`[Cache CLEAR] Category ${category} - ${result.deletedCount} entries removed`);
        } catch (error) {
            console.error(`[Cache Error] Failed to clear category ${category}:`, error.message);
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    static async getStats() {
        try {
            const total = await ApiCache.countDocuments();
            const byCategory = await ApiCache.aggregate([
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 },
                        oldestEntry: { $min: '$createdAt' },
                        newestEntry: { $max: '$createdAt' }
                    }
                }
            ]);

            const expired = await ApiCache.countDocuments({
                expiresAt: { $lt: new Date() }
            });

            return {
                total,
                active: total - expired,
                expired,
                byCategory: byCategory.reduce((acc, item) => {
                    acc[item._id] = {
                        count: item.count,
                        oldestEntry: item.oldestEntry,
                        newestEntry: item.newestEntry
                    };
                    return acc;
                }, {})
            };
        } catch (error) {
            console.error('[Cache Error] Failed to get stats:', error.message);
            return null;
        }
    }

    /**
     * Cleanup expired entries manually
     */
    static async cleanup() {
        try {
            const result = await ApiCache.deleteMany({
                expiresAt: { $lt: new Date() }
            });
            console.log(`[Cache CLEANUP] Removed ${result.deletedCount} expired entries`);
            return result.deletedCount;
        } catch (error) {
            console.error('[Cache Error] Cleanup failed:', error.message);
            return 0;
        }
    }
}

module.exports = { CacheManager, ApiCache };