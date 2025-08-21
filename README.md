# SEO Boost 🚀

A simple SEO Analyzer web app built with **React + Node.js**.  
Users can paste HTML code or enter a website URL to get an **SEO score out of 100** along with improvement suggestions.

## Features
- Paste raw HTML → get SEO score
- Enter a website URL → fetch & analyze SEO
- Suggestions to improve tags, metadata, accessibility
- Scoring system (title, meta description, alt tags, H1, keywords, mobile viewport)
- Built with React + Express

## Tech Stack
- Frontend: React, TailwindCSS
- Backend: Node.js, Express, Cheerio

## Installation
```bash
git clone https://github.com/Charaf-Eddine-Abad/SeoBoost.git
cd SeoBoost
# Install dependencies
cd server && npm install
cd ../client && npm install

# Run locally
npm run dev
