#!/bin/bash

# Colony Sim - Sync Notion and Push to GitHub
# This script syncs data from Notion to JSON and pushes to GitHub

echo "🎮 Colony Sim - Sync & Push"
echo "================================"
echo ""

# Step 1: Sync from Notion
echo "📡 Step 1: Syncing data from Notion..."
npm run sync-notion

if [ $? -ne 0 ]; then
    echo "❌ Failed to sync from Notion. Make sure the backend is running!"
    echo "   Run: cd notion-backend && node index.js"
    exit 1
fi

echo ""

# Step 2: Git add all changes
echo "📝 Step 2: Staging changes..."
git add .

# Step 3: Commit
echo "💾 Step 3: Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Update game configuration from Notion"
fi

git commit -m "$commit_message"

echo ""

# Step 4: Push to GitHub
echo "🚀 Step 4: Pushing to GitHub..."
git push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Changes pushed to GitHub"
    echo ""
    echo "🌐 Your game will be updated at:"
    echo "   https://tommyparallelnft.github.io/ColonySim/"
    echo ""
    echo "⏱️  GitHub Pages will rebuild in ~1-2 minutes"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi

