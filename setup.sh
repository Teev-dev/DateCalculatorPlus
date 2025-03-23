#!/bin/bash

# DateCalculatorPlus Setup Script
echo "🚀 Setting up DateCalculatorPlus..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install react \
    react-dom \
    react-router-dom \
    date-fns \
    tailwindcss \
    postcss \
    autoprefixer \
    express \
    drizzle-orm \
    @radix-ui/react-dropdown-menu \
    @radix-ui/react-popover \
    @radix-ui/react-toast \
    @radix-ui/react-dialog \
    @tanstack/react-query

# Install dev dependencies
echo "🛠️ Installing development dependencies..."
npm install -D typescript \
    @types/react \
    @types/react-dom \
    @types/express \
    vite \
    @vitejs/plugin-react \
    ts-node \
    prettier \
    eslint \
    eslint-plugin-react \
    eslint-plugin-react-hooks \
    eslint-config-prettier

# Create Tailwind config if it doesn't exist
if [ ! -f "tailwind.config.js" ]; then
    echo "🎨 Creating Tailwind CSS configuration..."
    npx tailwindcss init -p
fi

# Create Vite config if it doesn't exist
if [ ! -f "vite.config.ts" ]; then
    echo "⚙️ Creating Vite configuration..."
    cat > vite.config.ts << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
EOF
fi

# Create tsconfig if it doesn't exist
if [ ! -f "tsconfig.json" ]; then
    echo "📝 Creating TypeScript configuration..."
    cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
fi

# Create tsconfig.node.json if it doesn't exist
if [ ! -f "tsconfig.node.json" ]; then
    cat > tsconfig.node.json << EOF
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF
fi

# Create index.html if it doesn't exist
if [ ! -f "index.html" ]; then
    echo "🖥️ Creating index.html..."
    cat > index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DateCalculatorPlus - Advanced Date Calculator</title>
    <meta name="description" content="Advanced date calculation tool for workdays, timezones, and holidays" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
fi

# Create main.tsx if it doesn't exist
if [ ! -f "src/main.tsx" ]; then
    mkdir -p src
    echo "🔄 Creating main.tsx..."
    cat > src/main.tsx << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
fi

# Create index.css if it doesn't exist
if [ ! -f "src/index.css" ]; then
    echo "🎨 Creating index.css with Tailwind directives..."
    cat > src/index.css << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #1a1a1a;
  background-color: #f9fafb;
}
EOF
fi

# Make sure src directory exists with necessary subdirectories
mkdir -p src/components/calculator
mkdir -p src/components/dashboard
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/lib/date
mkdir -p src/server/db
mkdir -p src/server/api

echo "✅ Setup complete! To start the development server, run:"
echo "npm run dev" 