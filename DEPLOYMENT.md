# GitHub Pages Deployment Guide

## 🚀 Automatic Deployment Setup

This project is configured with GitHub Actions to automatically deploy to GitHub Pages whenever you push changes to the main branch.

## 📋 Setup Steps

### 1. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Seed Envelope Template Generator"
```

### 2. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it `envelope-maker` (or your preferred name)
4. Make it public (required for free GitHub Pages)
5. Don't initialize with README (you already have files)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/envelope-maker.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run and deploy your site

### 5. Access Your Live Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/envelope-maker`
- The deployment usually takes 1-2 minutes after pushing

## 🔄 How It Works

The `.github/workflows/deploy.yml` file contains the GitHub Actions workflow that:

1. **Triggers** on every push to the `main` branch
2. **Builds** your static site (no build step needed for your HTML/CSS/JS)
3. **Deploys** to GitHub Pages automatically
4. **Updates** your live site within minutes

## 🛠 Manual Deployment

If you need to trigger a deployment manually:
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow** button

## 📁 File Structure

Your project structure is perfect for GitHub Pages:
```
envelope-maker/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── index.html                  # Main page
├── script.js                   # JavaScript functionality
├── styles.css                  # Styling
├── README.md                   # Documentation
└── DEPLOYMENT.md              # This guide
```

## 🔧 Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to your repository root with your domain
2. Configure your domain's DNS to point to GitHub Pages
3. Enable "Enforce HTTPS" in repository settings

## ✅ Verification

After deployment, verify your site works by:
1. Opening the live URL
2. Testing all envelope size buttons
3. Checking that SVG downloads work
4. Verifying PDF downloads work

## 🐛 Troubleshooting

If deployment fails:
1. Check the **Actions** tab in your repository for error messages
2. Ensure all files are committed and pushed
3. Verify the workflow file is in `.github/workflows/deploy.yml`
4. Check that your repository is public (required for free GitHub Pages)

## 📈 Next Steps

Once deployed, you can:
- Share your live URL with others
- Make changes locally and push to automatically update the live site
- Add analytics (Google Analytics, etc.)
- Set up a custom domain
- Add more features and they'll auto-deploy
