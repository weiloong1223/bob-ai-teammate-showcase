/**
 * Bob: Your AI Teammate - Utility Functions
 * Helper functions used throughout the application
 */

const Utils = {
    /**
     * Format time in minutes to MM:SS format
     * @param {number} minutes - Time in minutes
     * @returns {string} Formatted time string
     */
    formatTime(minutes) {
        const mins = Math.floor(minutes);
        const secs = Math.floor((minutes - mins) * 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Format large numbers with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    /**
     * Animate a counter from start to end value
     * @param {HTMLElement} element - Element to update
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Animation duration in ms
     * @param {string} suffix - Optional suffix (e.g., 'x', '%')
     */
    animateCounter(element, start, end, duration = 1000, suffix = '') {
        if (!element) return;
        
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    },
    
    /**
     * Create a typing effect for text
     * @param {HTMLElement} element - Element to type into
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed in ms per character
     * @param {Function} callback - Optional callback when complete
     */
    typeText(element, text, speed = 50, callback = null) {
        if (!element) return;
        
        element.textContent = '';
        let index = 0;
        
        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
            } else {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
        
        return timer;
    },
    
    /**
     * Add a CSS class with animation
     * @param {HTMLElement} element - Element to animate
     * @param {string} className - Class name to add
     * @param {number} duration - Duration to keep class (0 = permanent)
     */
    addAnimatedClass(element, className, duration = 0) {
        if (!element) return;
        
        element.classList.add(className);
        
        if (duration > 0) {
            setTimeout(() => {
                element.classList.remove(className);
            }, duration);
        }
    },
    
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Get a random item from an array
     * @param {Array} array - Array to pick from
     * @returns {*} Random item
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Shuffle an array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Wait for a specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after wait time
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if in viewport
     */
    isInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    /**
     * Scroll to element smoothly
     * @param {HTMLElement} element - Element to scroll to
     * @param {number} offset - Offset from top in pixels
     */
    scrollToElement(element, offset = 0) {
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} True if successful
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    },
    
    /**
     * Parse query parameters from URL
     * @returns {Object} Object with query parameters
     */
    getQueryParams() {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        return params;
    },
    
    /**
     * Update URL query parameters without reload
     * @param {Object} params - Parameters to update
     */
    updateQueryParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] === null) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, params[key]);
            }
        });
        window.history.pushState({}, '', url);
    },
    
    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    
    /**
     * Clamp a number between min and max
     * @param {number} num - Number to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped number
     */
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },
    
    /**
     * Linear interpolation between two values
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },
    
    /**
     * Map a value from one range to another
     * @param {number} value - Value to map
     * @param {number} inMin - Input range minimum
     * @param {number} inMax - Input range maximum
     * @param {number} outMin - Output range minimum
     * @param {number} outMax - Output range maximum
     * @returns {number} Mapped value
     */
    map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    
    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * Check if device is touch-enabled
     * @returns {boolean} True if touch-enabled
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    /**
     * Get browser name
     * @returns {string} Browser name
     */
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
        return 'Unknown';
    },
    
    /**
     * Log with timestamp
     * @param {string} message - Message to log
     * @param {string} type - Log type (log, warn, error)
     */
    log(message, type = 'log') {
        const timestamp = new Date().toISOString();
        console[type](`[${timestamp}] ${message}`);
    }
};

// Export for use in other modules
window.Utils = Utils;

// Made with Bob
