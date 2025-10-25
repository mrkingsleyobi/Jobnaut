# JobNaut - AI-Powered Job Market Navigator

[![CI](https://github.com/mrkingsleyobi/jobnaut/actions/workflows/ci.yml/badge.svg)](https://github.com/mrkingsleyobi/jobnaut/actions/workflows/ci.yml)
[![Deploy](https://github.com/mrkingsleyobi/jobnaut/actions/workflows/deploy.yml/badge.svg)](https://github.com/mrkingsleyobi/jobnaut/actions/workflows/deploy.yml)

JobNaut is a comprehensive AI-powered job market navigator that helps job seekers discover opportunities and receive personalized career coaching through advanced AI technology.

## 🚀 Features

### 🔍 Intelligent Job Search
- Real-time job listings from multiple sources
- Advanced search with filters (location, salary, experience level)
- Skill-based job recommendations
- Fast search powered by Meilisearch

### 🤖 AI Career Coach
- Personalized career guidance and advice
- Interactive chatbot powered by Hugging Face models
- Skill gap analysis and improvement suggestions
- Resume optimization tips

### 👤 User Profile Management
- Comprehensive profile with skills and experience
- Saved jobs tracking with application status
- Personalized job recommendations
- Career progress monitoring

### 📊 Analytics & Insights
- Skill demand trend analysis
- Salary range visualization
- Market insights and recommendations
- Personalized career path suggestions

### 🛡️ Security & Privacy
- Secure authentication with Clerk
- Data encryption for sensitive information
- Rate limiting and DDoS protection
- Comprehensive input validation

## 🏗️ Architecture

### Backend
- **Node.js** with **tRPC** for type-safe API development
- **PostgreSQL** database with **Prisma ORM**
- **Meilisearch** for fast, relevant search
- **Express** for web server functionality
- **Clerk** for authentication and user management

### Frontend
- **Nuxt 3** (Vue.js) for modern, responsive UI
- **Tailwind CSS** for styling
- **Vitest** and **Jest** for comprehensive testing
- **Responsive design** for mobile and desktop

### AI Services
- **Python FastAPI** for AI microservices
- **Hugging Face Transformers** for NLP models
- **LangChain** for conversation management
- **JSearch API** for job data aggregation

### Infrastructure
- **Docker** containerization for easy deployment
- **GitHub Actions** for CI/CD
- **k6** for load testing
- **Winston** for logging and monitoring

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional, for containerized deployment)
- Python 3.8+ (for AI services)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/mrkingsleyobi/jobnaut.git
cd jobnaut
```

2. **Install dependencies:**
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

3. **Set up environment variables:**
```bash
# Backend environment (.env)
cp .env.example .env
# Edit .env with your configuration

# Frontend environment (frontend/.env)
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. **Run the development server:**
```bash
# Start backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

5. **Run AI services (optional):**
```bash
# Navigate to AI services directory
cd ai-services
pip install -r requirements.txt
python main.py
```

## 🐳 Docker Deployment

### Development Setup
```bash
docker-compose up -d
```

### Production Deployment
```bash
# Build and push images
docker build -t jobnaut/backend:latest .
docker build -t jobnaut/frontend:latest ./frontend

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### Backend Tests
```bash
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Load Testing
```bash
# Install k6
npm install -g k6

# Run load tests
k6 run tests/load-testing/job-search-test.js
k6 run tests/load-testing/auth-test.js
```

## 📚 Documentation

- [Deployment Guide](docs/deployment-guide.md)
- [Security Enhancements](docs/security-enhancements.md)
- [Performance Optimization](docs/performance-optimization.md)
- [Load Testing](docs/load-testing.md)
- [Production Deployment](docs/production-deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Clerk](https://clerk.dev) for authentication services
- [Hugging Face](https://huggingface.co) for AI models
- [Meilisearch](https://meilisearch.com) for search technology
- [JSearch](https://jsearch.io) for job data APIs

## 🚀 Ready for Production!

JobNaut is production-ready with:
- Containerized deployment
- Automated CI/CD pipeline
- Comprehensive monitoring
- Security best practices
- Scalable architecture

Start helping job seekers today with AI-powered career navigation!