# Colony Sim - Notion Backend

This is the backend API server that connects to Notion to fetch building configurations for the Colony Sim game.

## Quick Deploy to Vercel

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   cd notion-backend
   vercel
   ```

3. **Add Environment Variables in Vercel**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
     - `NOTION_INTEGRATION_TOKEN`: Your Notion integration token
     - `NOTION_BUILDINGS_DATABASE_ID`: Your Notion database ID
     - `NODE_ENV`: production

4. **Get Your Backend URL**:
   After deployment, Vercel will give you a URL like: `https://your-backend-name.vercel.app`

5. **Update Frontend Environment Variables**:
   In your main project root, update `.env`:
   ```
   VITE_USE_NOTION=true
   VITE_BACKEND_URL=https://your-backend-name.vercel.app
   ```

6. **Rebuild and Deploy Frontend**:
   ```bash
   npm run build
   git add .
   git commit -m "Update backend URL for production"
   git push
   ```

## Alternative: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tommyparallelnft/ColonySim)

After deploying, don't forget to add the environment variables in the Vercel dashboard!

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp env.example .env

# Start the server
npm run dev
```

The server will run on `http://localhost:8000`

