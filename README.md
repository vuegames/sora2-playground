# 🎬 Sora 2 Playground

> **A Simple, open-source web application for generating videos with OpenAI's Sora 2 model**

Create SOTA AI-generated videos directly in your browser with full control over generation parameters. Built with modern web technologies and designed for the best user experience.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sora2playground.com-blue?style=for-the-badge)](https://sora2playground.com)
[![GitHub Stars](https://img.shields.io/github/stars/amirzak/sora2-playground?style=for-the-badge&logo=github)](https://github.com/amirzak/sora2-playground)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<div align="center">
  <img src="./public/sora2-playground.png" alt="Sora 2 Playground" width="200" />
</div>

## ✨ Features

### Core Functionality
- 🎬 **Video Generation**: Generate videos with Sora 2 and Sora 2 Pro models
- 🎨 **Full Control**: Customize model, duration, resolution, and reference images
- 📊 **Real-time Progress**: Watch generation progress with live updates
- 📚 **Video Library**: View and manage all your generated videos
- 🗑️ **Easy Management**: Delete videos with a single click

### User Experience
- 🌗 **Dark/Light Theme**: System-aware theme with manual override
- 👁️ **Secure API Key**: Toggle visibility for your OpenAI API key
- 💾 **Lazy Loading**: Videos load on-demand to optimize bandwidth
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎯 **Client-side Only**: All API calls happen directly from your browser

### Technical Excellence
- ⚡ **Modular Architecture**: Clean, maintainable component structure
- 🚀 **Performance Optimized**: Built with Next.js 15 and Turbopack
- 🔒 **Privacy First**: No data stored on servers, complete client-side operation
- 🛠️ **TypeScript**: Fully typed for better development experience

## 🚀 Quick Start

### 🌐 Try it Online
**No installation needed!** Visit [sora2playground.com](https://sora2playground.com) to start generating videos immediately.

### 💻 Local Development

#### Prerequisites
- Node.js 18+ installed
- An OpenAI API key with Sora access

#### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/amirzak/sora2-playground.git
cd sora2-playground
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

1. **🔑 Enter your API key**: Input your OpenAI API key (it's never stored, only used for requests)
2. **✍️ Write a prompt**: Describe the video you want to generate
3. **⚙️ Customize settings**: Choose model, duration, and resolution
4. **🖼️ Optional reference**: Upload an image to guide generation
5. **🎬 Generate**: Click generate and watch the progress bar
6. **📚 Manage library**: View, play, and delete your videos

## ⚙️ Available Parameters

| Parameter | Options | Description |
|-----------|---------|-------------|
| **Model** | `sora-2`, `sora-2-pro` | Standard or professional model with enhanced quality |
| **Duration** | `4s`, `8s`, `12s` | Video length in seconds |
| **Resolution** | `720x1280` (Portrait)<br>`1280x720` (Landscape)<br>`1024x1792` (Tall)<br>`1792x1024` (Wide) | Output video dimensions |
| **Input Reference** | Image file | Optional image to guide video generation |

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|----------|
| **Framework** | Next.js 15 with App Router | React framework with modern routing |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **API Client** | OpenAI SDK | Official OpenAI API integration |
| **Build Tool** | Turbopack | Ultra-fast development bundler |
| **Deployment** | Vercel | Zero-config deployment platform |

## 📝 Available Scripts

```bash
npm run dev      # 🚀 Start development server
npm run build    # 📦 Build for production
npm run start    # ▶️  Start production server
npm run lint     # 🔍 Run ESLint
```

## 🔒 Privacy & Security

**Your privacy is the top priority:**

- 🛡️ **No Data Storage**: Your API key and videos are never stored on our servers
- 🔐 **Client-side Only**: All API calls happen directly from your browser to OpenAI
- 👁️ **Transparent**: Open source code - you can verify our privacy claims
- 🚫 **No Tracking**: No analytics, no cookies, no data collection

> **Important**: Always keep your API key secure and never commit it to version control.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🌟 **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. 💾 **Commit your changes**: `git commit -m 'Add amazing feature'`
4. 📤 **Push to the branch**: `git push origin feature/amazing-feature`
5. 🎉 **Open a Pull Request**

### Types of Contributions Welcome
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🌐 Translations
- 🧪 Tests

## 🙏 Support the Project

If you found this project helpful, please consider:

- ⭐ **Star this repository** on GitHub
- 🐦 **Follow me on X**: [@AmirZak6](https://x.com/AmirZak6)
- ☕ **Buy me a coffee**: [buymeacoffee.com/amirzak](https://buymeacoffee.com/amirzak)
- 🔄 **Share it** with your friends and colleagues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏗️ Built By

**Amir Zak**

- 🐦 Twitter: [@AmirZak6](https://x.com/AmirZak6)
- ☕ Support: [Buy me a coffee](https://buymeacoffee.com/amirzak)
- 🌐 Live Demo: [sora2playground.com](https://sora2playground.com)

---

<div align="center">

**Made with ❤️ by [Amir Zak](https://x.com/AmirZak6)**

[⭐ Star this repo](https://github.com/amirzak/sora2-playground) • [🌐 Try it live](https://sora2playground.com) • [☕ Buy me a coffee](https://buymeacoffee.com/amirzak)

</div>
