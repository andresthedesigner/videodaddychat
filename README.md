# Video Daddy Chat

**Video Daddy Chat** is an AI-powered chat assistant designed to help YouTube creators make better videos. Get help with video ideas, titles, descriptions, scripts, SEO optimization, thumbnail concepts, and more.

Built on top of [Zola](https://github.com/ibelick/zola), the open-source chat interface.

## Features

- 🎬 **YouTube-focused AI assistance** - Get help with every aspect of your YouTube content
- 🤖 **Multi-model support** - OpenAI, Claude, Gemini, Mistral, Ollama (local models)
- 🔑 **Bring your own API key (BYOK)** - Use your own keys via OpenRouter
- 📎 **File uploads** - Share scripts, thumbnails, and more for AI feedback
- 🎨 **Clean, responsive UI** - Light/dark themes with modern design
- 🏠 **Self-hostable** - Full control over your data
- ⚙️ **Customizable** - User system prompts, multiple layout options
- 🖥️ **Local AI with Ollama** - Run models locally with automatic detection
- 🔌 **MCP support** (work in progress)

## What Can Video Daddy Help With?

- **Video Ideas** - Brainstorm content ideas based on your niche and audience
- **Titles & Thumbnails** - Craft click-worthy titles and thumbnail concepts
- **Scripts & Outlines** - Structure your videos for maximum engagement
- **SEO Optimization** - Improve descriptions, tags, and discoverability
- **Content Strategy** - Plan your upload schedule and content calendar
- **Audience Growth** - Get tips on community building and engagement
- **Analytics Insights** - Understand what's working and what to improve

## Quick Start

### Option 1: With OpenAI (Cloud)

```bash
git clone https://github.com/andresthedesigner/videodaddychat.git
cd videodaddychat
bun install
echo "OPENAI_API_KEY=your-key" > .env.local
bun dev
```

### Option 2: With Ollama (Local)

```bash
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2  # or any model you prefer

# Clone and run Video Daddy Chat
git clone https://github.com/andresthedesigner/videodaddychat.git
cd videodaddychat
bun install
bun dev
```

Video Daddy Chat will automatically detect your local Ollama models!

### Option 3: Docker with Ollama

```bash
git clone https://github.com/andresthedesigner/videodaddychat.git
cd videodaddychat
docker-compose -f docker-compose.ollama.yml up
```

To unlock features like auth, file uploads, see [INSTALL.md](./INSTALL.md).

## Built With

- [prompt-kit](https://prompt-kit.com/) — AI components
- [shadcn/ui](https://ui.shadcn.com) — core components
- [motion-primitives](https://motion-primitives.com) — animated components
- [vercel ai sdk](https://vercel.com/blog/introducing-the-vercel-ai-sdk) — model integration, AI features
- [supabase](https://supabase.com) — auth and storage

## Based On

This project is a fork of [Zola](https://github.com/ibelick/zola), the open-source AI chat interface. Special thanks to the Zola team for creating such an excellent foundation.

## License

Apache License 2.0

## Notes

This is a beta release. The codebase is evolving and may change.
