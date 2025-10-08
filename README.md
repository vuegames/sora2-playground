# Sora 2 Playground

A modern web application for generating videos with OpenAI's Sora 2 model. Create stunning AI-generated videos directly in your browser with full control over generation parameters.

![Sora 2 Playground](./public/sora-playground.png)

## Features

- 🎬 **Video Generation**: Generate videos with Sora 2 and Sora 2 Pro models
- 🎨 **Full Control**: Customize model, duration, resolution, and reference images
- 📊 **Real-time Progress**: Watch generation progress with live updates
- 📚 **Video Library**: View and manage all your generated videos
- 🗑️ **Easy Management**: Delete videos with a single click
- 👁️ **Secure API Key**: Toggle visibility for your OpenAI API key
- 💾 **Lazy Loading**: Videos load on-demand to optimize bandwidth
- 🎯 **Client-side Only**: All API calls happen directly from your browser

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key with Sora access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amirzak/sora2-playground.git
cd sora2-playground
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Enter your API key**: Input your OpenAI API key (it's never stored, only used for requests)
2. **Write a prompt**: Describe the video you want to generate
3. **Customize settings**: Choose model, duration, and resolution
4. **Optional reference**: Upload an image to guide generation
5. **Generate**: Click generate and watch the progress bar
6. **Manage library**: View, play, and delete your videos

## Available Parameters

- **Model**: 
  - `sora-2` - Standard model
  - `sora-2-pro` - Professional model with enhanced quality
  
- **Duration**: 4, 8, or 12 seconds

- **Resolution**:
  - `720x1280` - Portrait
  - `1280x720` - Landscape
  - `1024x1792` - Tall
  - `1792x1024` - Wide

- **Input Reference**: Optional image to guide video generation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **API**: OpenAI SDK
- **Build Tool**: Turbopack

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## SEO Features

This project is fully optimized for search engines with:

- ✅ **Complete Metadata**: Title, description, keywords, and authors
- ✅ **Open Graph Tags**: For social media sharing (Facebook, LinkedIn)
- ✅ **Twitter Cards**: Optimized preview cards for Twitter
- ✅ **Structured Data**: JSON-LD schema for rich search results
- ✅ **Robots.txt**: Proper crawler instructions
- ✅ **Dynamic Sitemap**: Auto-generated XML sitemap
- ✅ **Web App Manifest**: PWA support
- ✅ **Semantic HTML**: Proper heading hierarchy and structure

### Customization for Production

Before deploying, update the following in `src/app/layout.tsx`:

1. **Twitter Handle**: Update `@yourusername` to your Twitter handle
2. **Google Verification**: Replace `your-google-verification-code` with your actual code
3. **Social Image**: Ensure `/sora-playground.png` is optimized (1200x630px recommended)

## Security Note

Your OpenAI API key is only used for direct API calls from your browser and is never sent to any server or stored anywhere. Always keep your API key secure and never commit it to version control.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [OpenAI Sora 2](https://openai.com/sora)
- Powered by [Next.js](https://nextjs.org)
