const express = require('express');
const router = express.Router();

// Import API services
const WeatherService = require('../apis/weather');
const HoroscopeService = require('../apis/horoscope');
const GoldService = require('../apis/gold');
// TODO: Import other services as they are created
// const FuelService = require('./fuel');
// const SportsService = require('./sports');
// const EntertainmentService = require('./entertainment');
// const EventsService = require('./events');
// const RSSService = require('./rssGujarati');

// Initialize services
const weatherService = new WeatherService();
const horoscopeService = new HoroscopeService();
const goldService = new GoldService();

// Middleware for API logging
router.use((req, res, next) => {
    console.log(`[EXTERNAL API] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Error handler middleware
const handleApiError = (res, error, service) => {
    console.error(`[${service.toUpperCase()} ERROR]`, error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        service: service,
        timestamp: new Date().toISOString()
    });
};

// ===== WEATHER ROUTES =====

// Get all cities weather
router.get('/weather', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const data = await weatherService.getData(forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'weather');
    }
});

// Get specific city weather
router.get('/weather/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const forceRefresh = req.query.refresh === 'true';
        const data = await weatherService.getCityData(city, forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'weather');
    }
});

// Get weather forecast for a city
router.get('/weather/:city/forecast', async (req, res) => {
    try {
        const { city } = req.params;
        const data = await weatherService.getForecast(city);
        res.json({ 
            success: true, 
            category: 'weather_forecast',
            data: data,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'weather_forecast');
    }
});

// ===== HOROSCOPE ROUTES =====

// Get all zodiac signs horoscope
router.get('/horoscope', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const data = await horoscopeService.getData(forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'horoscope');
    }
});

// Get specific zodiac sign horoscope
router.get('/horoscope/:sign', async (req, res) => {
    try {
        const { sign } = req.params;
        const forceRefresh = req.query.refresh === 'true';
        const data = await horoscopeService.getSignData(sign, forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'horoscope');
    }
});

// Get weekly horoscope for a sign
router.get('/horoscope/:sign/weekly', async (req, res) => {
    try {
        const { sign } = req.params;
        const data = await horoscopeService.getWeeklyHoroscope(sign);
        res.json({ 
            success: true, 
            category: 'horoscope_weekly',
            data: data,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'horoscope_weekly');
    }
});

// Get monthly horoscope for a sign
router.get('/horoscope/:sign/monthly', async (req, res) => {
    try {
        const { sign } = req.params;
        const data = await horoscopeService.getMonthlyHoroscope(sign);
        res.json({ 
            success: true, 
            category: 'horoscope_monthly',
            data: data,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'horoscope_monthly');
    }
});

// Get horoscope by birth date
router.get('/horoscope/birthdate/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const sign = horoscopeService.getSignByBirthDate(date);
        const data = await horoscopeService.getSignData(sign);
        res.json({ 
            success: true, 
            birthDate: date,
            zodiacSign: sign,
            ...data 
        });
    } catch (error) {
        handleApiError(res, error, 'horoscope_birthdate');
    }
});

// ===== GOLD & SILVER RATES ROUTES =====

// Get all metal rates
router.get('/gold-rates', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const data = await goldService.getData(forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'gold_rates');
    }
});

// Get specific metal rates
router.get('/gold-rates/:metal', async (req, res) => {
    try {
        const { metal } = req.params;
        const forceRefresh = req.query.refresh === 'true';
        const data = await goldService.getMetalData(metal, forceRefresh);
        res.json({ success: true, ...data });
    } catch (error) {
        handleApiError(res, error, 'gold_rates');
    }
});

// Get historical rates
router.get('/gold-rates/:metal/history/:date', async (req, res) => {
    try {
        const { metal, date } = req.params;
        const data = await goldService.getHistoricalRates(metal, date);
        res.json({ 
            success: true, 
            category: 'gold_rates_historical',
            data: data,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'gold_rates_historical');
    }
});

// Calculate investment value
router.post('/gold-rates/calculate', async (req, res) => {
    try {
        const { metal, weight, unit, currentRate } = req.body;
        const data = goldService.calculateInvestmentValue(metal, weight, unit, currentRate);
        res.json({ 
            success: true, 
            category: 'gold_investment_calculator',
            data: data,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'gold_investment_calculator');
    }
});

// ===== UNIFIED FEED ROUTE =====

// Get all daily data in unified format
router.get('/feed', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const includeServices = req.query.services ? req.query.services.split(',') : ['weather', 'horoscope', 'goldRates'];
        
        const feedData = {};
        const errors = {};

        // Fetch data from enabled services
        const fetchPromises = [];

        if (includeServices.includes('weather') && weatherService.isEnabled()) {
            fetchPromises.push(
                weatherService.getData(forceRefresh)
                    .then(data => { feedData.weather = data; })
                    .catch(error => { errors.weather = error.message; })
            );
        }

        if (includeServices.includes('horoscope') && horoscopeService.isEnabled()) {
            fetchPromises.push(
                horoscopeService.getData(forceRefresh)
                    .then(data => { feedData.horoscope = data; })
                    .catch(error => { errors.horoscope = error.message; })
            );
        }

        if (includeServices.includes('goldRates') && goldService.isEnabled()) {
            fetchPromises.push(
                goldService.getData(forceRefresh)
                    .then(data => { feedData.goldRates = data; })
                    .catch(error => { errors.goldRates = error.message; })
            );
        }

        // Wait for all services to complete
        await Promise.all(fetchPromises);

        res.json({
            success: true,
            category: 'unified_feed',
            date: new Date().toISOString().split('T')[0],
            data: feedData,
            errors: Object.keys(errors).length > 0 ? errors : undefined,
            includedServices: includeServices,
            timestamp: Date.now(),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        handleApiError(res, error, 'unified_feed');
    }
});

// ===== UTILITY ROUTES =====

// Get service status
router.get('/status', async (req, res) => {
    try {
        const services = {
            weather: {
                enabled: weatherService.isEnabled(),
                name: 'Weather Service',
                endpoints: ['/weather', '/weather/:city', '/weather/:city/forecast']
            },
            horoscope: {
                enabled: horoscopeService.isEnabled(),
                name: 'Horoscope Service',
                endpoints: ['/horoscope', '/horoscope/:sign', '/horoscope/:sign/weekly', '/horoscope/:sign/monthly']
            },
            goldRates: {
                enabled: goldService.isEnabled(),
                name: 'Gold & Silver Rates Service',
                endpoints: ['/gold-rates', '/gold-rates/:metal', '/gold-rates/:metal/history/:date']
            }
        };

        res.json({
            success: true,
            category: 'service_status',
            data: {
                services: services,
                totalServices: Object.keys(services).length,
                enabledServices: Object.values(services).filter(s => s.enabled).length,
                serverTime: new Date().toISOString(),
                uptime: process.uptime()
            },
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'service_status');
    }
});

// Clear cache for specific service or all
router.delete('/cache/:category?', async (req, res) => {
    try {
        const { category } = req.params;
        const { CacheManager } = require('../middleware/cache');

        if (category) {
            await CacheManager.clearCategory(category);
            res.json({ 
                success: true, 
                message: `Cache cleared for category: ${category}`,
                timestamp: Date.now()
            });
        } else {
            // Clear all cache - be careful with this!
            await CacheManager.clearCategory('weather');
            await CacheManager.clearCategory('horoscope');
            await CacheManager.clearCategory('goldRates');
            res.json({ 
                success: true, 
                message: 'All external API cache cleared',
                timestamp: Date.now()
            });
        }
    } catch (error) {
        handleApiError(res, error, 'cache_clear');
    }
});

// Get cache statistics
router.get('/cache/stats', async (req, res) => {
    try {
        const { CacheManager } = require('../middleware/cache');
        const stats = await CacheManager.getStats();
        res.json({ 
            success: true, 
            category: 'cache_stats',
            data: stats,
            timestamp: Date.now()
        });
    } catch (error) {
        handleApiError(res, error, 'cache_stats');
    }
});

module.exports = router;