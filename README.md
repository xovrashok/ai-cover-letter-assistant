# ⚡ AI Cover Letter Assistant

A lightweight, high-performance Chrome Extension (Manifest V3) built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. The extension automates tailored cover letter generation for **Djinni** and **Work.ua** job listings using the **Google Gemini API**.

![](https://img.shields.io/badge/REACT-18-10b981?style=for-the-badge&logo=react&logoColor=white) ![](https://img.shields.io/badge/TYPESCRIPT-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white) ![](https://img.shields.io/badge/TAILWIND_CSS-3.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white) ![](https://img.shields.io/badge/VITE-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white) ![](https://img.shields.io/badge/GEMINI_API-SDK-8e44ad?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Features

- **DOM Job Data Extraction:** Automatically parses `Job Title`, `Company Name`, and `Job Description` directly from active job post pages on Djinni and Work.ua via custom content scripts.
- **Smart Cover Letter Generation:** Integrates the official `@google/genai` SDK (`gemini-2.5-flash`) to generate concise, highly customized application responses in Ukrainian.
- **Tone Switching & Customization:** Features real-time prompt adjustment allowing users to toggle between **Short** and **Professional** communication tones.
- **Persistent Secure Storage:** Uses `chrome.storage.local` to securely persist the user's Gemini API key and background resume details across browser sessions.
- **One-Click Clipboard Action:** Includes built-in stateful copy functionality with instant user feedback for fast application submission.
- **Modular Architecture:** Built with clean separation of concerns across storage services, Gemini API handlers, content scripts, and tab message passers.

---

## 🛠 Tech Stack & Libraries

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite with `@crxjs/vite-plugin` (or static bundle output)
- **Styling:** Tailwind CSS for compact Popup UI components
- **Extension Platform:** Chrome Extension Manifest V3 (`chrome.storage`, `chrome.tabs`, `content_scripts`)
- **AI Provider:** Google Gemini API (`@google/genai`)
