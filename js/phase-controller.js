/**
 * Bob: Your AI Teammate - Phase Controller
 * Manages phase transitions and phase-specific content
 */

const PhaseController = {
    // Current phase
    currentPhase: null,
    currentPhaseIndex: 0,
    
    // Phase elements
    elements: {
        phaseNav: null,
        modeIndicator: null,
        reasoningContent: null,
        toolsList: null,
        nextStepsList: null,
        editorFilename: null,
        editorContent: null,
        terminalOutput: null
    },
    
    /**
     * Initialize the phase controller
     */
    init() {
        console.log('🎮 Phase Controller initialized');
        
        // Cache DOM elements
        this.cacheElements();
        
        // Subscribe to state changes
        if (window.StateManager) {
            window.StateManager.subscribe('currentPhase', (phaseIndex) => {
                this.onPhaseChange(phaseIndex);
            });
        }
    },
    
    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            phaseNav: document.querySelector('.phase-navigation'),
            modeIndicator: document.querySelector('.mode-indicator'),
            modeIcon: document.querySelector('.mode-icon'),
            modeName: document.querySelector('.mode-name'),
            reasoningContent: document.getElementById('reasoning-content'),
            toolsList: document.getElementById('tools-list'),
            nextStepsList: document.getElementById('next-steps-list'),
            editorFilename: document.getElementById('editor-filename'),
            editorContent: document.getElementById('editor-content'),
            terminalOutput: document.getElementById('terminal-output')
        };
    },
    
    /**
     * Switch to a specific phase
     * @param {number} phaseIndex - Phase index to switch to
     */
    switchToPhase(phaseIndex) {
        const scenario = window.StateManager?.state.scenarioData;
        if (!scenario || !scenario.phases[phaseIndex]) {
            console.error('Invalid phase index:', phaseIndex);
            return;
        }
        
        const phase = scenario.phases[phaseIndex];
        console.log(`🔄 Switching to phase: ${phase.name}`);
        
        this.currentPhase = phase;
        this.currentPhaseIndex = phaseIndex;
        
        // Update all phase-specific content
        this.updatePhaseNavigation(phaseIndex);
        this.updateModeIndicator(phase);
        this.updateReasoning(phase);
        this.updateTools(phase);
        this.updateNextSteps(phase);
        this.updateOutput(phase);
        
        // Track mode switch
        if (window.StateManager) {
            window.StateManager.switchMode(phase.mode);
        }
        
        // Animate transition
        this.animatePhaseTransition();
    },
    
    /**
     * Update phase navigation
     * @param {number} activeIndex - Active phase index
     */
    updatePhaseNavigation(activeIndex) {
        const navItems = document.querySelectorAll('.phase-nav-item');
        
        navItems.forEach((item, index) => {
            item.classList.remove('active', 'completed');
            
            if (index === activeIndex) {
                item.classList.add('active');
            } else if (index < activeIndex) {
                item.classList.add('completed');
            }
        });
    },
    
    /**
     * Update mode indicator
     * @param {Object} phase - Phase data
     */
    updateModeIndicator(phase) {
        const modeConfig = {
            plan: { icon: '🎯', name: 'Plan Mode', color: '#3b82f6' },
            code: { icon: '💻', name: 'Code Mode', color: '#10b981' },
            advanced: { icon: '🚀', name: 'Advanced Mode', color: '#8b5cf6' }
        };
        
        const config = modeConfig[phase.mode] || modeConfig.plan;
        
        if (this.elements.modeIcon) {
            this.elements.modeIcon.textContent = config.icon;
        }
        
        if (this.elements.modeName) {
            this.elements.modeName.textContent = config.name;
            this.elements.modeName.style.color = config.color;
        }
        
        // Add animation
        if (this.elements.modeIndicator) {
            window.Utils?.addAnimatedClass(this.elements.modeIndicator, 'pulse-once', 1000);
        }
    },
    
    /**
     * Update reasoning display
     * @param {Object} phase - Phase data
     */
    updateReasoning(phase) {
        if (!this.elements.reasoningContent || !phase.thinking) return;
        
        // Clear current content
        this.elements.reasoningContent.innerHTML = '';
        
        // Add thinking items with animation
        phase.thinking.forEach((thought, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.className = 'thinking-text fade-in';
                p.textContent = thought;
                this.elements.reasoningContent.appendChild(p);
            }, index * 500);
        });
    },
    
    /**
     * Update tools list
     * @param {Object} phase - Phase data
     */
    updateTools(phase) {
        if (!this.elements.toolsList || !phase.tools) return;
        
        // Clear current tools
        this.elements.toolsList.innerHTML = '';
        
        // Add tools with animation
        phase.tools.forEach((tool, index) => {
            setTimeout(() => {
                const toolItem = this.createToolItem(tool);
                this.elements.toolsList.appendChild(toolItem);
                
                // Track tool usage
                if (window.StateManager) {
                    window.StateManager.addToolUsed({
                        name: tool.name,
                        phase: phase.name,
                        phaseIndex: this.currentPhaseIndex
                    });
                }
            }, index * 300);
        });
    },
    
    /**
     * Create a tool item element
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
                <div class="tool-description">${tool.description}</div>
            </div>
        `;
        
        return div;
    },
    
    /**
     * Update next steps list
     * @param {Object} phase - Phase data
     */
    updateNextSteps(phase) {
        if (!this.elements.nextStepsList || !phase.nextSteps) return;
        
        // Clear current steps
        this.elements.nextStepsList.innerHTML = '';
        
        // Add steps with animation
        phase.nextSteps.forEach((step, index) => {
            setTimeout(() => {
                const li = document.createElement('li');
                li.className = 'fade-in';
                li.textContent = step;
                this.elements.nextStepsList.appendChild(li);
            }, index * 200);
        });
    },
    
    /**
     * Update output display (code editor or terminal)
     * @param {Object} phase - Phase data
     */
    updateOutput(phase) {
        if (!phase.output) return;
        
        const output = phase.output;
        
        // Update filename
        if (this.elements.editorFilename && output.filename) {
            this.elements.editorFilename.textContent = output.filename;
        }
        
        // Update content based on type
        if (output.type === 'code' || output.type === 'markdown') {
            this.showCodeEditor();
            this.updateCodeEditor(output);
        } else if (output.type === 'terminal') {
            this.showTerminal();
            this.updateTerminal(output);
        }
        
        // Update metrics if available
        this.updatePhaseMetrics(phase);
    },
    
    /**
     * Show code editor
     */
    showCodeEditor() {
        const editorContainer = document.querySelector('.code-editor-container');
        const terminalContainer = document.querySelector('.terminal-container');
        
        if (editorContainer) editorContainer.style.display = 'block';
        if (terminalContainer) terminalContainer.style.display = 'none';
    },
    
    /**
     * Show terminal
     */
    showTerminal() {
        const editorContainer = document.querySelector('.code-editor-container');
        const terminalContainer = document.querySelector('.terminal-container');
        
        if (editorContainer) editorContainer.style.display = 'none';
        if (terminalContainer) terminalContainer.style.display = 'block';
    },
    
    /**
     * Update code editor content
     * @param {Object} output - Output data
     */
    updateCodeEditor(output) {
        if (!this.elements.editorContent || !output.content) return;
        
        // Clear current content
        this.elements.editorContent.textContent = '';
        
        // Type out the code with animation
        if (window.Animations) {
            window.Animations.typeCode(this.elements.editorContent, output.content, 20);
        } else {
            // Fallback without animation
            this.elements.editorContent.textContent = output.content;
        }
        
        // Apply syntax highlighting if available
        if (output.language) {
            this.elements.editorContent.className = `editor-content language-${output.language}`;
        }
    },
    
    /**
     * Update terminal output
     * @param {Object} output - Output data
     */
    updateTerminal(output) {
        if (!this.elements.terminalOutput || !output.content) return;
        
        // Clear current content
        this.elements.terminalOutput.textContent = '';
        
        // Type out the terminal output
        if (window.Animations) {
            window.Animations.typeCode(this.elements.terminalOutput, output.content, 30);
        } else {
            // Fallback without animation
            this.elements.terminalOutput.textContent = output.content;
        }
    },
    
    /**
     * Update phase-specific metrics
     * @param {Object} phase - Phase data
     */
    updatePhaseMetrics(phase) {
        if (!window.StateManager) return;
        
        const updates = {};
        
        if (phase.filesModified) {
            updates.filesModified = (window.StateManager.state.metrics.filesModified || 0) + phase.filesModified;
        }
        
        if (phase.linesAdded) {
            updates.linesAdded = (window.StateManager.state.metrics.linesAdded || 0) + phase.linesAdded;
        }
        
        if (phase.testsCreated) {
            updates.testsCreated = (window.StateManager.state.metrics.testsCreated || 0) + phase.testsCreated;
        }
        
        if (phase.issuesFound) {
            updates.bugsPrevented = (window.StateManager.state.metrics.bugsPrevented || 0) + phase.issuesFound;
        }
        
        if (Object.keys(updates).length > 0) {
            window.StateManager.updateMetrics(updates);
        }
    },
    
    /**
     * Animate phase transition
     */
    animatePhaseTransition() {
        const leftPanel = document.querySelector('.left-panel');
        const rightPanel = document.querySelector('.right-panel');
        
        if (leftPanel && rightPanel) {
            // Add transition animation
            leftPanel.classList.add('phase-transition');
            rightPanel.classList.add('phase-transition');
            
            setTimeout(() => {
                leftPanel.classList.remove('phase-transition');
                rightPanel.classList.remove('phase-transition');
            }, 500);
        }
    },
    
    /**
     * Handle phase change event
     * @param {number} phaseIndex - New phase index
     */
    onPhaseChange(phaseIndex) {
        if (phaseIndex !== this.currentPhaseIndex) {
            this.switchToPhase(phaseIndex);
        }
    },
    
    /**
     * Get current phase data
     * @returns {Object} Current phase data
     */
    getCurrentPhase() {
        return this.currentPhase;
    },
    
    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        return {
            currentPhase: this.currentPhase?.name,
            currentPhaseIndex: this.currentPhaseIndex,
            elementsLoaded: Object.keys(this.elements).filter(key => this.elements[key] !== null).length
        };
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PhaseController.init());
} else {
    PhaseController.init();
}

// Export for use in other modules
window.PhaseController = PhaseController;

// Made with Bob