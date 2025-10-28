# PaperCraft - Professional Paper Packaging Template Generator

A subscription-based SaaS application that generates custom paper packaging templates for Cricut, xTool, and other cutting machines. Features dual-tool support with separate cut lines and score lines for professional results.

## 🌱 Features

- **4 Standard Envelope Sizes**: #3, #4.5, #5, and #6 envelopes for various packaging needs
- **Dual-Tool Support**: Separate cut lines (blade) and score lines (scoring head)
- **Multiple Flap Styles**: Square, pointed, or rounded flaps with adjustable heights
- **Export Options**: SVG for cutting machines or PDF for printing
- **Real-time Preview**: Instant template generation with live preview
- **Professional Quality**: 72 DPI print quality with vector-based paths

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Stripe account for payments
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/beckharrisdesign/envelope-maker.git
   cd envelope-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your Stripe keys
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

### Stripe Setup

1. **Create Stripe Account**: https://stripe.com
2. **Get API Keys**: Dashboard → Developers → API Keys
3. **Create Product & Price**:
   - Name: "PaperCraft"
   - Price: $20.00/year (recurring)
   - Copy the Price ID (starts with `price_`)

### Environment Variables

Create a `.env` file with:
```bash
STRIPE_SECRET_KEY=sk_test_[YOUR_STRIPE_SECRET_KEY]
STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]
SESSION_SECRET=[YOUR_SESSION_SECRET]
PORT=3000
NODE_ENV=development
```

## 🏗️ Application Structure

```
envelope-maker/
├── server.js              # Express server with Stripe integration
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (not in repo)
├── .gitignore            # Git ignore rules
├── landing.html          # Marketing landing page
├── pricing.html          # Pricing page with Stripe checkout
├── generator.html        # Protected generator (subscription required)
├── login.html            # User login page
├── index.html            # Original generator (now protected)
├── script.js             # Generator logic
├── design-system.css     # Professional styling
├── styles.css            # Additional styling
└── header.html           # Reusable header component
```

## 💳 Subscription Flow

1. **Landing Page** (`/`) - Marketing and features
2. **Pricing Page** (`/pricing`) - $20/year subscription
3. **Stripe Checkout** - Secure payment processing
4. **Generator Access** (`/generator`) - Protected tool access
5. **Session Management** - Automatic login/logout

## 🛠️ Development

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Environment Setup
- Development: Uses test Stripe keys
- Production: Uses live Stripe keys
- Session management with secure cookies

## 🚀 Deployment

### Replit (Recommended - Simplest)
1. Go to [replit.com](https://replit.com)
2. Create new Repl → Import from GitHub
3. Connect your `beckharrisdesign/envelope-maker` repository
4. Set environment variables in Replit dashboard
5. Automatic deployment on every push to main

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Replit setup instructions.

### Alternative Hosting Options
- **Railway**: Connect GitHub repo, set environment variables
- **Heroku**: Traditional PaaS with CLI deployment
- **DigitalOcean App Platform**: One-click GitHub integration
- **Render**: Free tier available with automatic deployments

## 🔧 Production Checklist

- [ ] Switch to Stripe live keys
- [ ] Set up webhook endpoint in Stripe dashboard
- [ ] Configure custom domain
- [ ] Set up email notifications
- [ ] Configure SSL/HTTPS
- [ ] Add analytics tracking
- [ ] Set up monitoring

## 📊 Revenue Model

- **Price**: $20/year per user
- **Target**: Gardeners, seed companies, crafters
- **Value Proposition**: Professional templates, time-saving, cutting machine optimization

## 🎯 Template Specifications

### Envelope Sizes
- **#3**: 2½" × 4¼" - Small seeds
- **#4.5**: 3" × 4⅞" - Medium seeds  
- **#5**: 2⅞" × 5¼" - Large seeds
- **#6**: 3⅜" × 6" - Extra large seeds

### Flap Styles
- **Square**: Standard rectangular flaps
- **Pointed**: Angled flap edges
- **Rounded**: Curved flap corners

### Technical Details
- **DPI**: 72 DPI for print quality
- **Format**: SVG with vector paths
- **Tools**: Blade tool for cut lines, scoring head for score lines
- **Flap depths**: Top flap (1.5"), side/bottom flaps (0.75")

## 🛡️ Security

- Environment variables for sensitive keys
- HTTPS in production
- Stripe webhook signature verification
- Input validation and sanitization
- Secure session management

## 📋 Current Status

### ✅ **Clean Repository State**
- **GitHub Pages disabled** - No longer available at github.io URL
- **Workflows removed** - No conflicting deployment actions
- **Server-ready** - Configured for proper Node.js hosting
- **Replit optimized** - Ready for automatic deployment

### 🚀 **Deployment Ready**
- Push to main branch → Automatic deployment
- Environment variables configured
- Stripe integration ready
- Professional SaaS application

## 📈 Growth Strategy

1. **A/B Testing**: Different pricing and landing page copy
2. **User Feedback**: Collect testimonials and case studies
3. **Feature Expansion**: More envelope types, custom sizes
4. **Marketing**: SEO optimization, social media, content marketing
5. **Analytics**: Track conversion rates, user behavior

## 🚀 Production Deployment Roadmap

### **Current State**
- ✅ **Development Environment**: Running on Replit with test Stripe keys
- ✅ **Auto-deployment**: GitHub integration with automatic deployments
- ✅ **Error Handling**: Robust error handling and graceful degradation

### **Next Steps for Production**
1. **Replit Deployments**: Set up production deployment environment
2. **Environment Separation**: 
   - Development: Test Stripe keys, development features
   - Production: Live Stripe keys, production-ready configuration
3. **Custom Domain**: Professional domain for production
4. **SSL/HTTPS**: Secure production environment
5. **Monitoring**: Production monitoring and analytics

### **Production Checklist**
- [ ] Set up Replit Deployments for production
- [ ] Configure live Stripe keys for production
- [ ] Set up custom domain
- [ ] Enable HTTPS/SSL
- [ ] Configure production monitoring
- [ ] Set up webhook endpoints for live Stripe
- [ ] Test complete production payment flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Email**: [Your support email]

---

**PaperCraft** - Professional paper packaging templates for makers and businesses. 🌱✂️