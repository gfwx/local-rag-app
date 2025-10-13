# Local RAG Chat App

## Overview

This is a locally-run Retrieval-Augmented Generation (RAG) chat application built with Next.js. It provides a simple web interface for interacting with a local AI model via Ollama. The app uses the Vercel AI SDK for chat functionality and streams responses from the Gemma 3 model.

Note: The current implementation focuses on basic chat; RAG features (e.g., document retrieval) can be extended via the Ollama backend or additional integrations.

## Requirements

- Node.js 18+ (or compatible runtime)
- Bun (recommended for package management) or npm/yarn/pnpm
- Ollama installed and running on `http://localhost:11434`
- Ollama model: `gemma3:4b-it-qat` (install via `ollama pull gemma3:4b-it-qat`)

## Installation

1. Clone or navigate to the project directory.
2. Install dependencies:
   ```
   bun install
   ```
   (Or `npm install` if using npm.)
3. Ensure Ollama is running and the model is pulled.

## Usage

1. Start the development server:
   ```
   bun dev
   ```
   (Uses Turbopack for faster development.)
2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. Interact with the chat interface: Type messages in the input field and submit to receive AI responses.

The app initializes with a sample conversation. New messages are sent to the `/api/chat` endpoint, which queries the local Ollama instance.

## Scripts

- `bun dev`: Run in development mode.
- `bun build`: Build for production.
- `bun start`: Start the production server.
- `bun lint`: Check code with Biome.
- `bun format`: Format code with Biome.

## Project Structure

- `src/app/`: Next.js app directory with pages and API routes.
  - `page.tsx`: Main chat UI.
  - `api/chat/route.ts`: Chat API handler using Ollama.
- `src/lib/`: Shared components and providers.
  - `providers/chatProvider.tsx`: Manages chat history context.
  - `components/textbox.tsx`: Unused styled input component (can be integrated).
- `public/`: Static assets (icons/SVGs).

## Extending for RAG

To add RAG:
- Integrate a vector database (e.g., via LangChain.js or directly in the API route).
- Upload documents and retrieve relevant chunks before augmenting prompts to Ollama.

## Deployment

For production, build and start the app. Ensure Ollama is accessible. For cloud deployment, configure Ollama or switch to a hosted model provider.

## License

MIT (or specify as needed).