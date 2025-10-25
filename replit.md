# SeedEnvelope Pro - Replit Setup

## Overview
Professional seed envelope template generator with Stripe subscription integration. This is a SaaS application that generates custom seed envelope templates for Cricut, xTool, and other cutting machines.

**Current Status**: ✅ Configured and running on Replit

## Project Architecture

### Technology Stack
- **Backend**: Node.js with Express
- **Payment Processing**: Stripe API for subscriptions
- **Session Management**: express-session
- **Frontend**: Vanilla JavaScript with HTML/CSS

### File Structure
```
├── server.js              # Express server with Stripe integration
├── package.json           # Node.js dependencies
├── landing.html          # Marketing landing page (/)
├── pricing.html          # Pricing page with Stripe checkout (/pricing)
├── generator.html        # Protected generator (subscription required) (/generator)
├── login.html            # User login page (/login)
├── index.html            # Original generator (now protected)
├── script.js             # Generator logic for envelope templates
├── design-system.css     # Professional styling
├── styles.css            # Additional styling
├── header.html           # Reusable header component
└── header-loader.js      # Header loading script
```

## Recent Changes (October 25, 2025)

### Replit Environment Setup
1. **Port Configuration**: Changed default port from 3000 to 5000 (required for Replit)
2. **Host Binding**: Server now binds to `0.0.0.0:5000` for Replit proxy compatibility
3. **Dependencies**: Installed all npm packages (express, stripe, dotenv, cors, express-session)
4. **Default Values**: Added fallback values for SESSION_SECRET and STRIPE_SECRET_KEY
5. **Workflow**: Configured `Server` workflow to run `npm start` on port 5000

## Environment Variables Required

The following secrets need to be configured via Replit Secrets:

### Required for Production
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_test_` or `pk_live_`)
- `STRIPE_PRICE_ID` - Your Stripe price ID for the subscription (starts with `price_`)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret for signature verification (starts with `whsec_`)
- `SESSION_SECRET` - Random string for session encryption

### Optional (with defaults)
- `PORT` - Server port (defaults to 5000)
- `NODE_ENV` - Environment mode (defaults to development)

## Subscription Flow

1. User visits landing page (`/`)
2. User clicks pricing to see subscription options (`/pricing`)
3. User subscribes via Stripe Checkout ($20/year)
4. Upon successful payment, user is authenticated via session
5. User can access the generator tool (`/generator`)
6. Login system allows returning subscribers to access tool (`/login`)

## Features

### Envelope Generator
- 4 standard seed envelope sizes (#3, #4.5, #5, #6)
- Dual-tool support (cut lines and score lines)
- Multiple flap styles (square, pointed, rounded)
- Adjustable flap heights and overlap amounts
- Export options: SVG and PDF

### Authentication
- Session-based authentication
- Stripe payment verification
- Email-based login for returning customers
- Test authentication endpoint (`/test-auth`) for debugging

## Key Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /pricing` - Pricing and subscription page
- `GET /login` - Login for existing subscribers

### Protected Routes
- `GET /generator` - Main envelope generator tool (requires subscription)

### API Endpoints
- `POST /create-checkout-session` - Create Stripe checkout session
- `POST /webhook` - Stripe webhook handler
- `GET /stripe-config` - Get Stripe public configuration
- `POST /check-subscription-by-email` - Verify subscription by email
- `GET /auth-status` - Check current authentication status
- `POST /logout` - Destroy session and log out
- `GET /test-auth` - Test endpoint to manually authenticate (debugging)

## Development Notes

### Local Testing
- Use `npm start` to run the server
- Use `npm run dev` for auto-restart with nodemon
- Access at http://localhost:5000

### Stripe Configuration
1. Create a Stripe account at https://stripe.com
2. Get API keys from Dashboard → Developers → API Keys
3. Create a subscription product with a price of $20/year
4. Copy the Price ID (starts with `price_`)
5. Add all keys to Replit Secrets

### Session Management
- Sessions expire after 24 hours
- Sessions are stored in memory (consider using a session store for production)
- Authentication is verified on each protected route access

## Deployment on Replit

### Current Configuration
- Server runs on port 5000
- Binds to 0.0.0.0 for external access
- Uses dotenv for environment variables
- CORS enabled for cross-origin requests

### Next Steps for Production
1. Add all required Stripe keys via Replit Secrets
2. Test the complete payment flow
3. Configure Stripe webhook endpoint in Stripe Dashboard
4. Use Replit Deployments for production hosting
5. Set up custom domain (optional)
6. Configure production Stripe keys (live mode)

## User Preferences
None specified yet.

## Known Issues
- Needs Stripe API keys to be configured for full functionality
- Session store is in-memory (should use persistent store for production)
- Webhook endpoint needs to be registered in Stripe Dashboard after deployment

---

**Last Updated**: October 25, 2025
**Status**: Development mode, ready for Stripe configuration
