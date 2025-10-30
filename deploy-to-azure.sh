#!/bin/bash

# Azure Portfolio Deployment Script - INDIA REGION
# Optimized for Azure Student Accounts in India

set -e

echo "🚀 Deploying Portfolio to Azure Static Web Apps (Central India)..."
echo ""

# Configuration
RESOURCE_GROUP="portfolio-rg"
APP_NAME="joshua-portfolio"
LOCATION="centralindia"  # Best for India!
GITHUB_REPO="https://github.com/YOUR-USERNAME/vcard-personal-portfolio"

# Check if logged in to Azure
echo "📋 Checking Azure login..."
if ! az account show &> /dev/null; then
    echo "Not logged in. Logging in..."
    az login
fi

# Show current subscription
echo "Current subscription:"
az account show --query "{Name:name, ID:id, State:state}" --output table
echo ""

# Clean up any existing failed deployments
echo "🧹 Cleaning up any previous failed deployments..."
az group delete --name "$RESOURCE_GROUP" --yes --no-wait 2>/dev/null || true
sleep 5

# Create resource group in Central India
echo "📦 Creating resource group in Central India..."
if az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table; then
    echo "✅ Resource group created successfully"
else
    echo "❌ Failed to create resource group"
    exit 1
fi

echo ""
echo "🌐 Creating Static Web App in Central India..."
echo "📍 Location: Mumbai, India (centralindia)"
echo "⏳ This will take 2-3 minutes..."
echo ""
echo "⚠️  When prompted, authorize GitHub by:"
echo "   1. Visit the GitHub device code URL"
echo "   2. Enter the code shown"
echo "   3. Authorize Azure Static Web Apps"
echo ""

# Create Static Web App
if az staticwebapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --source "$GITHUB_REPO" \
  --location "$LOCATION" \
  --branch main \
  --app-location "/" \
  --output-location "/" \
  --login-with-github; then
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    
    # Get the URL
    URL=$(az staticwebapp show \
      --name "$APP_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --query "defaultHostname" \
      --output tsv)
    
    SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    
    echo "🎉 Your portfolio is now live!"
    echo ""
    echo "🌐 Website URL:"
    echo "   https://$URL"
    echo ""
    echo "📊 Azure Portal:"
    echo "   https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/staticSites/$APP_NAME"
    echo ""
    echo "📂 GitHub Actions:"
    echo "   $GITHUB_REPO/actions"
    echo ""
    echo "💡 Next Steps:"
    echo "   1. Check your GitHub repo for the auto-generated workflow"
    echo "   2. Any push to main branch will auto-deploy"
    echo "   3. Add custom domain in Azure Portal (optional)"
    echo "   4. Site is hosted on Azure CDN for fast loading in India!"
    echo ""
    echo "🚀 Your portfolio is hosted in Mumbai for optimal performance!"
    
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you authorized GitHub (check the device code URL)"
    echo "2. Verify your GitHub repo exists: $GITHUB_REPO"
    echo "3. Check if centralindia is in your allowed regions"
    echo ""
    echo "To check allowed regions:"
    echo "az account list-locations --output table | grep India"
    exit 1
fi
