# EcoSense AI 🌱

**Environmental Intelligence Platform for a Sustainable Future**

EcoSense AI is a comprehensive environmental monitoring and conservation platform that leverages artificial intelligence to help users make informed decisions about environmental protection, wildlife conservation, and sustainable living.

## 🌍 What is EcoSense AI?

EcoSense AI combines cutting-edge AI technology with environmental science to provide:

- **Ocean Protection**: Marine life identification and ocean health monitoring
- **Wildlife Conservation**: Endangered species tracking and animal identification
- **Forest Conservation**: Forest health monitoring and tree species identification
- **Sustainable Living**: Carbon footprint calculation, food waste reduction, and eco-friendly tips
- **Energy & Transportation**: Renewable energy optimization and sustainable transport planning
- **Water Conservation**: Water usage tracking and conservation recommendations
- **Climate Monitoring**: Real-time environmental data analysis and climate insights

## 🚀 Key Features

### Ocean & Marine Life
- **Ocean Scanner**: Identify marine species and learn about ocean conservation
- **Marine Health Monitoring**: Track ocean conditions and marine ecosystem health

### Wildlife & Biodiversity
- **Animal Identifier**: AI-powered species identification from photos
- **Endangered Animals Tracker**: Monitor and learn about threatened species
- **Forest Health Monitor**: Assess forest ecosystem health and biodiversity

### Sustainable Living Tools
- **Carbon Footprint Calculator**: Calculate and track your environmental impact
- **Food Waste Reducer**: Transform leftovers into sustainable meal solutions
- **Water Usage Tracker**: Monitor and optimize water consumption
- **Energy Optimizer**: Analyze and improve energy efficiency
- **Green Home Tips**: Personalized eco-friendly living recommendations

### Smart Analysis
- **Photo Analyzer**: AI-powered environmental analysis from images
- **Activity Scanner**: Track daily activities and their environmental impact
- **Climate Monitor**: Real-time environmental data and trend analysis

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun package manager

### Getting Started

Follow these steps to set up the development environment:

```sh
# Step 1: Clone the repository
git clone https://github.com/TheAgencyMGE/green-lens-ai.git

# Step 2: Navigate to the project directory
cd green-lens-ai

# Step 3: Install dependencies
npm install
# or if using bun
bun install

# Step 4: Start the development server
npm run dev
# or if using bun
bun dev
```

The application will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Cloud Vision API (for image analysis)
VITE_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key

# Gemini AI API (for environmental intelligence)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional: Additional API keys for enhanced features
VITE_WEATHER_API_KEY=your_weather_api_key
VITE_OCEAN_DATA_API_KEY=your_ocean_data_api_key
```

## 🎯 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── analysis/       # Analysis-specific components
│   ├── dashboard/      # Dashboard components
│   ├── navigation/     # Navigation components
│   └── ui/            # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Application pages/routes
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
└── utils/              # Helper utilities
```

## 🧪 Technology Stack

This project is built with modern web technologies:

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **AI Integration**: Google Gemini AI, Google Cloud Vision
- **Charts & Visualization**: Chart.js
- **Maps**: React Map GL (Mapbox)
- **Animations**: Framer Motion

## 🚀 Deployment

### Production Build

```sh
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

The application can be deployed to various platforms:

- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Continuous deployment support
- **GitHub Pages**: Static site hosting
- **Docker**: Containerized deployment

## 🌟 Features in Development

- Real-time satellite imagery analysis
- Community-driven conservation projects
- Mobile app companion
- Offline mode for field research
- Advanced machine learning models for species identification

## 🤝 Contributing

We welcome contributions to EcoSense AI! Please read our contributing guidelines before submitting pull requests.

### Development Guidelines

1. Follow TypeScript best practices
2. Use semantic commit messages
3. Write tests for new features
4. Ensure accessibility compliance
5. Optimize for performance and sustainability

## 📊 Environmental Impact

EcoSense AI is committed to digital sustainability:
- Green hosting solutions
- Optimized code for reduced energy consumption
- Carbon-neutral development practices
- Support for environmental conservation projects

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Mission Statement

Our mission is to democratize environmental intelligence and empower individuals, communities, and organizations to make data-driven decisions for a sustainable future. Through AI-powered tools and real-time environmental data, we're building a platform that makes environmental conservation accessible to everyone.

---

**Made with 💚 for the planet**
