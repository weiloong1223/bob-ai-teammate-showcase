/**
 * Bob: Your AI Teammate - State Manager
 * Centralized state management for the application
 */

const StateManager = {
    // Application state
    state: {
        // Current section
        currentSection: 'landing',
        
        // Scenario state
        currentScenario: 'github-integration',
        scenarioData: null,
        
        // Playback state
        isPlaying: false,
        isPaused: false,
        playbackSpeed: 1.0,
        
        // Phase state
        currentPhase: 0,
        phaseProgress: 0,
        
        // Time tracking
        elapsedTime: 0,
        startTime: null,
        
        // Metrics
        metrics: {
            timeElapsed: 0,
            timeSaved: 0,
            efficiencyGain: 0,
            toolsUsed: 0,
            modeSwitches: 0,
            filesModified: 0,
            linesAdded: 0,
            testsCreated: 0,
            bugsPrevented: 0
        },
        
        // UI state
        ui: {
            splitScreenMode: true,
            showMetrics: true,
            showToolTracker: true,
            showReasoning: true
        },
        
        // Tools tracking
        toolsUsed: [],
        
        // Mode tracking
        currentMode: 'plan',
        modeHistory: []
    },
    
    // Observers for state changes
    observers: {},
    
    /**
     * Initialize the state manager
     */
    init() {
        console.log('🔧 State Manager initialized');
        
        // Load saved state from localStorage if available
        this.loadState();
        
        // Set up auto-save
        this.setupAutoSave();
    },
    
    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return { ...this.state };
    },
    
    /**
     * Update state
     * @param {Object} updates - State updates
     */
    setState(updates) {
        const oldState = { ...this.state };
        
        // Deep merge updates into state
        this.state = this.deepMerge(this.state, updates);
        
        // Notify observers
        this.notifyObservers(oldState, this.state);
        
        // Save to localStorage
        this.saveState();
    },
    
    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }
        
        this.observers[key].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.observers[key] = this.observers[key].filter(cb => cb !== callback);
        };
    },
    
    /**
     * Notify observers of state changes
     * @param {Object} oldState - Previous state
     * @param {Object} newState - New state
     */
    notifyObservers(oldState, newState) {
        Object.keys(this.observers).forEach(key => {
            const oldValue = this.getNestedValue(oldState, key);
            const newValue = this.getNestedValue(newState, key);
            
            if (oldValue !== newValue) {
                this.observers[key].forEach(callback => {
                    callback(newValue, oldValue);
                });
            }
        });
    },
    
    /**
     * Reset state to initial values
     */
    resetState() {
        this.state = {
            currentSection: 'landing',
            currentScenario: 'github-integration',
            scenarioData: null,
            isPlaying: false,
            isPaused: false,
            playbackSpeed: 1.0,
            currentPhase: 0,
            phaseProgress: 0,
            elapsedTime: 0,
            startTime: null,
            metrics: {
                timeElapsed: 0,
                timeSaved: 0,
                efficiencyGain: 0,
                toolsUsed: 0,
                modeSwitches: 0,
                filesModified: 0,
                linesAdded: 0,
                testsCreated: 0,
                bugsPrevented: 0
            },
            ui: {
                splitScreenMode: true,
                showMetrics: true,
                showToolTracker: true,
                showReasoning: true
            },
            toolsUsed: [],
            currentMode: 'plan',
            modeHistory: []
        };
        
        this.saveState();
    },
    
    /**
     * Update metrics
     * @param {Object} metricUpdates - Metric updates
     */
    updateMetrics(metricUpdates) {
        this.setState({
            metrics: {
                ...this.state.metrics,
                ...metricUpdates
            }
        });
    },
    
    /**
     * Add a tool to the used tools list
     * @param {Object} tool - Tool information
     */
    addToolUsed(tool) {
        const toolsUsed = [...this.state.toolsUsed, {
            ...tool,
            timestamp: Date.now()
        }];
        
        this.setState({
            toolsUsed,
            metrics: {
                ...this.state.metrics,
                toolsUsed: toolsUsed.length
            }
        });
    },
    
    /**
     * Switch mode
     * @param {string} mode - New mode
     */
    switchMode(mode) {
        const modeHistory = [...this.state.modeHistory, {
            mode: this.state.currentMode,
            timestamp: Date.now()
        }];
        
        this.setState({
            currentMode: mode,
            modeHistory,
            metrics: {
                ...this.state.metrics,
                modeSwitches: modeHistory.length
            }
        });
    },
    
    /**
     * Update phase
     * @param {number} phaseIndex - Phase index
     * @param {number} progress - Phase progress (0-1)
     */
    updatePhase(phaseIndex, progress = 0) {
        this.setState({
            currentPhase: phaseIndex,
            phaseProgress: progress
        });
    },
    
    /**
     * Update elapsed time
     * @param {number} time - Elapsed time in minutes
     */
    updateElapsedTime(time) {
        this.setState({
            elapsedTime: time,
            metrics: {
                ...this.state.metrics,
                timeElapsed: Math.floor(time)
            }
        });
    },
    
    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            const stateToSave = {
                currentScenario: this.state.currentScenario,
                playbackSpeed: this.state.playbackSpeed,
                ui: this.state.ui
            };
            localStorage.setItem('bob-showcase-state', JSON.stringify(stateToSave));
        } catch (error) {
            console.warn('Failed to save state:', error);
        }
    },
    
    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('bob-showcase-state');
            if (saved) {
                const savedState = JSON.parse(saved);
                this.state = this.deepMerge(this.state, savedState);
            }
        } catch (error) {
            console.warn('Failed to load state:', error);
        }
    },
    
    /**
     * Setup auto-save
     */
    setupAutoSave() {
        // Save state every 30 seconds
        setInterval(() => {
            this.saveState();
        }, 30000);
        
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    },
    
    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    deepMerge(target, source) {
        const output = { ...target };
        
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        output[key] = source[key];
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    output[key] = source[key];
                }
            });
        }
        
        return output;
    },
    
    /**
     * Check if value is an object
     * @param {*} item - Item to check
     * @returns {boolean} True if object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },
    
    /**
     * Get nested value from object
     * @param {Object} obj - Object to search
     * @param {string} path - Dot-notation path
     * @returns {*} Value at path
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    },
    
    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        return {
            state: this.getState(),
            observers: Object.keys(this.observers).map(key => ({
                key,
                count: this.observers[key].length
            })),
            localStorage: localStorage.getItem('bob-showcase-state')
        };
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StateManager.init());
} else {
    StateManager.init();
}

// Export for use in other modules
window.StateManager = StateManager;

// Made with Bob
