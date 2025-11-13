// Gujarati translations for SSN News
export const gujaratiTranslations = {
    // Main Navigation Menu
    menu: {
        home: 'મુખ્ય પૃષ્ઠ',
        breaking: 'તાજા સમાચાર',
        national: 'રાષ્ટ્રીય',
        international: 'આંતરરાષ્ટ્રીય',
        state: 'રાજ્ય સમાચાર',
        city: 'શહેર',
        politics: 'રાજકારણ',
        business: 'વ્યવસાય',
        sports: 'રમતગમત',
        entertainment: 'મનોરંજન',
        technology: 'ટેકનોલોજી',
        health: 'આરોગ્ય',
        lifestyle: 'જીવનશૈલી',
        education: 'શિક્ષણ',
        opinion: 'અભિપ્રાય',
        blog: 'બ્લોગ',
        photos: 'તસવીરો',
        videos: 'વીડિયો',
        weather: 'હવામાન',
        contactUs: 'અમારો સંપર્ક કરો',
        aboutUs: 'અમારા વિષે',
        privacyPolicy: 'ગોપનીયતા નીતિ',
        termsConditions: 'નિયમ અને શરતો'
    },

    // Categories for dropdown
    categories: {
        breaking: 'તાજા સમાચાર',
        national: 'રાષ્ટ્રીય',
        international: 'આંતરરાષ્ટ્રીય',
        state: 'રાજ્ય સમાચાર',
        city: 'શહેર',
        politics: 'રાજકારણ',
        business: 'વ્યવસાય',
        sports: 'રમતગમત',
        entertainment: 'મનોરંજન',
        technology: 'ટેકનોલોજી',
        health: 'આરોગ્ય',
        lifestyle: 'જીવનશૈલી',
        education: 'શિક્ષણ',
        opinion: 'અભિપ્રાય',
        blog: 'બ્લોગ',
        photo: 'તસવીરો',
        video: 'વીડિયો',
        weather: 'હવામાન',
        other: 'અન્ય'
    },

    // Common UI labels
    common: {
        all: 'બધા',
        selectCategory: 'શ્રેણી પસંદ કરો',
        search: 'શોધો',
        readMore: 'વધુ વાંચો',
        share: 'શેર કરો',
        like: 'લાઈક',
        comment: 'ટિપ્પણી',
        views: 'જોવાયા',
        published: 'પ્રકાશિત',
        author: 'લેખક',
        loading: 'લોડ થઈ રહ્યું છે...',
        error: 'ભૂલ',
        noNews: 'કોઈ સમાચાર મળ્યા નથી',
        trending: 'ટ્રેન્ડિંગ',
        latest: 'નવીનતમ',
        popular: 'લોકપ્રિય'
    },

    // Admin Panel
    admin: {
        addNews: 'સમાચાર ઉમેરો',
        editNews: 'સમાચાર સંપાદિત કરો',
        deleteNews: 'સમાચાર કાઢી નાખો',
        title: 'શીર્ષક',
        content: 'સામગ્રી',
        category: 'શ્રેણી',
        image: 'છબી',
        video: 'વીડિયો',
        tags: 'ટેગ્સ',
        publish: 'પ્રકાશિત કરો',
        save: 'સાચવો',
        cancel: 'રદ કરો'
    },

    // Footer sections
    footer: {
        quickLinks: 'ઝડપી લિંક્સ',
        followUs: 'અમને અનુસરો',
        contactInfo: 'સંપર્ક માહિતી',
        copyright: '© 2025 SSN News. બધા હક્કો અનામત.'
    }
};

// Category mapping for database values to Gujarati display
export const categoryMap = {
    'breaking': 'તાજા સમાચાર',
    'national': 'રાષ્ટ્રીય',
    'international': 'આંતરરાષ્ટ્રીય',
    'state': 'રાજ્ય સમાચાર',
    'city': 'શહેર',
    'politics': 'રાજકારણ',
    'business': 'વ્યવસાય',
    'sports': 'રમતગમત',
    'entertainment': 'મનોરંજન',
    'technology': 'ટેકનોલોજી',
    'health': 'આરોગ્ય',
    'lifestyle': 'જીવનશૈલી',
    'education': 'શિક્ષણ',
    'opinion': 'અભિપ્રાય',
    'blog': 'બ્લોગ',
    'photo': 'તસવીરો',
    'video': 'વીડિયો',
    'weather': 'હવામાન',
    'other': 'અન્ય'
};

// Menu structure for navigation
export const menuStructure = [
    { key: 'home', label: 'મુખ્ય પૃષ્ઠ', path: '/', icon: 'home' },
    { 
        key: 'news', 
        label: 'સમાચાર', 
        icon: 'newspaper',
        submenu: [
            { key: 'breaking', label: 'તાજા સમાચાર', path: '/news/breaking' },
            { key: 'national', label: 'રાષ્ટ્રીય', path: '/news/national' },
            { key: 'international', label: 'આંતરરાષ્ટ્રીય', path: '/news/international' },
            { key: 'state', label: 'રાજ્ય સમાચાર', path: '/news/state' },
            { key: 'city', label: 'શહેર', path: '/news/city' }
        ]
    },
    { key: 'politics', label: 'રાજકારણ', path: '/news/politics', icon: 'gavel' },
    { key: 'business', label: 'વ્યવસાય', path: '/news/business', icon: 'business' },
    { key: 'sports', label: 'રમતગમત', path: '/news/sports', icon: 'sports' },
    { key: 'entertainment', label: 'મનોરંજન', path: '/news/entertainment', icon: 'movie' },
    { key: 'technology', label: 'ટેકનોલોજી', path: '/news/technology', icon: 'computer' },
    { key: 'health', label: 'આરોગ્ય', path: '/news/health', icon: 'health' },
    { key: 'lifestyle', label: 'જીવનશૈલી', path: '/news/lifestyle', icon: 'lifestyle' },
    { key: 'education', label: 'શિક્ષણ', path: '/news/education', icon: 'school' },
    { key: 'opinion', label: 'અભિપ્રાય', path: '/news/opinion', icon: 'comment' },
    { key: 'blog', label: 'બ્લોગ', path: '/news/blog', icon: 'article' },
    { 
        key: 'media', 
        label: 'મીડિયા', 
        icon: 'perm_media',
        submenu: [
            { key: 'photo', label: 'તસવીરો', path: '/media/photos' },
            { key: 'video', label: 'વીડિયો', path: '/media/videos' }
        ]
    },
    { key: 'weather', label: 'હવામાન', path: '/weather', icon: 'wb_sunny' },
    { 
        key: 'info', 
        label: 'માહિતી', 
        icon: 'info',
        submenu: [
            { key: 'contact', label: 'અમારો સંપર્ક કરો', path: '/contact' },
            { key: 'about', label: 'અમારા વિષે', path: '/about' },
            { key: 'privacy', label: 'ગોપનીયતા નીતિ', path: '/privacy' },
            { key: 'terms', label: 'નિયમ અને શરતો', path: '/terms' }
        ]
    }
];

export default gujaratiTranslations;
