require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

let stripe = null;
let stripeInitialized = false;

try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey.startsWith('sk_')) {
        stripe = require('stripe')(stripeKey);
        stripeInitialized = true;
        console.log('✅ Stripe initialized successfully');
    } else {
        console.warn('⚠️  Stripe not initialized: Missing or invalid STRIPE_SECRET_KEY');
    }
} catch (error) {
    console.error('❌ Stripe initialization failed:', error.message);
    console.log('ℹ️  Server will start without Stripe functionality');
}

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'replit-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        return res.status(401).send(`
            <html>
                <head><title>Access Denied</title></head>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                    <h1>🔒 Access Denied</h1>
                    <p>You need to subscribe to access the Seed Envelope Generator.</p>
                    <a href="/pricing" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Subscribe Now</a>
                </body>
            </html>
        `);
    }
}

// Serve static files (CSS, JS, images, etc.)
app.use(express.static('.', {
    index: false // Don't serve index.html automatically
}));

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        stripeConfigured: stripeInitialized,
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Route handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, 'pricing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/generator', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'generator.html'));
});

// Direct access to tool (redirects to generator if authenticated, otherwise to pricing)
app.get('/tool', (req, res) => {
    if (req.session && req.session.authenticated) {
        res.redirect('/generator');
    } else {
        res.redirect('/pricing');
    }
});

// Success route - set session when user completes payment
app.get('/generator.html', async (req, res) => {
    const { success } = req.query;
    if (success === 'true') {
        try {
            // Get the session ID from the URL or session
            const sessionId = req.query.session_id;
            if (sessionId && stripeInitialized) {
                // Retrieve the checkout session to get customer ID
                const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
                
                if (checkoutSession.customer) {
                    req.session.authenticated = true;
                    req.session.customerId = checkoutSession.customer;
                    req.session.subscriptionDate = new Date();
                    console.log('User authenticated via payment success, customer ID:', checkoutSession.customer);
                }
            } else {
                // Fallback: set session without customer ID
                req.session.authenticated = true;
                req.session.subscriptionDate = new Date();
                console.log('User authenticated via payment success (no customer ID)');
            }
            
            // Redirect to the protected generator route
            return res.redirect('/generator');
        } catch (error) {
            console.error('Error retrieving checkout session:', error);
            // Fallback: set session without customer ID
            req.session.authenticated = true;
            req.session.subscriptionDate = new Date();
            return res.redirect('/generator');
        }
    }
    res.sendFile(path.join(__dirname, 'generator.html'));
});

// Stripe Integration
app.post('/create-checkout-session', async (req, res) => {
    if (!stripeInitialized) {
        return res.status(503).json({ 
            error: 'Stripe is not configured. Please contact support.' 
        });
    }
    
    try {
        const { priceId, successUrl, cancelUrl } = req.body;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Your Stripe price ID for $20/year
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_creation: 'always', // Always create a customer
            metadata: {
                product: 'SeedEnvelope Pro'
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook for Stripe events
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    if (!stripeInitialized) {
        console.warn('⚠️  Webhook called but Stripe is not initialized');
        return res.status(503).json({ error: 'Stripe not configured' });
    }
    
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Payment successful for session:', session.id);
            console.log('  - Customer ID:', session.customer);
            console.log('  - Subscription ID:', session.subscription);
            // Note: Customer ID is now stored in session on success redirect
            break;
            
        case 'customer.subscription.created':
            const newSubscription = event.data.object;
            console.log('✅ New subscription created:', newSubscription.id);
            console.log('  - Customer ID:', newSubscription.customer);
            console.log('  - Status:', newSubscription.status);
            break;
            
        case 'customer.subscription.updated':
            const updatedSubscription = event.data.object;
            console.log('🔄 Subscription updated:', updatedSubscription.id);
            console.log('  - Customer ID:', updatedSubscription.customer);
            console.log('  - Status:', updatedSubscription.status);
            break;
            
        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            console.log('❌ Subscription canceled:', deletedSubscription.id);
            console.log('  - Customer ID:', deletedSubscription.customer);
            // Note: User will lose access on next auth check
            break;
            
        default:
            console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    res.json({received: true});
});

// Serve Stripe configuration to frontend
app.get('/stripe-config', (req, res) => {
    if (!stripeInitialized) {
        return res.json({
            publishableKey: null,
            priceId: null,
            error: 'Stripe not configured'
        });
    }
    
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
        priceId: process.env.STRIPE_PRICE_ID || null
    });
});

// Check subscription status
app.get('/check-subscription', async (req, res) => {
    try {
        // In a real app, you'd check the user's session/token
        // and verify their subscription status with Stripe
        // For now, we'll simulate a check
        
        // This is a simplified version - in production you'd:
        // 1. Authenticate the user
        // 2. Check their subscription status in your database
        // 3. Verify with Stripe if needed
        
        res.json({
            subscribed: true, // Change this based on actual subscription status
            email: 'user@example.com'
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        res.status(500).json({ error: 'Failed to check subscription' });
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ success: true });
    });
});

// Check authentication status
app.get('/auth-status', async (req, res) => {
    const sessionInfo = {
        authenticated: !!(req.session && req.session.authenticated),
        subscriptionDate: req.session?.subscriptionDate,
        customerId: req.session?.customerId,
        sessionId: req.sessionID,
        sessionData: req.session
    };
    
    // Debug: Log session information
    console.log('🔍 Session Debug Info:');
    console.log('  - Session ID:', req.sessionID);
    console.log('  - Authenticated:', sessionInfo.authenticated);
    console.log('  - Customer ID:', sessionInfo.customerId);
    console.log('  - Subscription Date:', sessionInfo.subscriptionDate);
    console.log('  - Full Session Data:', JSON.stringify(req.session, null, 2));
    console.log('  - Session Cookie:', req.headers.cookie);
    console.log('---');
    
    // If we have a customer ID, check Stripe subscription status
    if (sessionInfo.customerId && stripeInitialized) {
        try {
            const subscriptions = await stripe.subscriptions.list({
                customer: sessionInfo.customerId,
                status: 'active',
                limit: 1
            });
            
            const hasActiveSubscription = subscriptions.data.length > 0;
            
            console.log('🔍 Stripe Subscription Check:');
            console.log('  - Customer ID:', sessionInfo.customerId);
            console.log('  - Active Subscriptions:', subscriptions.data.length);
            console.log('  - Has Active Subscription:', hasActiveSubscription);
            console.log('---');
            
            return res.json({
                authenticated: hasActiveSubscription,
                subscriptionDate: sessionInfo.subscriptionDate,
                customerId: sessionInfo.customerId,
                stripeVerified: true
            });
        } catch (error) {
            console.error('Error checking Stripe subscription:', error);
            // Fallback to session-based authentication
            return res.json({
                authenticated: sessionInfo.authenticated,
                subscriptionDate: sessionInfo.subscriptionDate,
                customerId: sessionInfo.customerId,
                stripeVerified: false,
                error: 'Stripe check failed'
            });
        }
    }
    
    // No customer ID, use session-based authentication
    res.json({
        authenticated: sessionInfo.authenticated,
        subscriptionDate: sessionInfo.subscriptionDate,
        customerId: sessionInfo.customerId,
        stripeVerified: false
    });
});

// Check subscription by email
app.post('/check-subscription-by-email', async (req, res) => {
    if (!stripeInitialized) {
        return res.status(503).json({ 
            error: 'Stripe is not configured. Please contact support.',
            subscribed: false 
        });
    }
    
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        console.log('🔍 Checking subscription for email:', email);
        
        // Search for customers by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        });
        
        if (customers.data.length === 0) {
            console.log('❌ No customer found for email:', email);
            return res.json({ subscribed: false, message: 'No account found' });
        }
        
        const customer = customers.data[0];
        console.log('✅ Customer found:', customer.id);
        
        // Check for active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'active',
            limit: 1
        });
        
        const hasActiveSubscription = subscriptions.data.length > 0;
        
        console.log('🔍 Subscription check for customer:', customer.id);
        console.log('  - Active subscriptions:', subscriptions.data.length);
        console.log('  - Has active subscription:', hasActiveSubscription);
        
        if (hasActiveSubscription) {
            // Set session for the user
            req.session.authenticated = true;
            req.session.customerId = customer.id;
            req.session.subscriptionDate = new Date();
            console.log('✅ Session set for customer:', customer.id);
        }
        
        res.json({
            subscribed: hasActiveSubscription,
            customerId: customer.id,
            subscriptionCount: subscriptions.data.length
        });
        
    } catch (error) {
        console.error('Error checking subscription by email:', error);
        res.status(500).json({ error: 'Failed to check subscription' });
    }
});

// Test endpoint to manually authenticate (for debugging)
app.get('/test-auth', (req, res) => {
    req.session.authenticated = true;
    req.session.subscriptionDate = new Date();
    console.log('Test authentication set');
    res.redirect('/generator');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Landing page: http://localhost:${PORT}`);
    console.log(`Pricing page: http://localhost:${PORT}/pricing`);
    console.log(`Login page: http://localhost:${PORT}/login`);
    console.log(`Generator: http://localhost:${PORT}/generator`);
});
