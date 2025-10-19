const BaseApiService = require('./BaseApiService');

class GoldService extends BaseApiService {
    constructor() {
        super('goldRates');
        this.apiKey = process.env.GOLDAPI_KEY;
        this.baseUrl = 'https://www.goldapi.io/api';
        this.metals = this.config.metals || ['gold', 'silver'];
        this.currency = 'INR';
        
        // Metal names in Gujarati
        this.gujaratiMetals = {
            'gold': 'સોનું',
            'silver': 'ચાંદી',
            'platinum': 'પ્લેટિનમ',
            'palladium': 'પેલેડિયમ'
        };

        // Weight units
        this.weightUnits = {
            '10_gm': '10 ગ્રામ',
            '1_oz': '1 ઔંસ',
            '1_gm': '1 ગ્રામ',
            '1_tola': '1 તોલા (11.66 ગ્રામ)'
        };
    }

    /**
     * Fetch gold and silver rates
     */
    async fetchData() {
        const ratesPromises = this.metals.map(metal => this.fetchMetalRate(metal));
        const ratesResults = await Promise.allSettled(ratesPromises);

        const ratesData = ratesResults.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Rate fetch failed for ${this.metals[index]}:`, result.reason.message);
                return this.getMockMetalData(this.metals[index]);
            }
        });

        return {
            metals: ratesData,
            currency: this.currency,
            lastUpdated: new Date().toISOString(),
            marketStatus: this.getMarketStatus(),
            disclaimer: 'Rates are indicative and may vary by dealer. Please check with local dealers for exact rates.'
        };
    }

    /**
     * Fetch rate for a specific metal
     * @param {string} metal 
     */
    async fetchMetalRate(metal) {
        if (!this.apiKey) {
            console.warn('GoldAPI key not configured, using mock data');
            return this.getMockMetalData(metal);
        }

        try {
            const response = await this.axios.get(`${this.baseUrl}/${metal}/${this.currency}`, {
                headers: {
                    'x-access-token': this.apiKey
                }
            });

            const data = response.data;
            return {
                metal: metal,
                metalGujarati: this.gujaratiMetals[metal],
                currency: this.currency,
                rates: {
                    current: data.price,
                    previous: data.prev_close_price,
                    change: data.ch,
                    changePercent: data.chp,
                    high: data.high_price,
                    low: data.low_price,
                    open: data.open_price
                },
                weightRates: this.calculateWeightRates(data.price, metal),
                timestamp: data.timestamp || Date.now(),
                market: data.market || 'COMEX'
            };
        } catch (error) {
            console.error(`Failed to fetch ${metal} rates:`, error.message);
            return this.getMockMetalData(metal);
        }
    }

    /**
     * Calculate rates for different weights
     * @param {number} pricePerOz 
     * @param {string} metal 
     */
    calculateWeightRates(pricePerOz, metal) {
        const pricePerGram = pricePerOz / 31.1035; // Convert oz to gram
        
        const rates = {
            '1_gm': Math.round(pricePerGram),
            '10_gm': Math.round(pricePerGram * 10),
            '1_oz': Math.round(pricePerOz),
            '1_tola': Math.round(pricePerGram * 11.66) // 1 tola = 11.66 grams
        };

        // Add specific Indian units for gold
        if (metal === 'gold') {
            rates['8_gm'] = Math.round(pricePerGram * 8); // Common in India
            rates['1_sovereign'] = Math.round(pricePerGram * 8); // 1 sovereign = 8 grams
        }

        return rates;
    }

    /**
     * Get market status (open/closed)
     */
    getMarketStatus() {
        const now = new Date();
        const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const hour = istTime.getHours();
        const day = istTime.getDay();

        // Simplified market hours (actual commodity markets have complex schedules)
        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = hour >= 9 && hour <= 23;

        return {
            status: (isWeekday && isMarketHours) ? 'open' : 'closed',
            nextOpen: !isWeekday ? 'Monday 9:00 AM IST' : 
                     hour >= 23 ? 'Tomorrow 9:00 AM IST' : 
                     hour < 9 ? 'Today 9:00 AM IST' : null,
            timezone: 'IST'
        };
    }

    /**
     * Get mock data for a metal (fallback)
     */
    getMockMetalData(metal) {
        const mockRates = {
            'gold': {
                current: 6250, // ₹ per gram
                previous: 6200,
                change: 50,
                changePercent: 0.81,
                high: 6280,
                low: 6180,
                open: 6200
            },
            'silver': {
                current: 78, // ₹ per gram
                previous: 76,
                change: 2,
                changePercent: 2.63,
                high: 79,
                low: 75,
                open: 76
            }
        };

        const rates = mockRates[metal] || mockRates['gold'];
        
        return {
            metal: metal,
            metalGujarati: this.gujaratiMetals[metal],
            currency: this.currency,
            rates: rates,
            weightRates: this.calculateWeightRates(rates.current * 31.1035, metal), // Convert back to oz for calculation
            timestamp: Date.now(),
            market: 'MCX',
            mock: true
        };
    }

    /**
     * Get historical rates (if API supports)
     * @param {string} metal 
     * @param {string} date 
     */
    async getHistoricalRates(metal, date) {
        if (!this.apiKey) {
            return null;
        }

        try {
            const response = await this.axios.get(`${this.baseUrl}/${metal}/${this.currency}/${date}`, {
                headers: {
                    'x-access-token': this.apiKey
                }
            });

            return {
                metal: metal,
                date: date,
                price: response.data.price,
                currency: this.currency
            };
        } catch (error) {
            console.error(`Failed to fetch historical rates for ${metal} on ${date}:`, error.message);
            return null;
        }
    }

    /**
     * Get cache key for specific metal
     */
    getCacheKey(metal = '', date = null) {
        if (metal) {
            return super.getCacheKey(metal.toLowerCase(), date);
        }
        return super.getCacheKey('all', date);
    }

    /**
     * Get rates for specific metal with caching
     */
    async getMetalData(metal, forceRefresh = false) {
        const cacheKey = this.getCacheKey(metal);

        if (!forceRefresh) {
            const cachedData = await this.getFromCache(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        try {
            const metalRates = await this.fetchMetalRate(metal);
            await this.saveToCache(cacheKey, metalRates, this.config.source);
            return this.formatResponse(metalRates, this.config.source);
        } catch (error) {
            return await this.handleError(error, cacheKey);
        }
    }

    /**
     * Calculate investment value
     * @param {string} metal 
     * @param {number} weight 
     * @param {string} unit 
     * @param {number} currentRate 
     */
    calculateInvestmentValue(metal, weight, unit = 'gm', currentRate) {
        const pricePerGram = unit === 'oz' ? currentRate / 31.1035 : 
                           unit === 'tola' ? currentRate / 11.66 : currentRate;
        
        return {
            metal: metal,
            weight: weight,
            unit: unit,
            currentValue: Math.round(pricePerGram * weight),
            pricePerUnit: Math.round(pricePerGram),
            currency: this.currency
        };
    }
}

module.exports = GoldService;