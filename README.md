# TechFynite Frontend

A modern Next.js application built with TypeScript, Tailwind CSS, and Firebase.

## 🚀 Deployment on Vercel

### Prerequisites
- Vercel account
- GitHub/GitLab/Bitbucket repository connected to Vercel
- Environment variables configured

### Quick Deploy

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will automatically detect it as a Next.js project

2. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
   NODE_ENV=production
   ```

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - Each push to your main branch will trigger a new deployment

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1

# Environment
NODE_ENV=production
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

- `app/` - Next.js 13+ app directory with pages and layouts
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions
- `assets/` - Static assets (images, icons)

## 🎨 Tech Stack

- **Framework**: Next.js 15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React, React Icons
- **Charts**: Chart.js + React Chart.js 2
- **Forms**: React Hook Form + Zod validation

## 🔧 Configuration Files

- `vercel.json` - Vercel deployment configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `firebase.config.ts` - Firebase configuration

## 📝 Notes

- The project uses Next.js 15 with the app directory structure
- Firebase configuration is already set up in `firebase.config.ts`
- API base URL can be configured via environment variables
- Images are optimized with Next.js Image component
- The project includes proper TypeScript types for all components
