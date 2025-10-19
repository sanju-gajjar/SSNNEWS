const cron = require('node-cron');
const { CacheManager } = require('../middleware/cache');
const apiConfig = require('../config/apis.json');

// Import services
const WeatherService = require('../apis/weather');
const HoroscopeService = require('../apis/horoscope');
const GoldService = require('../apis/gold');

class CronManager {
    constructor() {
        this.jobs = new Map();
        this.services = {
            weather: new WeatherService(),
            horoscope: new HoroscopeService(),
            goldRates: new GoldService()
        };
        this.cronConfig = apiConfig.cron;
        this.timezone = this.cronConfig.timezone || 'Asia/Kolkata';
    }

    /**
     * Initialize all cron jobs
     */
    init() {
        if (!this.cronConfig.enabled) {
            console.log('[CRON] Cron jobs are disabled in configuration');
            return;
        }

        console.log(`[CRON] Initializing cron jobs with timezone: ${this.timezone}`);

        // Daily data refresh job
        this.scheduleDailyRefresh();
        
        // Individual service refresh jobs
        this.scheduleWeatherRefresh();
        this.scheduleHoroscopeRefresh();
        this.scheduleGoldRatesRefresh();
        
        // Cache cleanup job
        this.scheduleCacheCleanup();

        console.log(`[CRON] ${this.jobs.size} cron jobs scheduled`);
        this.logScheduledJobs();
    }

    /**
     * Schedule daily refresh for all services
     */
    scheduleDailyRefresh() {
        const schedule = this.cronConfig.dailyRefresh || '0 5 0 * * *'; // 12:05 AM IST daily
        
        const job = cron.schedule(schedule, async () => {
            console.log('[CRON] Starting daily refresh of all external APIs');
            
            const results = {};
            const errors = {};

            // Refresh all enabled services
            for (const [serviceName, service] of Object.entries(this.services)) {
                if (service.isEnabled()) {
                    try {
                        console.log(`[CRON] Refreshing ${serviceName}...`);
                        const data = await service.getData(true); // Force refresh
                        results[serviceName] = {
                            success: true,
                            recordCount: this.getRecordCount(data),
                            lastUpdated: data.lastUpdated
                        };
                        console.log(`[CRON] ✓ ${serviceName} refreshed successfully`);
                    } catch (error) {
                        console.error(`[CRON] ✗ Failed to refresh ${serviceName}:`, error.message);
                        errors[serviceName] = error.message;
                    }
                }
            }

            // Log summary
            const successCount = Object.keys(results).length;
            const errorCount = Object.keys(errors).length;
            console.log(`[CRON] Daily refresh completed: ${successCount} success, ${errorCount} errors`);
            
            if (errorCount > 0) {
                console.error('[CRON] Errors during daily refresh:', errors);
            }
        }, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.set('dailyRefresh', job);
        job.start();
        console.log(`[CRON] Daily refresh scheduled: ${schedule} (${this.timezone})`);
    }

    /**
     * Schedule weather data refresh
     */
    scheduleWeatherRefresh() {
        if (!this.services.weather.isEnabled()) return;

        const schedule = process.env.WEATHER_CRON || '*/30 * * * *'; // Every 30 minutes
        
        const job = cron.schedule(schedule, async () => {
            try {
                console.log('[CRON] Refreshing weather data...');
                await this.services.weather.getData(true);
                console.log('[CRON] ✓ Weather data refreshed');
            } catch (error) {
                console.error('[CRON] ✗ Weather refresh failed:', error.message);
            }
        }, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.set('weatherRefresh', job);
        job.start();
        console.log(`[CRON] Weather refresh scheduled: ${schedule}`);
    }

    /**
     * Schedule horoscope data refresh
     */
    scheduleHoroscopeRefresh() {
        if (!this.services.horoscope.isEnabled()) return;

        const schedule = process.env.HOROSCOPE_CRON || '0 10 0 * * *'; // Daily at 12:10 AM IST
        
        const job = cron.schedule(schedule, async () => {
            try {
                console.log('[CRON] Refreshing horoscope data...');
                await this.services.horoscope.getData(true);
                console.log('[CRON] ✓ Horoscope data refreshed');
            } catch (error) {
                console.error('[CRON] ✗ Horoscope refresh failed:', error.message);
            }
        }, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.set('horoscopeRefresh', job);
        job.start();
        console.log(`[CRON] Horoscope refresh scheduled: ${schedule}`);
    }

    /**
     * Schedule gold rates refresh
     */
    scheduleGoldRatesRefresh() {
        if (!this.services.goldRates.isEnabled()) return;

        const schedule = process.env.GOLD_RATES_CRON || '*/60 * * * *'; // Every hour
        
        const job = cron.schedule(schedule, async () => {
            try {
                console.log('[CRON] Refreshing gold rates...');
                await this.services.goldRates.getData(true);
                console.log('[CRON] ✓ Gold rates refreshed');
            } catch (error) {
                console.error('[CRON] ✗ Gold rates refresh failed:', error.message);
            }
        }, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.set('goldRatesRefresh', job);
        job.start();
        console.log(`[CRON] Gold rates refresh scheduled: ${schedule}`);
    }

    /**
     * Schedule cache cleanup
     */
    scheduleCacheCleanup() {
        const schedule = '0 0 2 * * *'; // Daily at 2:00 AM IST
        
        const job = cron.schedule(schedule, async () => {
            try {
                console.log('[CRON] Starting cache cleanup...');
                const deletedCount = await CacheManager.cleanup();
                console.log(`[CRON] ✓ Cache cleanup completed: ${deletedCount} expired entries removed`);
            } catch (error) {
                console.error('[CRON] ✗ Cache cleanup failed:', error.message);
            }
        }, {
            scheduled: false,
            timezone: this.timezone
        });

        this.jobs.set('cacheCleanup', job);
        job.start();
        console.log(`[CRON] Cache cleanup scheduled: ${schedule}`);
    }

    /**
     * Get record count from service data
     */
    getRecordCount(data) {
        if (!data || !data.data) return 0;
        
        if (Array.isArray(data.data)) return data.data.length;
        if (data.data.cities) return data.data.cities.length;
        if (data.data.signs) return data.data.signs.length;
        if (data.data.metals) return data.data.metals.length;
        
        return 1;
    }

    /**
     * Log all scheduled jobs
     */
    logScheduledJobs() {
        console.log('\n[CRON] Scheduled Jobs Summary:');
        console.log('================================');
        for (const [jobName, job] of this.jobs) {
            const status = job.running ? 'RUNNING' : 'STOPPED';
            console.log(`${jobName.padEnd(20)} | Status: ${status}`);
        }
        console.log('================================\n');
    }

    /**
     * Stop a specific job
     */
    stopJob(jobName) {
        const job = this.jobs.get(jobName);
        if (job) {
            job.stop();
            console.log(`[CRON] Job '${jobName}' stopped`);
        } else {
            console.log(`[CRON] Job '${jobName}' not found`);
        }
    }

    /**
     * Start a specific job
     */
    startJob(jobName) {
        const job = this.jobs.get(jobName);
        if (job) {
            job.start();
            console.log(`[CRON] Job '${jobName}' started`);
        } else {
            console.log(`[CRON] Job '${jobName}' not found`);
        }
    }

    /**
     * Stop all jobs
     */
    stopAll() {
        console.log('[CRON] Stopping all cron jobs...');
        for (const [jobName, job] of this.jobs) {
            job.stop();
            console.log(`[CRON] Stopped job: ${jobName}`);
        }
        console.log('[CRON] All cron jobs stopped');
    }

    /**
     * Get job status
     */
    getJobStatus() {
        const status = {};
        for (const [jobName, job] of this.jobs) {
            status[jobName] = {
                running: job.running,
                nextExecution: job.nextDate ? job.nextDate().toISOString() : null
            };
        }
        return status;
    }

    /**
     * Manually trigger a job
     */
    async triggerJob(jobName) {
        console.log(`[CRON] Manually triggering job: ${jobName}`);
        
        switch (jobName) {
            case 'dailyRefresh':
                // This would duplicate the daily refresh logic
                console.log('[CRON] Triggering daily refresh...');
                // Could extract the daily refresh logic to a separate method
                break;
            case 'weatherRefresh':
                if (this.services.weather.isEnabled()) {
                    await this.services.weather.getData(true);
                    console.log('[CRON] Weather data manually refreshed');
                }
                break;
            case 'horoscopeRefresh':
                if (this.services.horoscope.isEnabled()) {
                    await this.services.horoscope.getData(true);
                    console.log('[CRON] Horoscope data manually refreshed');
                }
                break;
            case 'goldRatesRefresh':
                if (this.services.goldRates.isEnabled()) {
                    await this.services.goldRates.getData(true);
                    console.log('[CRON] Gold rates manually refreshed');
                }
                break;
            case 'cacheCleanup':
                const deletedCount = await CacheManager.cleanup();
                console.log(`[CRON] Manual cache cleanup: ${deletedCount} entries removed`);
                break;
            default:
                console.log(`[CRON] Unknown job: ${jobName}`);
        }
    }
}

// Export singleton instance
const cronManager = new CronManager();

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n[CRON] Received SIGINT, stopping all cron jobs...');
    cronManager.stopAll();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n[CRON] Received SIGTERM, stopping all cron jobs...');
    cronManager.stopAll();
    process.exit(0);
});

module.exports = cronManager;