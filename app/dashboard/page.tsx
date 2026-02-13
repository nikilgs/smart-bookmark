'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

type Bookmark = {
  id: string
  title: string
  url: string
  user_id: string
  created_at?: string | null
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  // ✅ Proper auth check (production-safe)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
      } else {
        router.push('/')
      }

      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          router.push('/')
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from<'bookmarks', Bookmark>('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
  }

  // Realtime + fetch
  useEffect(() => {
    if (!user) return

    ;(async () => {
      await fetchBookmarks()
    })()

    const channel = supabase
      .channel(`bookmarks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url || !user) return

    const { error } = await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    if (!error) {
      setTitle('')
      setUrl('')
      fetchBookmarks()
    }
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  // Start editing
  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setTitle(bookmark.title)
    setUrl(bookmark.url)
  }

  // Update bookmark
  const updateBookmark = async () => {
    if (!editingId) return

    await supabase
      .from('bookmarks')
      .update({ title, url })
      .eq('id', editingId)

    setEditingId(null)
    setTitle('')
    setUrl('')
    fetchBookmarks()
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 mb-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL"
            className="w-full border p-2 mb-3 rounded"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {editingId ? (
            <div className="flex gap-2">
              <button
                onClick={updateBookmark}
                className="bg-yellow-600 text-white px-4 py-2 rounded w-full"
              >
                Update
              </button>

              <button
                onClick={() => {
                  setEditingId(null)
                  setTitle('')
                  setUrl('')
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addBookmark}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Add Bookmark
            </button>
          )}
        </div>

        {/* Bookmark List */}
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white p-4 rounded shadow flex justify-between">

              <div>
                <p className="font-semibold">{bookmark.title}</p>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm"
                >
                  {bookmark.url}
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(bookmark)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
