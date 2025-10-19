const axios = require('axios');
const { CacheManager } = require('../middleware/cache');
const apiConfig = require('../config/apis.json');

class BaseApiService {
    constructor(category) {
        this.category = category;
        this.config = apiConfig.apis[category] || {};
        this.cacheEnabled = this.config.cache !== false;
        this.cacheExpiry = this.config.cacheExpiry || 3600;
        
        // Create axios instance with timeout
        this.axios = axios.create({
            timeout: 10000,
            headers: {
                'User-Agent': 'SSNNews/1.0 (https://ssnnews.onrender.com)'
            }
        });

        // Add request interceptor for logging
        this.axios.interceptors.request.use(
            (config) => {
                console.log(`[${this.category.toUpperCase()}] API Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error(`[${this.category.toUpperCase()}] Request Error:`, error.message);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.axios.interceptors.response.use(
            (response) => {
                console.log(`[${this.category.toUpperCase()}] API Response: ${response.status} ${response.statusText}`);
                return response;
            },
            (error) => {
                console.error(`[${this.category.toUpperCase()}] API Error:`, {
                    status: error.response?.status,
                    message: error.message,
                    url: error.config?.url
                });
                return Promise.reject(error);
            }
        );
    }

    /**
     * Check if API is enabled
     * @returns {boolean}
     */
    isEnabled() {
        return this.config.enabled !== false;
    }

    /**
     * Generate cache key for this service
     * @param {string} identifier 
     * @param {string} date 
     * @returns {string}
     */
    getCacheKey(identifier = '', date = null) {
        return CacheManager.generateKey(this.category, identifier, date);
    }

    /**
     * Get data from cache
     * @param {string} key 
     * @returns {Object|null}
     */
    async getFromCache(key) {
        if (!this.cacheEnabled) return null;
        return await CacheManager.get(key);
    }

    /**
     * Save data to cache
     * @param {string} key 
     * @param {*} data 
     * @param {string} source 
     * @param {number} expiry 
     */
    async saveToCache(key, data, source, expiry = null) {
        if (!this.cacheEnabled) return;
        const expirySeconds = expiry || this.cacheExpiry;
        await CacheManager.set(key, data, this.category, source, expirySeconds);
    }

    /**
     * Format response in unified format
     * @param {*} data 
     * @param {string} source 
     * @param {boolean} cached 
     * @param {Date} lastUpdated 
     * @returns {Object}
     */
    formatResponse(data, source, cached = false, lastUpdated = null) {
        return {
            category: this.category,
            date: new Date().toISOString().split('T')[0],
            data: data,
            source: source,
            cached: cached,
            lastUpdated: lastUpdated || new Date(),
            timestamp: Date.now()
        };
    }

    /**
     * Handle API errors with fallback to cache
     * @param {Error} error 
     * @param {string} cacheKey 
     * @returns {Object|null}
     */
    async handleError(error, cacheKey = null) {
        console.error(`[${this.category.toUpperCase()}] Service Error:`, error.message);

        // Try to get stale cache data as fallback
        if (cacheKey && this.cacheEnabled) {
            try {
                const staleData = await CacheManager.get(cacheKey.replace(':' + new Date().toISOString().split('T')[0], ':*'));
                if (staleData) {
                    console.log(`[${this.category.toUpperCase()}] Using stale cache data as fallback`);
                    return {
                        ...staleData,
                        cached: true,
                        stale: true,
                        error: error.message
                    };
                }
            } catch (cacheError) {
                console.error(`[${this.category.toUpperCase()}] Cache fallback failed:`, cacheError.message);
            }
        }

        return {
            category: this.category,
            date: new Date().toISOString().split('T')[0],
            data: null,
            source: 'error',
            cached: false,
            error: error.message,
            timestamp: Date.now()
        };
    }

    /**
     * Abstract method - must be implemented by subclasses
     */
    async fetchData() {
        throw new Error(`fetchData() method must be implemented by ${this.constructor.name}`);
    }

    /**
     * Main method to get data with caching
     * @param {boolean} forceRefresh 
     * @returns {Object}
     */
    async getData(forceRefresh = false) {
        if (!this.isEnabled()) {
            return this.formatResponse(null, 'disabled');
        }

        const cacheKey = this.getCacheKey();

        // Try cache first (unless force refresh)
        if (!forceRefresh) {
            const cachedData = await this.getFromCache(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        try {
            // Fetch fresh data
            const freshData = await this.fetchData();
            
            // Save to cache
            await this.saveToCache(cacheKey, freshData, this.config.source);
            
            return this.formatResponse(freshData, this.config.source);
        } catch (error) {
            return await this.handleError(error, cacheKey);
        }
    }

    /**
     * Get mock/sample data for testing
     */
    getMockData() {
        return {
            category: this.category,
            date: new Date().toISOString().split('T')[0],
            data: { message: 'Mock data for ' + this.category },
            source: 'mock',
            cached: false,
            timestamp: Date.now()
        };
    }
}

module.exports = BaseApiService;