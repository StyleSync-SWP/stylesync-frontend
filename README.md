# AI Wardrobe Assistant - Frontend

This is the React (Vite) frontend for the AI Wardrobe Assistant. It provides a beautiful, responsive, and dynamic UI for managing your digital wardrobe and getting AI-powered outfit recommendations.

## Tech Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion (for animations)
- **Icons:** Lucide React

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory (where `package.json` is) and configure your backend API URL if it's different from the default:
   ```env
   VITE_API_URL=http://127.0.0.1:8000
   ```
   *(If you don't create this file, the app will automatically default to `http://localhost:8000`)*

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Features
- **Wardrobe Management:** Upload and manage your clothes.
- **AI Tagging:** Clothes are automatically tagged with style, color, and category upon upload (requires backend).
- **Outfit Suggestions:** Ask the AI (e.g., "I'm going to a wedding") and get dynamically generated outfits matching your wardrobe.
