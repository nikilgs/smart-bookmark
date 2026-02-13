# Smart Bookmark Manager

A fullstack bookmark manager built using Next.js, Supabase, and Tailwind CSS.  
Users can securely save, edit, and manage bookmarks with Google authentication and realtime updates.

---

## 🚀 Live Demo

Vercel URL: https://smart-bookmark-neon-delta.vercel.app

GitHub Repo: https://github.com/nikilgs/smart-bookmark

---

## ✨ Features

- Google OAuth authentication (Supabase Auth)
- Add bookmarks (title + URL)
- Edit bookmarks
- Delete bookmarks
- Bookmarks are private per user (Row Level Security)
- Realtime updates across multiple tabs
- Protected dashboard route
- Modern landing page with animated background
- Fully deployed on Vercel

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase
  - Authentication
  - PostgreSQL Database
  - Realtime subscriptions
- Tailwind CSS
- Vercel (Deployment)
- TypeScript

---

## 🔐 Security

Row Level Security (RLS) is enabled on the bookmarks table.

Policies implemented:

- SELECT → Users can view only their bookmarks
- INSERT → Users can insert only their bookmarks
- UPDATE → Users can update only their bookmarks
- DELETE → Users can delete only their bookmarks

---

## ⚡ Realtime Functionality

Supabase realtime subscriptions are used to automatically sync bookmark changes across multiple browser tabs without refreshing.

---

## 👤 Author

Nikil G S  
GitHub: https://github.com/nikilgs
