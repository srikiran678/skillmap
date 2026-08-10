// ============================================================
// AI TOOLS RELEASES DATABASE
// Comprehensive data for newly released AI tools, installation steps, and guides
// ============================================================

export const AI_TOOLS_DB = [
  {
    id: 'tool-claude-code',
    name: 'Claude Code CLI Agent',
    developer: 'Anthropic',
    releaseDate: 'Latest 2026 Release',
    category: 'Agentic Frameworks',
    tagline: 'Agentic coding tool in your terminal that understands your codebase, edits files, and executes commands.',
    icon: '🤖',
    rating: 9.9,
    officialUrl: 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview',
    platforms: ['macOS', 'Windows', 'Linux'],
    prerequisites: ['Node.js 18+', 'Anthropic API Key'],
    quickInstallCmd: 'npm install -g @anthropic-ai/claude-code',
    description: 'Claude Code is an agentic coding assistant that runs in your terminal. It can navigate your repo, answer complex architecture questions, refactor across multiple files, execute tests, and create git commits autonomously.',
    installSteps: {
      macOS: [
        'Open Terminal or iTerm2.',
        'Ensure Node.js is installed: `node -v` (version >= 18 required).',
        'Install globally via npm: `npm install -g @anthropic-ai/claude-code`',
        'Set your Anthropic API Key: `export ANTHROPIC_API_KEY="your-api-key"`',
        'Navigate to your workspace directory and run: `claude`',
        'Complete the 1-time OAuth authentication prompt in browser.'
      ],
      Windows: [
        'Open PowerShell or Windows Terminal (run as Administrator recommended).',
        'Ensure Node.js 18+ is installed. If not, run `winget install OpenJS.NodeJS.LTS`.',
        'Install Claude Code globally: `npm install -g @anthropic-ai/claude-code`',
        'Set API Key environment variable: `$env:ANTHROPIC_API_KEY="your-api-key"`',
        'Navigate to your project root and start: `claude`'
      ],
      Linux: [
        'Open your terminal shell.',
        'Verify Node.js: `node -v`',
        'Install globally: `sudo npm install -g @anthropic-ai/claude-code`',
        'Add key to your shell config: `echo "export ANTHROPIC_API_KEY=your_key" >> ~/.bashrc && source ~/.bashrc`',
        'Launch: `claude`'
      ]
    },
    usageGuide: 'Type `claude` in your project folder. Give high-level prompt like "Refactor auth middleware to handle JWT refresh tokens", and Claude Code will read relevant files, plan edits, execute them, and run `npm test` automatically.'
  },
  {
    id: 'tool-cursor',
    name: 'Cursor AI IDE',
    developer: 'Anysphere',
    releaseDate: 'v0.45+ (2026)',
    category: 'Code Editors',
    tagline: 'An AI-native code editor built on VS Code with instantaneous multi-file edits and terminal control.',
    icon: '⚡',
    rating: 9.8,
    officialUrl: 'https://cursor.com',
    platforms: ['macOS', 'Windows', 'Linux'],
    prerequisites: ['None (Standalone IDE)'],
    quickInstallCmd: 'winget install Anysphere.Cursor / brew install --cask cursor',
    description: 'Cursor is the premier AI-first IDE fork of VS Code. It features Cmd+K inline editing, Cmd+I agentic composer mode across your entire repository, and custom `.cursorrules` configuration files.',
    installSteps: {
      macOS: [
        'Download Installer DMG from cursor.com or run: `brew install --cask cursor`',
        'Open Cursor from Applications.',
        'Import existing VS Code extensions & keybindings with 1 click.',
        'Press `Cmd + Shift + J` to open AI Settings and select your preferred model (Claude 3.7 Sonnet / GPT-4o / DeepSeek R1).'
      ],
      Windows: [
        'Run Windows package manager: `winget install Anysphere.Cursor` or download `.exe` from cursor.com.',
        'Launch Cursor from Start Menu.',
        'Import VS Code settings on first boot.',
        'Press `Ctrl + K` inside any file to initiate inline AI code generation.'
      ],
      Linux: [
        'Download AppImage or `.deb` / `.rpm` package from cursor.com.',
        'Make AppImage executable: `chmod +x Cursor-*.AppImage`',
        'Run: `./Cursor-*.AppImage --no-sandbox`'
      ]
    },
    usageGuide: 'Use `Cmd + I` (or `Ctrl + I`) to open Composer. Ask Cursor to "Add a dark mode toggle across all pages", and it will generate diffs for all affected CSS and React files at once.'
  },
  {
    id: 'tool-ollama',
    name: 'Ollama',
    developer: 'Ollama Team',
    releaseDate: 'v0.5+ (2026)',
    category: 'Local LLMs',
    tagline: 'Get up and running with Llama 3.3, DeepSeek R1, Mistral, and Qwen locally on your laptop.',
    icon: '🦙',
    rating: 9.9,
    officialUrl: 'https://ollama.com',
    platforms: ['macOS', 'Windows', 'Linux'],
    prerequisites: ['8GB+ RAM (16GB+ recommended for 14B+ models)'],
    quickInstallCmd: 'ollama run deepseek-r1:8b',
    description: 'Ollama allows you to download and run open-weights Large Language Models locally with CPU/GPU acceleration and a local REST API endpoint compatible with OpenAI client SDKs.',
    installSteps: {
      macOS: [
        'Download Ollama.zip from ollama.com or run: `brew install ollama`',
        'Start Ollama background app.',
        'Open Terminal and run your first reasoning model: `ollama run deepseek-r1:8b`',
        'Test API endpoint locally at `http://localhost:11434`'
      ],
      Windows: [
        'Download OllamaSetup.exe from ollama.com.',
        'Run installer and allow GPU acceleration detection (NVIDIA CUDA / AMD ROCm / Intel Arc).',
        'Open PowerShell and execute: `ollama run llama3.3`',
        'To list downloaded models, run: `ollama list`'
      ],
      Linux: [
        'Run official installation script: `curl -fsSL https://ollama.com/install.sh | sh`',
        'Verify service status: `systemctl status ollama`',
        'Pull model: `ollama run qwen2.5-coder:7b`'
      ]
    },
    usageGuide: 'Run `ollama run deepseek-r1:8b` in your terminal to start a private, offline terminal chat session. Or point any app (like Open WebUI or VS Code) to `http://localhost:11434`.'
  },
  {
    id: 'tool-vllm',
    name: 'vLLM Inference Engine',
    developer: 'vLLM Team / UC Berkeley',
    releaseDate: 'v0.7+ (2026)',
    category: 'Local LLMs',
    tagline: 'High-throughput and memory-efficient LLM serving engine with PagedAttention.',
    icon: '🚀',
    rating: 9.7,
    officialUrl: 'https://docs.vllm.ai',
    platforms: ['Linux', 'macOS (WSL)'],
    prerequisites: ['Python 3.9+', 'NVIDIA GPU (CUDA 12+)'],
    quickInstallCmd: 'pip install vllm',
    description: 'vLLM is an open-source library for fast LLM inference and serving. It delivers 2-4x higher throughput than HuggingFace TGI using PagedAttention memory management.',
    installSteps: {
      Linux: [
        'Create Python virtual environment: `python3 -m venv venv && source venv/bin/activate`',
        'Install PyTorch with CUDA support.',
        'Install vLLM: `pip install vllm`',
        'Start OpenAI-compatible API server: `python3 -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-Coder-7B-Instruct`',
        'Send completion request to `http://localhost:8000/v1/chat/completions`'
      ],
      Windows: [
        'Install WSL2 (Windows Subsystem for Linux): `wsl --install`',
        'Launch Ubuntu shell inside WSL2.',
        'Follow Linux installation steps above using PyTorch CUDA.'
      ]
    },
    usageGuide: 'Use vLLM to serve high-traffic LLM API endpoints in production environments with continuous batching and spec decoding.'
  },
  {
    id: 'tool-comfyui',
    name: 'ComfyUI',
    developer: 'Comfy Anonymous',
    releaseDate: '2026 Master Release',
    category: 'Vision/GenAI',
    tagline: 'Modular node-based GUI and backend for Stable Diffusion, FLUX, and Generative Video models.',
    icon: '🎨',
    rating: 9.6,
    officialUrl: 'https://github.com/comfyanonymous/ComfyUI',
    platforms: ['Windows', 'macOS', 'Linux'],
    prerequisites: ['Python 3.10+', 'NVIDIA / Apple Silicon GPU'],
    quickInstallCmd: 'git clone https://github.com/comfyanonymous/ComfyUI.git',
    description: 'ComfyUI is a powerful node-based interface to build custom generative image, audio, and video synthesis pipelines. It is the industry standard for ControlNet, IP-Adapter, and FLUX workflows.',
    installSteps: {
      Windows: [
        'Download standalone portable package `.7z` from ComfyUI release page.',
        'Extract folder to `C:\\ComfyUI`.',
        'Run `run_nvidia_gpu.bat` (or `run_cpu.bat`).',
        'Place checkpoints/models into `models/checkpoints/` directory.',
        'Access web UI at `http://127.0.0.1:8188`'
      ],
      macOS: [
        'Clone repository: `git clone https://github.com/comfyanonymous/ComfyUI`',
        'Create venv: `python3 -m venv venv && source venv/bin/activate`',
        'Install PyTorch MPS for Metal acceleration.',
        'Run: `python main.py --force-fp16`'
      ]
    },
    usageGuide: 'Drag and drop any generated PNG image into ComfyUI to instantly load its complete node workflow graph.'
  },
  {
    id: 'tool-open-webui',
    name: 'Open WebUI',
    developer: 'Open WebUI Community',
    releaseDate: 'v0.4+ (2026)',
    category: 'Agentic Frameworks',
    tagline: 'Self-hosted, extensible, user-friendly AI web interface for Ollama & OpenAI APIs.',
    icon: '🌐',
    rating: 9.8,
    officialUrl: 'https://github.com/open-webui/open-webui',
    platforms: ['macOS', 'Windows', 'Linux', 'Web'],
    prerequisites: ['Docker / Python 3.11'],
    quickInstallCmd: 'docker run -d -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main',
    description: 'Open WebUI is a feature-packed web application for managing private local models, RAG document uploading, voice synthesis, multi-model chat comparisons, and role-based permissions.',
    installSteps: {
      Windows: [
        'Install Docker Desktop for Windows.',
        'Ensure Ollama is running on host machine.',
        'Run PowerShell command: `docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main`',
        'Open browser at `http://localhost:3000`'
      ],
      macOS: [
        'Run Docker Desktop or OrbStack.',
        'Execute Docker command in terminal.',
        'Navigate to `http://localhost:3000` and create admin account.'
      ]
    },
    usageGuide: 'Upload PDFs, Word files, or Markdown documents to build your personal local RAG knowledge base inside a ChatGPT-like web UI.'
  }
];
