#!/bin/bash

set -e

echo "🚀 Complete Portfolio Setup & Deployment"
echo "========================================="
echo ""

# Configuration
GITHUB_USERNAME="joshua-yowin"
REPO_NAME="portfolio_site"
YOUR_NAME="Joshua Yowin"
YOUR_EMAIL="your-email@example.com"  # ⚠️ UPDATE THIS

# Step 1: Git Configuration
echo "1️⃣  Configuring Git..."
git config --global user.name "$YOUR_NAME"
git config --global user.email "$YOUR_EMAIL"
echo "✅ Git configured"
echo ""

# Step 2: Fix Remote
echo "2️⃣  Fixing Git remote..."
cd ~/vcard-personal-portfolio
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
echo "✅ Remote configured"
echo ""

# Step 3: Commit and Push
echo "3️⃣  Committing and pushing to GitHub..."
git add .
git commit -m "Modern portfolio with updated HTML/CSS/JS" || echo "Nothing new to commit"
git branch -M main

echo ""
echo "Pushing to GitHub..."
if git push -u origin main --force; then
    echo "✅ Code pushed to GitHub"
else
    echo "❌ Push failed. Create repository first:"
    echo "   https://github.com/new"
    echo "   Name: $REPO_NAME"
    exit 1
fi
echo ""

# Step 4: Azure Deployment
echo "4️⃣  Deploying to Azure Static Web Apps..."
echo ""

# Check Azure login
if ! az account show &> /dev/null; then
    echo "Logging in to Azure..."
    az login
fi

# Clean up old deployments
echo "Cleaning up previous deployments..."
az group delete --name portfolio-rg --yes --no-wait 2>/dev/null || true
sleep 10

# Create resource group
echo "Creating resource group..."
az group create --name portfolio-rg --location eastasia --output table

# Deploy Static Web App
echo ""
echo "Creating Static Web App (this takes 2-3 minutes)..."
echo "⚠️  Authorize GitHub when prompted"
echo ""

if az staticwebapp create \
  --name joshua-portfolio \
  --resource-group portfolio-rg \
  --source https://github.com/$GITHUB_USERNAME/$REPO_NAME \
  --location eastasia \
  --branch main \
  --app-location "/" \
  --output-location "/" \
  --login-with-github; then
    
    echo ""
    echo "=================================================="
    echo "🎉 SUCCESS! Your portfolio is LIVE!"
    echo "=================================================="
    echo ""
    
    URL=$(az staticwebapp show \
      --name joshua-portfolio \
      --resource-group portfolio-rg \
      --query "defaultHostname" \
      --output tsv)
    
    echo "🌐 Your Portfolio:"
    echo "   https://$URL"
    echo ""
    echo "📂 GitHub Repository:"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "📊 Azure Portal:"
    echo "   https://portal.azure.com"
    echo ""
    echo "🚀 Auto-Deploy Setup:"
    echo "   Every git push will auto-deploy!"
    echo ""
    
    # Open in browser
    sleep 3
    echo "Opening your portfolio..."
    open "https://$URL"
    
else
    echo "❌ Azure deployment failed"
    echo "Try manual deployment via Azure Portal"
fi
