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
            <nav style="background: white; padding: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #667eea;">
                        <a href="/" style="text-decoration: none; color: inherit;">🌱 SeedEnvelope Pro</a>
                    </div>
                    <div>
                        <a href="/pricing" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Get Started</a>
                    </div>
                </div>
            </nav>
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
