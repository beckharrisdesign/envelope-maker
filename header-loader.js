/**
 * Header Loader - Reusable Header Component
 * Loads the header.html component into any page with a header-container div
 */

class HeaderLoader {
    constructor() {
        this.loaded = false;
        this.init();
    }

    async init() {
        if (this.loaded) return;
        
        try {
            await this.loadHeader();
            this.loaded = true;
        } catch (error) {
            console.error('Failed to load header:', error);
        }
    }

    async loadHeader() {
        console.log('🔍 HeaderLoader: Starting to load header...');
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            console.warn('❌ No header-container found on this page');
            return;
        }

        console.log('✅ Header container found, fetching header.html...');
        try {
            const response = await fetch('/header.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const headerHTML = await response.text();
            console.log('✅ Header HTML fetched, length:', headerHTML.length);
            headerContainer.innerHTML = headerHTML;
            
            // Initialize header functionality after loading
            console.log('🔍 Initializing header functionality...');
            this.initializeHeaderFunctionality();
            
            console.log('✅ Header loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading header:', error);
            // Fallback: show a simple header
            console.log('🔍 Using fallback header...');
            headerContainer.innerHTML = this.getFallbackHeader();
        }
    }

    getFallbackHeader() {
        return `
            <header class="software-header">
                <div class="container">
                        <div class="header-left">
                            <div class="header-logo">
                                <a href="/" style="text-decoration: none; color: inherit; display: flex; gap: var(--space-xs); align-items: center;">
                                    <div class="header-logomark">🌱</div>
                                    <span class="header-brand-text">PaperCraft</span>
                                </a>
                            </div>
                            <nav class="header-nav">
                                <a href="/storybook" class="nav-link" style="background: rgba(255, 193, 7, 0.1); color: #ff6b35; border-radius: 4px; padding: 4px 8px;">
                                    📚 Storybook
                                </a>
                            </nav>
                        </div>
                    <div class="header-buttons">
                        <a href="/pricing" class="btn btn-primary">Get Started</a>
                    </div>
                </div>
                <div class="header-divider"></div>
            </header>
        `;
    }

    initializeHeaderFunctionality() {
        // The header.html already contains its own initialization script
        // This method is here for any additional setup if needed
        console.log('Header functionality initialized');
    }
}

// Auto-initialize when DOM is ready
console.log('Header loader script loaded');
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, initializing header loader');
        new HeaderLoader();
    });
} else {
    console.log('Document already loaded, initializing header loader immediately');
    new HeaderLoader();
}

// Export for manual initialization if needed
window.HeaderLoader = HeaderLoader;
