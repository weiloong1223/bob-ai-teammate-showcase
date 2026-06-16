/**
 * Bob: Your AI Teammate - Scenario Engine
 * Orchestrates scenario playback and phase progression
 */

const ScenarioEngine = {
    // Current scenario data
    scenario: null,
    
    // Playback state
    isPlaying: false,
    isPaused: false,
    currentPhaseIndex: 0,
    phaseProgress: 0,
    
    // Timing
    startTime: null,
    elapsedTime: 0,
    animationFrame: null,
    lastUpdate: null,
    
    /**
     * Initialize the scenario engine
     */
    init() {
        console.log('🎬 Scenario Engine initialized');
    },
    
    /**
     * Load scenario data
     * @param {string} scenarioId - Scenario ID to load
     */
    async loadScenario(scenarioId) {
        try {
            const response = await fetch(`assets/data/${scenarioId}-scenario.json`);
            if (!response.ok) {
                throw new Error(`Failed to load scenario: ${response.statusText}`);
            }
            
            this.scenario = await response.json();
            console.log(`✅ Loaded scenario: ${this.scenario.title}`);
            
            // Update state
            if (window.StateManager) {
                window.StateManager.setState({
                    scenarioData: this.scenario,
                    currentScenario: scenarioId
                });
            }
            
            return this.scenario;
        } catch (error) {
            console.error('Failed to load scenario:', error);
            // Fallback to embedded data
            this.scenario = this.getDefaultScenario();
            return this.scenario;
        }
    },
    
    /**
     * Start scenario playback
     * @param {Object} scenarioData - Optional scenario data
     */
    start(scenarioData = null) {
        if (scenarioData) {
            this.scenario = scenarioData;
        }
        
        if (!this.scenario) {
            console.error('No scenario loaded');
            return;
        }
        
        console.log('▶️ Starting scenario playback');
        
        this.isPlaying = true;
        this.isPaused = false;
        this.currentPhaseIndex = 0;
        this.phaseProgress = 0;
        this.elapsedTime = 0;
        this.startTime = Date.now();
        this.lastUpdate = Date.now();
        
        // Update state
        if (window.StateManager) {
            window.StateManager.setState({
                isPlaying: true,
                isPaused: false,
                currentPhase: 0,
                phaseProgress: 0,
                elapsedTime: 0,
                startTime: this.startTime
            });
        }
        
        // Start first phase
        this.startPhase(0);
        
        // Start animation loop
        this.animate();
    },
    
    /**
     * Pause scenario playback
     */
    pause() {
        console.log('⏸️ Pausing scenario');
        this.isPaused = true;
        
        if (window.StateManager) {
            window.StateManager.setState({ isPaused: true, isPlaying: false });
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    },
    
    /**
     * Resume scenario playback
     */
    resume() {
        console.log('▶️ Resuming scenario');
        this.isPaused = false;
        this.lastUpdate = Date.now();
        
        if (window.StateManager) {
            window.StateManager.setState({ isPaused: false, isPlaying: true });
        }
        
        this.animate();
    },
    
    /**
     * Stop scenario playback
     */
    stop() {
        console.log('⏹️ Stopping scenario');
        this.isPlaying = false;
        this.isPaused = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        if (window.StateManager) {
            window.StateManager.setState({
                isPlaying: false,
                isPaused: false
            });
        }
    },
    
    /**
     * Restart scenario from beginning
     */
    restart() {
        console.log('🔄 Restarting scenario');
        this.stop();
        this.start(this.scenario);
    },
    
    /**
     * Jump to a specific phase
     * @param {number} phaseIndex - Phase index to jump to
     */
    jumpToPhase(phaseIndex) {
        if (!this.scenario || phaseIndex < 0 || phaseIndex >= this.scenario.phases.length) {
            console.error('Invalid phase index:', phaseIndex);
            return;
        }
        
        console.log(`⏭️ Jumping to phase ${phaseIndex}`);
        
        this.currentPhaseIndex = phaseIndex;
        this.phaseProgress = 0;
        
        // Calculate elapsed time up to this phase
        let timeToPhase = 0;
        for (let i = 0; i < phaseIndex; i++) {
            timeToPhase += this.scenario.phases[i].duration;
        }
        this.elapsedTime = timeToPhase;
        
        this.startPhase(phaseIndex);
    },
    
    /**
     * Start a specific phase
     * @param {number} phaseIndex - Phase index to start
     */
    startPhase(phaseIndex) {
        const phase = this.scenario.phases[phaseIndex];
        if (!phase) {
            console.error('Phase not found:', phaseIndex);
            return;
        }
        
        console.log(`🎯 Starting phase: ${phase.name}`);
        
        this.currentPhaseIndex = phaseIndex;
        this.phaseProgress = 0;
        
        // Update state
        if (window.StateManager) {
            window.StateManager.setState({
                currentPhase: phaseIndex,
                phaseProgress: 0,
                currentMode: phase.mode
            });
        }
        
        // Notify phase controller
        if (window.PhaseController) {
            window.PhaseController.switchToPhase(phaseIndex);
        }
    },
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying || this.isPaused) {
            return;
        }
        
        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
        this.lastUpdate = now;
        
        // Get playback speed
        const speed = window.StateManager ? 
            window.StateManager.state.playbackSpeed : 1.0;
        
        // Update progress
        this.updateProgress(deltaTime * speed);
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    },
    
    /**
     * Update scenario progress
     * @param {number} deltaTime - Time elapsed since last update (seconds)
     */
    updateProgress(deltaTime) {
        const currentPhase = this.scenario.phases[this.currentPhaseIndex];
        if (!currentPhase) return;
        
        // Convert delta to minutes
        const deltaMinutes = deltaTime / 60;
        
        // Update phase progress
        this.phaseProgress += deltaMinutes / currentPhase.duration;
        this.elapsedTime += deltaMinutes;
        
        // Update state
        if (window.StateManager) {
            window.StateManager.updateElapsedTime(this.elapsedTime);
            window.StateManager.updatePhase(this.currentPhaseIndex, this.phaseProgress);
        }
        
        // Update UI
        if (window.UIComponents) {
            window.UIComponents.updateProgress(this.phaseProgress);
        }
        
        // Check if phase is complete
        if (this.phaseProgress >= 1.0) {
            this.completePhase();
        }
    },
    
    /**
     * Complete current phase and move to next
     */
    completePhase() {
        console.log(`✅ Phase ${this.currentPhaseIndex} complete`);
        
        // Check if this was the last phase
        if (this.currentPhaseIndex >= this.scenario.phases.length - 1) {
            this.completeScenario();
            return;
        }
        
        // Move to next phase
        this.startPhase(this.currentPhaseIndex + 1);
    },
    
    /**
     * Complete the entire scenario
     */
    completeScenario() {
        console.log('🎉 Scenario complete!');
        
        this.stop();
        
        // Show completion screen
        if (window.App) {
            window.App.showCompletion();
        }
    },
    
    /**
     * Get current phase data
     * @returns {Object} Current phase data
     */
    getCurrentPhase() {
        return this.scenario?.phases[this.currentPhaseIndex] || null;
    },
    
    /**
     * Get default scenario (fallback)
     * @returns {Object} Default scenario data
     */
    getDefaultScenario() {
        return {
            id: 'github-integration',
            title: 'Add GitHub Integration',
            totalTime: 27,
            phases: [
                { name: 'Planning', duration: 2, icon: '🎯', mode: 'plan' },
                { name: 'Research', duration: 3, icon: '🔍', mode: 'advanced' },
                { name: 'Coding', duration: 8, icon: '💻', mode: 'code' },
                { name: 'Review', duration: 4, icon: '🔍', mode: 'advanced' },
                { name: 'Testing', duration: 5, icon: '🧪', mode: 'code' },
                { name: 'Deployment', duration: 3, icon: '🚀', mode: 'advanced' },
                { name: 'Documentation', duration: 2, icon: '📚', mode: 'plan' }
            ]
        };
    },
    
    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        return {
            scenario: this.scenario?.id,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentPhase: this.currentPhaseIndex,
            phaseProgress: this.phaseProgress,
            elapsedTime: this.elapsedTime
        };
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ScenarioEngine.init());
} else {
    ScenarioEngine.init();
}

// Export for use in other modules
window.ScenarioEngine = ScenarioEngine;

// Made with Bob