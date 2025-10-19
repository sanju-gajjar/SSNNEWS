const BaseApiService = require('./BaseApiService');

class WeatherService extends BaseApiService {
    constructor() {
        super('weather');
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.cities = this.config.cities || ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];
    }

    /**
     * Fetch weather data for all configured cities
     */
    async fetchData() {
        if (!this.apiKey) {
            throw new Error('OpenWeather API key not configured');
        }

        const weatherPromises = this.cities.map(city => this.fetchCityWeather(city));
        const weatherResults = await Promise.allSettled(weatherPromises);

        const weatherData = weatherResults.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Weather fetch failed for ${this.cities[index]}:`, result.reason.message);
                return this.getMockCityData(this.cities[index]);
            }
        });

        return {
            cities: weatherData,
            summary: this.generateSummary(weatherData),
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Fetch weather for a specific city
     * @param {string} city 
     */
    async fetchCityWeather(city) {
        try {
            const response = await this.axios.get(`${this.baseUrl}/weather`, {
                params: {
                    q: `${city},IN`,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            const data = response.data;
            return {
                city: city,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
                windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                windDirection: data.wind.deg,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                cloudiness: data.clouds.all,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
                coordinates: {
                    lat: data.coord.lat,
                    lon: data.coord.lon
                }
            };
        } catch (error) {
            console.error(`Failed to fetch weather for ${city}:`, error.message);
            return this.getMockCityData(city);
        }
    }

    /**
     * Get weather forecast for a city
     * @param {string} city 
     */
    async getForecast(city) {
        if (!this.apiKey) {
            throw new Error('OpenWeather API key not configured');
        }

        try {
            const response = await this.axios.get(`${this.baseUrl}/forecast`, {
                params: {
                    q: `${city},IN`,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            const forecasts = response.data.list.slice(0, 8).map(item => ({
                time: new Date(item.dt * 1000).toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                temperature: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed * 3.6)
            }));

            return {
                city: city,
                forecast: forecasts
            };
        } catch (error) {
            console.error(`Failed to fetch forecast for ${city}:`, error.message);
            return null;
        }
    }

    /**
     * Generate weather summary for Gujarat
     */
    generateSummary(weatherData) {
        const validData = weatherData.filter(city => city.temperature !== undefined);
        
        if (validData.length === 0) {
            return {
                avgTemperature: 'N/A',
                hottestCity: 'N/A',
                coolestCity: 'N/A',
                generalCondition: 'Data unavailable'
            };
        }

        const temperatures = validData.map(city => city.temperature);
        const avgTemp = Math.round(temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length);
        
        const hottestCity = validData.reduce((hottest, city) => 
            city.temperature > hottest.temperature ? city : hottest
        );
        
        const coolestCity = validData.reduce((coolest, city) => 
            city.temperature < coolest.temperature ? city : coolest
        );

        // Determine general condition
        const conditions = validData.map(city => city.description);
        const mostCommonCondition = conditions.reduce((acc, condition) => {
            acc[condition] = (acc[condition] || 0) + 1;
            return acc;
        }, {});
        
        const generalCondition = Object.keys(mostCommonCondition).reduce((a, b) => 
            mostCommonCondition[a] > mostCommonCondition[b] ? a : b
        );

        return {
            avgTemperature: avgTemp,
            hottestCity: hottestCity.city,
            hottestTemp: hottestCity.temperature,
            coolestCity: coolestCity.city,
            coolestTemp: coolestCity.temperature,
            generalCondition: generalCondition
        };
    }

    /**
     * Get mock data for a city (fallback)
     */
    getMockCityData(city) {
        const mockTemps = {
            'Ahmedabad': 32,
            'Surat': 30,
            'Vadodara': 31,
            'Rajkot': 29,
            'Gandhinagar': 33
        };

        return {
            city: city,
            temperature: mockTemps[city] || 30,
            feelsLike: (mockTemps[city] || 30) + 2,
            humidity: 65,
            pressure: 1013,
            visibility: 10,
            windSpeed: 12,
            windDirection: 230,
            description: 'partly cloudy',
            icon: '02d',
            cloudiness: 40,
            sunrise: '06:30:00',
            sunset: '18:45:00',
            coordinates: { lat: 23.0225, lon: 72.5714 }
        };
    }

    /**
     * Get cache key for specific city
     */
    getCacheKey(city = '', date = null) {
        if (city) {
            return super.getCacheKey(city.toLowerCase(), date);
        }
        return super.getCacheKey('all', date);
    }

    /**
     * Get weather for specific city with caching
     */
    async getCityData(city, forceRefresh = false) {
        const cacheKey = this.getCacheKey(city);

        if (!forceRefresh) {
            const cachedData = await this.getFromCache(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        try {
            const cityWeather = await this.fetchCityWeather(city);
            await this.saveToCache(cacheKey, cityWeather, this.config.source);
            return this.formatResponse(cityWeather, this.config.source);
        } catch (error) {
            return await this.handleError(error, cacheKey);
        }
    }
}

module.exports = WeatherService;