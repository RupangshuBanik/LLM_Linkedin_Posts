# LinkedIn Post Generator

An AI-powered web application that transforms topics into engaging LinkedIn content using Google's Gemini AI.

## Features

- **Multi-step AI Agent**: Intelligent post planning, generation, and refinement
- **Customizable Outputs**: Control tone, audience, length, and number of variations
- **Professional Design**: LinkedIn-inspired interface with responsive design
- **Real-time Progress**: Visual feedback during AI generation process
- **Copy-to-Clipboard**: Easy sharing of generated content
- **Performance Metrics**: Token usage and generation time tracking

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd linkedin-post-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or select a project
   - Generate an API key
   - Copy the key to your `.env` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Deployment

This app can be deployed to any static hosting provider:

- **Vercel**: Connect your GitHub repo and deploy automatically
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **Cloudflare Pages**: Connect repository and set build command to `npm run build`
- **GitHub Pages**: Use GitHub Actions to build and deploy

### Environment Variables for Deployment

Make sure to set the `VITE_GEMINI_API_KEY` environment variable in your hosting provider's dashboard.

## How It Works

The AI agent follows a multi-step process:

1. **Topic Analysis**: Analyzes the input topic and plans different post approaches
2. **Content Generation**: Creates multiple post variations with different styles
3. **Hashtag Extraction**: Generates relevant hashtags for each post
4. **CTA Creation**: Develops compelling calls-to-action
5. **Quality Control**: Applies filters and finalizes content

## Usage

1. Enter your topic or idea in the main input field
2. Optionally customize:
   - **Tone**: Professional, casual, thought leadership, storytelling, or educational
   - **Audience**: General, entrepreneurs, developers, executives, or marketers
   - **Length**: Short (50-100 words), medium (100-200 words), or long (200-300 words)
   - **Number of posts**: 3-5 variations
3. Click "Generate LinkedIn Posts"
4. Copy and paste your favorite generated posts to LinkedIn

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **AI Provider**: Google Gemini 1.5 Flash
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## License

MIT License - feel free to use this code for your own projects!