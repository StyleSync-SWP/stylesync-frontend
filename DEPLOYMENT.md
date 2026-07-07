# StyleSync Deployment Guide

Complete guide for deploying StyleSync (frontend + AI backend) to production.

## Architecture Overview

StyleSync consists of:
- **Frontend**: React + Vite application
- **Backend**: Python/FastAPI with AI integration
- **Database**: PostgreSQL for user data
- **AI Service**: OpenAI API for outfit generation
- **Storage**: Cloud storage for images

## Recommended Hosting Solutions

### Option 1: Vercel + Railway (Recommended for ease of use)
- **Frontend**: Vercel (excellent for React/Vite apps)
- **Backend**: Railway (great for Python/FastAPI)
- **Database**: Railway PostgreSQL
- **Pros**: Easy setup, free tiers available, automatic SSL
- **Cons**: Can get expensive at scale

### Option 2: AWS (Recommended for scalability)
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS ECS or EC2
- **Database**: AWS RDS PostgreSQL
- **AI**: OpenAI API (external)
- **Pros**: Highly scalable, cost-effective at scale
- **Cons**: More complex setup

### Option 3: DigitalOcean (Good balance)
- **Frontend**: DigitalOcean App Platform
- **Backend**: DigitalOcean Droplets or App Platform
- **Database**: DigitalOcean Managed PostgreSQL
- **Pros**: Good balance of cost and features
- **Cons**: Less automated than Vercel

## Step-by-Step Deployment Guide (Vercel + Railway)

### Prerequisites
- Git repository (GitHub/GitLab)
- Vercel account
- Railway account
- OpenAI API key
- Domain name (optional)

### Step 1: Environment Variables Setup

Create the following environment files locally:

#### `.env.development` (Local Development)
```bash
VITE_API_URL=http://localhost:8000
VITE_ENV=development
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true
```

#### `.env.production` (Production)
```bash
# You'll fill these in during deployment
VITE_API_URL=https://your-backend.railway.app
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

**Note**: Create these files manually in your project root. The `.env.example` file shows the template.

### Step 2: Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up and connect your GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your backend repository
   - Railway will detect it as a Python project
   - Add environment variables:
     ```bash
     DATABASE_URL=postgresql://...
     OPENAI_API_KEY=sk-...
     JWT_SECRET=your-secret-key
     ENVIRONMENT=production
     ```

3. **Add PostgreSQL Database**
   - In Railway project, click "New" → "Database"
   - Select PostgreSQL
   - Railway will provide `DATABASE_URL`

4. **Get Backend URL**
   - Railway will provide a URL like `https://your-backend.railway.app`
   - Copy this for frontend configuration

### Step 3: Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up and connect your GitHub

2. **Deploy Frontend**
   - Click "Add New Project" → "Import your Git repository"
   - Select your frontend repository
   - Configure build settings:
     ```bash
     Framework Preset: Vite
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     ```bash
     VITE_API_URL=https://your-backend.railway.app
     VITE_ENV=production
     VITE_ENABLE_ANALYTICS=true
     VITE_ENABLE_DEBUG=false
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - You'll get a URL like `https://your-app.vercel.app`

### Step 4: Domain Configuration (Optional)

1. **Custom Domain on Vercel**
   - In Vercel project settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **CORS Configuration**
   - Update backend to allow requests from your custom domain
   - Add domain to CORS allowed origins

### Step 5: OpenAI API Setup

1. **Get OpenAI API Key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create account and get API key
   - Add to Railway environment variables

2. **Configure AI Model**
   - Set which model to use (gpt-4, gpt-3.5-turbo, etc.)
   - Configure rate limits and usage monitoring

### Step 6: Testing

1. **Test Backend**
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Test Frontend**
   - Visit your Vercel URL
   - Test user registration/login
   - Test outfit generation
   - Test image upload

3. **Test Integration**
   - Verify frontend can communicate with backend
   - Test AI outfit generation
   - Test database persistence

## Alternative: AWS Deployment

### Step 1: S3 + CloudFront (Frontend)

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://stylesync-frontend
   ```

2. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://stylesync-frontend
   ```

3. **Configure CloudFront**
   - Create distribution pointing to S3 bucket
   - Enable SSL certificate

### Step 2: ECS (Backend)

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name stylesync-backend
   ```

2. **Build and Push Docker Image**
   ```bash
   docker build -t stylesync-backend .
   docker tag stylesync-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/stylesync-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/stylesync-backend:latest
   ```

3. **Deploy to ECS**
   - Create task definition
   - Create service
   - Configure load balancer

### Step 3: RDS (Database)

1. **Create PostgreSQL Instance**
   ```bash
   aws rds create-db-instance --db-instance-identifier stylesync-db --db-instance-class db.t3.micro --engine postgres
   ```

## Environment Variables Best Practices

### Development
```bash
VITE_API_URL=http://localhost:8000
VITE_ENV=development
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=true
```

### Production
```bash
VITE_API_URL=https://your-backend.railway.app
VITE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Security Notes
- Never commit `.env` files
- Use different API keys for dev/prod
- Rotate secrets regularly
- Use environment-specific configurations

## Monitoring and Maintenance

### Health Checks
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor API response times
- Track error rates

### Logging
- Use structured logging
- Centralize logs (CloudWatch, LogRocket)
- Set up alerts for critical errors

### Backup Strategy
- Daily database backups
- Backup configuration files
- Document recovery procedures

## Cost Optimization

### Free Tiers
- Vercel: Free for personal projects
- Railway: $5 free credit
- AWS: 12 months free tier

### Scaling Tips
- Use CDN for static assets
- Implement caching strategies
- Optimize image sizes
- Use serverless for sporadic traffic

## Troubleshooting

### Common Issues

**CORS Errors**
- Add frontend domain to backend CORS configuration
- Check preflight requests are handled

**Environment Variables Not Loading**
- Verify variables are set in platform dashboard
- Restart deployment after adding variables
- Check variable names match exactly

**API Connection Issues**
- Verify backend URL is correct
- Check backend is running and accessible
- Test API endpoints directly

**Build Failures**
- Check build logs for specific errors
- Verify all dependencies are installed
- Ensure Node.js version compatibility

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Secrets are not committed to git
- [ ] Database backups are configured
- [ ] Monitoring is set up
- [ ] Error handling is robust
- [ ] User data is encrypted

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [AWS Documentation](https://docs.aws.amazon.com)
- [OpenAI API Documentation](https://platform.openai.com/docs)
