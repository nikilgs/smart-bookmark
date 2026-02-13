'use client'

import { supabase } from '../lib/supabase'

export default function Landing() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/dashboard',
      },
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-zoom"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
          Smart Bookmark Manager
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-8 drop-shadow-md">
          Save, organize, and manage your favorite links securely.
          Realtime updates. Private access. Simple and powerful.
        </p>

        <button
          onClick={handleLogin}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition duration-300 shadow-lg"
        >
          Get Started with Google
        </button>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        .animate-zoom {
          animation: zoomEffect 10s ease-in-out infinite alternate;
        }

        @keyframes zoomEffect {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
