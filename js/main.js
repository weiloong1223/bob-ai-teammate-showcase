/**
 * Bob: Your AI Teammate - Main Application
 * Entry point for the interactive showcase
 */

// Application state
const app = {
    currentSection: 'landing',
    currentScenario: 'github-integration',
    isPlaying: false,
    playbackSpeed: 1.0,
    currentPhase: 0,
    elapsedTime: 0,
    
    // Initialize the application
    init() {
        console.log('🤖 Bob: Your AI Teammate - Initializing...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load scenario data
        this.loadScenario(this.currentScenario);
        
        // Show landing section
        this.showSection('landing');
        
        console.log('✅ Application initialized successfully');
    },
    
    // Set up all event listeners
    setupEventListeners() {
        // Landing page
        const startBtn = document.getElementById('start-demo-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startDemo());
        }
        
        const scenarioSelect = document.getElementById('scenario-select');
        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => {
                this.currentScenario = e.target.value;
            });
        }
        
        // Demo controls
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartDemo());
        }
        
        const exitBtn = document.getElementById('exit-demo-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitDemo());
        }
        
        const speedSelect = document.getElementById('speed-select');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.playbackSpeed = parseFloat(e.target.value);
            });
        }
        
        // Completion actions
        const replayBtn = document.getElementById('replay-btn');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => this.restartDemo());
        }
        
        const shareLinkedInBtn = document.getElementById('share-linkedin-btn');
        if (shareLinkedInBtn) {
            shareLinkedInBtn.addEventListener('click', () => this.shareOnLinkedIn());
        }
        
        const viewCodeBtn = document.getElementById('view-code-btn');
        if (viewCodeBtn) {
            viewCodeBtn.addEventListener('click', () => this.viewOnGitHub());
        }
        
        const copyShareBtn = document.getElementById('copy-share-btn');
        if (copyShareBtn) {
            copyShareBtn.addEventListener('click', () => this.copyShareText());
        }
        
        // Phase navigation
        const phaseNavItems = document.querySelectorAll('.phase-nav-item');
        phaseNavItems.forEach((item, index) => {
            item.addEventListener('click', () => this.jumpToPhase(index));
        });
    },
    
    // Load scenario data
    loadScenario(scenarioId) {
        console.log(`Loading scenario: ${scenarioId}`);
        // In a real implementation, this would load from JSON files
        // For now, we'll use placeholder data
        this.scenarioData = {
            id: scenarioId,
            title: 'Add GitHub Integration',
            totalTime: 27,
            phases: [
                { name: 'Planning', duration: 2, icon: '🎯' },
                { name: 'Research', duration: 3, icon: '🔍' },
                { name: 'Coding', duration: 8, icon: '💻' },
                { name: 'Review', duration: 4, icon: '🔍' },
                { name: 'Testing', duration: 5, icon: '🧪' },
                { name: 'Deployment', duration: 3, icon: '🚀' },
                { name: 'Documentation', duration: 2, icon: '📚' }
            ]
        };
    },
    
    // Show a specific section
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the requested section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            this.currentSection = sectionId;
        }
    },
    
    // Start the demo
    startDemo() {
        console.log('Starting demo...');
        this.showSection('demo');
        this.isPlaying = true;
        this.currentPhase = 0;
        this.elapsedTime = 0;
        
        // Start the scenario engine
        if (window.ScenarioEngine) {
            window.ScenarioEngine.start(this.scenarioData);
        }
        
        // Update UI
        this.updatePlayPauseButton();
    },
    
    // Toggle play/pause
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
        
        if (window.ScenarioEngine) {
            if (this.isPlaying) {
                window.ScenarioEngine.resume();
            } else {
                window.ScenarioEngine.pause();
            }
        }
    },
    
    // Update play/pause button
    updatePlayPauseButton() {
        const btn = document.getElementById('play-pause-btn');
        if (btn) {
            const icon = btn.querySelector('.play-icon');
            if (icon) {
                icon.textContent = this.isPlaying ? '⏸️' : '▶️';
            }
        }
    },
    
    // Restart the demo
    restartDemo() {
        console.log('Restarting demo...');
        this.currentPhase = 0;
        this.elapsedTime = 0;
        this.isPlaying = true;
        
        if (window.ScenarioEngine) {
            window.ScenarioEngine.restart();
        }
        
        this.showSection('demo');
        this.updatePlayPauseButton();
    },
    
    // Exit the demo
    exitDemo() {
        console.log('Exiting demo...');
        this.isPlaying = false;
        
        if (window.ScenarioEngine) {
            window.ScenarioEngine.stop();
        }
        
        this.showSection('landing');
    },
    
    // Jump to a specific phase
    jumpToPhase(phaseIndex) {
        if (phaseIndex >= 0 && phaseIndex < this.scenarioData.phases.length) {
            this.currentPhase = phaseIndex;
            
            if (window.PhaseController) {
                window.PhaseController.switchToPhase(phaseIndex);
            }
        }
    },
    
    // Show completion screen
    showCompletion() {
        console.log('Demo completed!');
        this.isPlaying = false;
        this.showSection('completion');
        
        // Trigger confetti animation
        if (window.Animations) {
            window.Animations.triggerConfetti();
        }
    },
    
    // Share on LinkedIn
    shareOnLinkedIn() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('I just watched Bob (an AI teammate) build a complete GitHub integration in 27 minutes! 🤖');
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
        window.open(linkedInUrl, '_blank');
    },
    
    // View on GitHub
    viewOnGitHub() {
        window.open('https://github.com/yourusername/bob-ai-teammate-showcase', '_blank');
    },
    
    // Copy share text
    copyShareText() {
        const textarea = document.getElementById('share-text');
        if (textarea) {
            textarea.select();
            document.execCommand('copy');
            
            // Show feedback
            const btn = document.getElementById('copy-share-btn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span>✅</span> Copied!';
                btn.classList.add('button-success');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('button-success');
                }, 2000);
            }
        }
    }
};

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for use in other modules
window.App = app;

// Made with Bob
