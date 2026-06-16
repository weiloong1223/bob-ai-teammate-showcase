/**
 * Bob: Your AI Teammate - Animations
 * Animation controllers and effects
 */

const Animations = {
    // Active animations
    activeAnimations: new Map(),
    
    /**
     * Initialize animations
     */
    init() {
        console.log('✨ Animations initialized');
    },
    
    /**
     * Type code with animation
     * @param {HTMLElement} element - Element to type into
     * @param {string} code - Code to type
     * @param {number} speed - Typing speed in ms per character
     * @returns {Promise} Promise that resolves when typing is complete
     */
    typeCode(element, code, speed = 20) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            // Clear existing content
            element.textContent = '';
            
            let index = 0;
            const lines = code.split('\n');
            let currentLine = 0;
            let currentChar = 0;
            
            const typeChar = () => {
                if (currentLine >= lines.length) {
                    resolve();
                    return;
                }
                
                const line = lines[currentLine];
                
                if (currentChar < line.length) {
                    element.textContent += line[currentChar];
                    currentChar++;
                    setTimeout(typeChar, speed);
                } else {
                    // Move to next line
                    element.textContent += '\n';
                    currentLine++;
                    currentChar = 0;
                    setTimeout(typeChar, speed * 2); // Slight pause between lines
                }
            };
            
            typeChar();
        });
    },
    
    /**
     * Animate counter from start to end
     * @param {HTMLElement} element - Element to update
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Duration in ms
     * @param {Object} options - Options (suffix, prefix, decimals)
     * @returns {Promise} Promise that resolves when animation is complete
     */
    animateCounter(element, start, end, duration = 1000, options = {}) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            const { suffix = '', prefix = '', decimals = 0 } = options;
            const range = end - start;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (ease-out)
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = start + (range * eased);
                
                // Format number
                const formatted = current.toFixed(decimals);
                element.textContent = `${prefix}${formatted}${suffix}`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            animate();
        });
    },
    
    /**
     * Trigger confetti effect
     */
    triggerConfetti() {
        console.log('🎉 Triggering confetti');
        
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const confettiCount = 100;
        const container = document.body;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(container, colors);
            }, i * 30);
        }
    },
    
    /**
     * Create a single confetti piece
     * @param {HTMLElement} container - Container element
     * @param {Array} colors - Array of colors
     */
    createConfettiPiece(container, colors) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        
        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = 2 + Math.random() * 2;
        const size = 5 + Math.random() * 10;
        
        confetti.style.cssText = `
            position: fixed;
            left: ${left}%;
            top: -20px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            opacity: 1;
            z-index: 10000;
            pointer-events: none;
            animation: confetti-fall ${animationDuration}s linear forwards;
        `;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    },
    
    /**
     * Create particle effect
     * @param {HTMLElement} element - Element to emit particles from
     * @param {Object} options - Particle options
     */
    createParticles(element, options = {}) {
        if (!element) return;
        
        const {
            count = 20,
            color = '#3b82f6',
            size = 5,
            duration = 1000
        } = options;
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < count; i++) {
            this.createParticle(centerX, centerY, { color, size, duration });
        }
    },
    
    /**
     * Create a single particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} options - Particle options
     */
    createParticle(x, y, options = {}) {
        const {
            color = '#3b82f6',
            size = 5,
            duration = 1000
        } = options;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(particle);
        
        // Animate
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const currentX = x + vx * progress;
            const currentY = y + vy * progress + (progress * progress * 200); // Gravity
            const opacity = 1 - progress;
            
            particle.style.left = `${currentX}px`;
            particle.style.top = `${currentY}px`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    /**
     * Pulse animation
     * @param {HTMLElement} element - Element to pulse
     * @param {number} duration - Duration in ms
     */
    pulse(element, duration = 1000) {
        if (!element) return;
        
        element.classList.add('pulse-animation');
        
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, duration);
    },
    
    /**
     * Shake animation
     * @param {HTMLElement} element - Element to shake
     * @param {number} duration - Duration in ms
     */
    shake(element, duration = 500) {
        if (!element) return;
        
        element.classList.add('shake-animation');
        
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, duration);
    },
    
    /**
     * Fade in animation
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in ms
     * @returns {Promise} Promise that resolves when animation is complete
     */
    fadeIn(element, duration = 300) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                
                element.style.opacity = Math.min(progress, 1);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    /**
     * Fade out animation
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in ms
     * @returns {Promise} Promise that resolves when animation is complete
     */
    fadeOut(element, duration = 300) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                
                element.style.opacity = 1 - Math.min(progress, 1);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    /**
     * Slide in from top
     * @param {HTMLElement} element - Element to slide in
     * @param {number} duration - Duration in ms
     * @returns {Promise} Promise that resolves when animation is complete
     */
    slideInFromTop(element, duration = 500) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            element.style.transform = 'translateY(-100%)';
            element.style.display = 'block';
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                const eased = 1 - Math.pow(1 - progress, 3);
                
                element.style.transform = `translateY(${-100 + (eased * 100)}%)`;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.transform = 'translateY(0)';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    /**
     * Progress bar animation
     * @param {HTMLElement} element - Progress bar element
     * @param {number} progress - Progress value (0-1)
     * @param {number} duration - Duration in ms
     * @returns {Promise} Promise that resolves when animation is complete
     */
    animateProgress(element, progress, duration = 500) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            const currentProgress = parseFloat(element.style.width) || 0;
            const targetProgress = progress * 100;
            const range = targetProgress - currentProgress;
            
            let start = null;
            const animate = (timestamp) => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const animProgress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - animProgress, 3);
                
                const current = currentProgress + (range * eased);
                element.style.width = `${current}%`;
                
                if (animProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    },
    
    /**
     * Stop all animations
     */
    stopAll() {
        this.activeAnimations.forEach((animation, key) => {
            if (animation.cancel) {
                animation.cancel();
            }
        });
        this.activeAnimations.clear();
    },
    
    /**
     * Get debug info
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        return {
            activeAnimations: this.activeAnimations.size
        };
    }
};

// Add confetti animation CSS if not already present
if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        .pulse-animation {
            animation: pulse 0.5s ease-in-out;
        }
        
        .shake-animation {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Animations.init());
} else {
    Animations.init();
}

// Export for use in other modules
window.Animations = Animations;

// Made with Bob