const BaseApiService = require('./BaseApiService');

class HoroscopeService extends BaseApiService {
    constructor() {
        super('horoscope');
        this.baseUrl = 'https://aztro.sameerkumar.website';
        this.signs = this.config.signs || [
            'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
            'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
        ];
        
        // Gujarati zodiac names
        this.gujaratiSigns = {
            'aries': 'મેષ',
            'taurus': 'વૃષભ',
            'gemini': 'મિથુન',
            'cancer': 'કર્ક',
            'leo': 'સિંહ',
            'virgo': 'કન્યા',
            'libra': 'તુલા',
            'scorpio': 'વૃશ્ચિક',
            'sagittarius': 'ધનુ',
            'capricorn': 'મકર',
            'aquarius': 'કુંભ',
            'pisces': 'મીન'
        };
    }

    /**
     * Fetch horoscope data for all zodiac signs
     */
    async fetchData() {
        const horoscopePromises = this.signs.map(sign => this.fetchSignHoroscope(sign));
        const horoscopeResults = await Promise.allSettled(horoscopePromises);

        const horoscopeData = horoscopeResults.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Horoscope fetch failed for ${this.signs[index]}:`, result.reason.message);
                return this.getMockSignData(this.signs[index]);
            }
        });

        return {
            signs: horoscopeData,
            date: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Fetch horoscope for a specific zodiac sign
     * @param {string} sign 
     */
    async fetchSignHoroscope(sign) {
        try {
            const response = await this.axios.post(`${this.baseUrl}/?sign=${sign}&day=today`);
            
            const data = response.data;
            return {
                sign: sign,
                signGujarati: this.gujaratiSigns[sign],
                date: data.current_date,
                description: data.description,
                compatibility: data.compatibility,
                mood: data.mood,
                color: data.color,
                luckyNumber: data.lucky_number,
                luckyTime: data.lucky_time,
                dateRange: this.getSignDateRange(sign)
            };
        } catch (error) {
            console.error(`Failed to fetch horoscope for ${sign}:`, error.message);
            return this.getMockSignData(sign);
        }
    }

    /**
     * Get weekly horoscope for a sign
     * @param {string} sign 
     */
    async getWeeklyHoroscope(sign) {
        try {
            const response = await this.axios.post(`${this.baseUrl}/?sign=${sign}&day=weekly`);
            
            return {
                sign: sign,
                signGujarati: this.gujaratiSigns[sign],
                period: 'weekly',
                description: response.data.description,
                dateRange: this.getSignDateRange(sign)
            };
        } catch (error) {
            console.error(`Failed to fetch weekly horoscope for ${sign}:`, error.message);
            return null;
        }
    }

    /**
     * Get monthly horoscope for a sign
     * @param {string} sign 
     */
    async getMonthlyHoroscope(sign) {
        try {
            const response = await this.axios.post(`${this.baseUrl}/?sign=${sign}&day=monthly`);
            
            return {
                sign: sign,
                signGujarati: this.gujaratiSigns[sign],
                period: 'monthly',
                description: response.data.description,
                dateRange: this.getSignDateRange(sign)
            };
        } catch (error) {
            console.error(`Failed to fetch monthly horoscope for ${sign}:`, error.message);
            return null;
        }
    }

    /**
     * Get date range for zodiac sign
     */
    getSignDateRange(sign) {
        const ranges = {
            'aries': 'Mar 21 - Apr 19',
            'taurus': 'Apr 20 - May 20',
            'gemini': 'May 21 - Jun 20',
            'cancer': 'Jun 21 - Jul 22',
            'leo': 'Jul 23 - Aug 22',
            'virgo': 'Aug 23 - Sep 22',
            'libra': 'Sep 23 - Oct 22',
            'scorpio': 'Oct 23 - Nov 21',
            'sagittarius': 'Nov 22 - Dec 21',
            'capricorn': 'Dec 22 - Jan 19',
            'aquarius': 'Jan 20 - Feb 18',
            'pisces': 'Feb 19 - Mar 20'
        };
        return ranges[sign] || '';
    }

    /**
     * Get mock data for a zodiac sign (fallback)
     */
    getMockSignData(sign) {
        const mockDescriptions = {
            'aries': 'Today brings new opportunities for leadership. Your energy is high and others will look to you for direction.',
            'taurus': 'Focus on practical matters today. Your steady approach will help you make progress on important projects.',
            'gemini': 'Communication is key today. Reach out to friends and colleagues to share ideas and gather information.',
            'cancer': 'Trust your intuition today. Your emotional intelligence will guide you to make the right decisions.',
            'leo': 'Your creativity is highlighted today. Express yourself boldly and let your natural charisma shine.',
            'virgo': 'Attention to detail pays off today. Take time to review and perfect your work.',
            'libra': 'Balance is important today. Seek harmony in your relationships and surroundings.',
            'scorpio': 'Transformation is in the air. Embrace change and let go of what no longer serves you.',
            'sagittarius': 'Adventure calls to you today. Expand your horizons and explore new possibilities.',
            'capricorn': 'Discipline and patience will help you achieve your goals. Stay focused on long-term objectives.',
            'aquarius': 'Innovation and originality are your strengths today. Think outside the box.',
            'pisces': 'Your compassion and empathy will be appreciated by others. Trust your heart today.'
        };

        const mockColors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'];
        const mockMoods = ['Optimistic', 'Energetic', 'Calm', 'Focused', 'Creative', 'Confident'];

        return {
            sign: sign,
            signGujarati: this.gujaratiSigns[sign],
            date: new Date().toISOString().split('T')[0],
            description: mockDescriptions[sign] || 'Today is a day full of possibilities. Trust yourself and move forward with confidence.',
            compatibility: this.signs[Math.floor(Math.random() * this.signs.length)],
            mood: mockMoods[Math.floor(Math.random() * mockMoods.length)],
            color: mockColors[Math.floor(Math.random() * mockColors.length)],
            luckyNumber: Math.floor(Math.random() * 99) + 1,
            luckyTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            dateRange: this.getSignDateRange(sign)
        };
    }

    /**
     * Get cache key for specific sign
     */
    getCacheKey(sign = '', date = null) {
        if (sign) {
            return super.getCacheKey(sign.toLowerCase(), date);
        }
        return super.getCacheKey('all', date);
    }

    /**
     * Get horoscope for specific sign with caching
     */
    async getSignData(sign, forceRefresh = false) {
        const cacheKey = this.getCacheKey(sign);

        if (!forceRefresh) {
            const cachedData = await this.getFromCache(cacheKey);
            if (cachedData) {
                return cachedData;
            }
        }

        try {
            const signHoroscope = await this.fetchSignHoroscope(sign);
            await this.saveToCache(cacheKey, signHoroscope, this.config.source);
            return this.formatResponse(signHoroscope, this.config.source);
        } catch (error) {
            return await this.handleError(error, cacheKey);
        }
    }

    /**
     * Find zodiac sign by birth date
     * @param {string} birthDate - Date in YYYY-MM-DD format
     * @returns {string} Zodiac sign
     */
    getSignByBirthDate(birthDate) {
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
        
        return 'aries'; // fallback
    }
}

module.exports = HoroscopeService;