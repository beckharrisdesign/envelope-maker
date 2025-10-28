# Replit Deployment Guide

## 🚀 **Deploy PaperCraft to Replit**

Replit is the perfect hosting platform for your Node.js SaaS application. It provides automatic deployments, environment variable management, and custom domains.

## 📋 **Setup Steps**

### **1. Create Replit Project**
1. Go to [replit.com](https://replit.com) and sign up/login
2. Click **"Create Repl"**
3. Choose **"Import from GitHub"**
4. Enter your repository: `beckharrisdesign/envelope-maker`
5. Click **"Import from GitHub"**

### **2. Configure Environment Variables**
In your Replit project dashboard:

1. Click the **"Secrets"** tab (lock icon)
2. Add these environment variables:

```
STRIPE_SECRET_KEY=sk_test_[YOUR_STRIPE_SECRET_KEY]
STRIPE_PUBLISHABLE_KEY=pk_test_[YOUR_STRIPE_PUBLISHABLE_KEY]  
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET]
SESSION_SECRET=[YOUR_SESSION_SECRET]
NODE_ENV=production
PORT=3000
```

### **3. Update Stripe Keys in Code**
Edit `pricing.html` and replace:
```javascript
const stripe = Stripe('pk_test_[YOUR_STRIPE_PUBLISHABLE_KEY]');
```

### **4. Deploy**
- Replit automatically deploys when you push to main
- Your app will be live at: `https://your-repl-name.your-username.repl.co`

## 🔄 **Automatic Deployments**

- **Push to main branch** → Automatic deployment
- **No GitHub Actions needed**
- **Updates live in seconds**
- **Zero configuration required**

## 🌐 **Custom Domain (Optional)**

1. In Replit dashboard, go to **"Settings"**
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed

## 🔧 **Production Checklist**

- [ ] Set up Replit project
- [ ] Configure environment variables
- [ ] Update Stripe keys in code
- [ ] Test payment flow
- [ ] Set up custom domain (optional)
- [ ] Configure Stripe webhooks (optional)

## 💡 **Replit Advantages**

- ✅ **Free tier** with good limits
- ✅ **Automatic GitHub integration**
- ✅ **Built-in environment variables**
- ✅ **Node.js support**
- ✅ **HTTPS included**
- ✅ **Custom domains**
- ✅ **Zero configuration**

## 🆘 **Troubleshooting**

**App not starting?**
- Check environment variables are set
- Verify Stripe keys are correct
- Check the console for errors

**Payments not working?**
- Ensure Stripe keys match your Stripe dashboard
- Test with Stripe test cards
- Check webhook configuration

**Need help?**
- Replit has excellent documentation
- Community support available
- Check the console logs for errors

---

**Your SaaS application will be live and running in minutes!** 🚀
