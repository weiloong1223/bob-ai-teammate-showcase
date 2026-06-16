/**
 * Bob: Your AI Teammate - UI Components
 * UI component logic and updates
 */

const UIComponents = {
    // Cached elements
    elements: {},
    
    // Update intervals
    intervals: {},
    
    /**
     * Initialize UI components
     */
    init() {
        console.log('🎨 UI Components initialized');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Subscribe to state changes
        this.subscribeToState();
        
        // Initialize components
        this.initializeMetricsDashboard();
        this.initializeProgressBar();
    },
    
    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Metrics
            timeElapsed: document.getElementById('time-elapsed'),
            timeSaved: document.getElementById('time-saved'),
            efficiencyGain: document.getElementById('efficiency-gain'),
            toolsUsed: document.getElementById('tools-used'),
            modeSwitches: document.getElementById('mode-switches'),
            filesModified: document.getElementById('files-modified'),
            linesAdded: document.getElementById('lines-added'),
            testsCreated: document.getElementById('tests-created'),
            bugsPrevented: document.getElementById('bugs-prevented'),
            
            // Progress
            progressBar: document.querySelector('.progress-bar'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            
            // Phase info
            currentPhaseTitle: document.getElementById('current-phase-title'),
            phaseDescription: document.getElementById('phase-description'),
            
            // Time display
            timeDisplay: document.getElementById('time-display')
        };
    },
    
    /**
     * Subscribe to state changes
     */
    subscribeToState() {
        if (!window.StateManager) return;
        
        // Subscribe to metrics updates
        window.StateManager.subscribe('metrics', (metrics) => {
            this.updateMetrics(metrics);
        });
        
        // Subscribe to elapsed time updates
        window.StateManager.subscribe('elapsedTime', (time) => {
            this.updateTimeDisplay(time);
        });
        
        // Subscribe to phase progress
        window.StateManager.subscribe('phaseProgress', (progress) => {
            this.updateProgress(progress);
        });
    },
    
    /**
     * Initialize metrics dashboard
     */
    initializeMetricsDashboard() {
        // Set initial values
        this.updateMetrics({
            timeElapsed: 0,
            timeSaved: 0,
            efficiencyGain: 0,
            toolsUsed: 0,
            modeSwitches: 0,
            filesModified: 0,
            linesAdded: 0,
            testsCreated: 0,
            bugsPrevented: 0
        });
    },
    
    /**
     * Initialize progress bar
     */
    initializeProgressBar() {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = '0%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = '0%';
        }
    },
    
    /**
     * Update metrics display
     * @param {Object} metrics - Metrics object
     */
    updateMetrics(metrics) {
        // Time elapsed
        if (this.elements.timeElapsed && metrics.timeElapsed !== undefined) {
            this.animateMetric(this.elements.timeElapsed, metrics.timeElapsed, 'min');
        }
        
        // Time saved
        if (this.elements.timeSaved && metrics.timeSaved !== undefined) {
            this.animateMetric(this.elements.timeSaved, metrics.timeSaved, 'min');
        }
        
        // Efficiency gain
        if (this.elements.efficiencyGain && metrics.efficiencyGain !== undefined) {
            this.animateMetric(this.elements.efficiencyGain, metrics.efficiencyGain, 'x', 1);
        }
        
        // Tools used
        if (this.elements.toolsUsed && metrics.toolsUsed !== undefined) {
            this.animateMetric(this.elements.toolsUsed, metrics.toolsUsed);
        }
        
        // Mode switches
        if (this.elements.modeSwitches && metrics.modeSwitches !== undefined) {
            this.animateMetric(this.elements.modeSwitches, metrics.modeSwitches);
        }
        
        // Files modified
        if (this.elements.filesModified && metrics.filesModified !== undefined) {
            this.animateMetric(this.elements.filesModified, metrics.filesModified);
        }
        
        // Lines added
        if (this.elements.linesAdded && metrics.linesAdded !== undefined) {
            this.animateMetric(this.elements.linesAdded, metrics.linesAdded);
        }
        
        // Tests created
        if (this.elements.testsCreated && metrics.testsCreated !== undefined) {
            this.animateMetric(this.elements.testsCreated, metrics.testsCreated);
        }
        
        // Bugs prevented
        if (this.elements.bugsPrevented && metrics.bugsPrevented !== undefined) {
            this.animateMetric(this.elements.bugsPrevented, metrics.bugsPrevented);
        }
    },
    
    /**
     * Animate a metric value
     * @param {HTMLElement} element - Element to update
     * @param {number} value - Target value
     * @param {string} suffix - Optional suffix
     * @param {number} decimals - Number of decimal places
     */
    animateMetric(element, value, suffix = '', decimals = 0) {
        if (!element) return;
        
        const currentValue = parseFloat(element.textContent) || 0;
        
        if (window.Animations) {
            window.Animations.animateCounter(element, currentValue, value, 1000, {
                suffix,
                decimals
            });
        } else {
            // Fallback without animation
            element.textContent = value.toFixed(decimals) + suffix;
        }
    },
    
    /**
     * Update time display
     * @param {number} minutes - Time in minutes
     */
    updateTimeDisplay(minutes) {
        if (!this.elements.timeDisplay) return;
        
        const formatted = window.Utils ? 
            window.Utils.formatTime(minutes) : 
            `${Math.floor(minutes)}:${Math.floor((minutes % 1) * 60).toString().padStart(2, '0')}`;
        
        this.elements.timeDisplay.textContent = formatted;
    },
    
    /**
     * Update progress bar
     * @param {number} progress - Progress value (0-1)
     */
    updateProgress(progress) {
        const percentage = Math.min(Math.max(progress * 100, 0), 100);
        
        if (this.elements.progressFill) {
            if (window.Animations) {
                window.Animations.animateProgress(this.elements.progressFill, progress, 300);
            } else {
                this.elements.progressFill.style.width = `${percentage}%`;
            }
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${Math.floor(percentage)}%`;
        }
    },
    
    /**
     * Update phase title
     * @param {string} title - Phase title
     */
    updatePhaseTitle(title) {
        if (this.elements.currentPhaseTitle) {
            this.elements.currentPhaseTitle.textContent = title;
        }
    },
    
    /**
     * Update phase description
     * @param {string} description - Phase description
     */
    updatePhaseDescription(description) {
        if (this.elements.phaseDescription) {
            this.elements.phaseDescription.textContent = description;
        }
    },
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     * @param {number} duration - Duration in ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        if (window.Animations) {
            window.Animations.slideInFromTop(notification, 300);
        }
        
        // Remove after duration
        setTimeout(() => {
            if (window.Animations) {
                window.Animations.fadeOut(notification, 300).then(() => {
                    notification.remove();
                });
            } else {
                notification.remove();
            }
        }, duration);
    },
    
    /**
     * Show loading indicator
     * @param {string} message - Loading message
     * @returns {Object} Loading indicator object with hide method
     */
    showLoading(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-message">${message}</div>
        `;
        
        document.body.appendChild(loading);
        
        return {
            hide: () => {
                if (window.Animations) {
                    window.Animations.fadeOut(loading, 300).then(() => {
                        loading.remove();
                    });
                } else {
                    loading.remove();
                }
            },
            updateMessage: (newMessage) => {
                const messageEl = loading.querySelector('.loading-message');
                if (messageEl) {
                    messageEl.textContent = newMessage;
                }
            }
        };
    },
    
    /**
     * Update tool tracker
     * @param {Array} tools - Array of tools
     */
    updateToolTracker(tools) {
        const toolsList = document.getElementById('tools-list');
        if (!toolsList) return;
        
        toolsList.innerHTML = '';
        
        tools.forEach((tool, index) => {
            setTimeout(() => {
                const toolItem = this.createToolItem(tool);
                toolsList.appendChild(toolItem);
            }, index * 100);
        });
    },
    
    /**
     * Create tool item element
     * @param {Object} tool - Tool data
     * @returns {HTMLElement} Tool item element
     */
    createToolItem(tool) {
        const div = document.createElement('div');
        div.className = 'tool-item fade-in';
        
        const statusIcon = tool.status === 'completed' ? '✅' : '⏳';
        
        div.innerHTML = `
            <span class="tool-icon">${statusIcon}</span>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description || ''}</div>
            </div>
        `;
        
        return div;
    },
    
    /**
     * Highlight element
     * @param {HTMLElement} element - Element to highlight
     * @param {number} duration - Duration in ms
     */
    highlightElement(element, duration = 2000) {
        if (!element) return;
        
        element.classList.add('highlight');
        
        setTimeout(() => {
            element.classList.remove('highlight');
        }, duration);
    },
    
    /**
     * Scroll to element
     * @param {HTMLElement} element - Element to scroll to
     * @param {number} offset - Offset from top
     */
    scrollToElement(element, offset = 0) {
        if (!element) return;
        
        if (window.Utils) {
            window.Utils.scrollToElement(element, offset);
        } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    /**
     * Toggle element visibility
     * @param {HTMLElement} element - Element to toggle
     * @param {boolean} show - Show or hide
     */
    toggleElement(element, show) {
        if (!element) return;
        
        if (show) {
            if (window.Animations) {
                window.Animations.fadeIn(element, 300);
            } else {
                element.style.display = 'block';
            }
        } else {
            if (window.Animations) {
                window.Animations.fadeOut(element, 300);
            } else {
                element.style.display = 'none';
            }
        }
    },
    
    /**
     * Update button state
     * @param {HTMLElement} button - Button element
     * @param {string} state - State (loading, success, error, default)
     */
    updateButtonState(button, state) {
        if (!button) return;
        
        button.classList.remove('button-loading', 'button-success', 'button-error');
        
        switch (state) {
            case 'loading':
                button.classList.add('button-loading');
                button.disabled = true;
                break;
            case 'success':
                button.classList.add('button-success');
                button.disabled = false;
                break;
            case 'error':
                button.classList.add('button-error');
                button.disabled = false;
                break;
            default:
                button.disabled = false;
        }
    },
    
    /**
     * Clear all intervals
     */
    clearIntervals() {
        Object.values(this.intervals).forEach(interval => {
            clearInterval(interval);
        });
        this.intervals = {};
    },
    
    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        return {
            cachedElements: Object.keys(this.elements).filter(key => this.elements[key] !== null).length,
            activeIntervals: Object.keys(this.intervals).length
        };
    }
};

// Add notification styles if not already present
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--bg-secondary);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            max-width: 400px;
        }
        
        .notification-success {
            border-left: 4px solid var(--success);
        }
        
        .notification-error {
            border-left: 4px solid var(--danger);
        }
        
        .notification-info {
            border-left: 4px solid var(--primary);
        }
        
        .notification-warning {
            border-left: 4px solid var(--warning);
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            z-index: 10000;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .highlight {
            animation: highlight-pulse 1s ease-in-out;
        }
        
        @keyframes highlight-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
            50% { box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.5); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIComponents.init());
} else {
    UIComponents.init();
}

// Export for use in other modules
window.UIComponents = UIComponents;

// Made with Bob