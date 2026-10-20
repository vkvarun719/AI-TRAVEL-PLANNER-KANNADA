import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const LOCAL_USER_KEY = 'yatra_logged_in_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
        }
        setLoading(false)
      })

      // 2. Listen to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      // Check local storage for persistent guest/demo user
      try {
        const saved = localStorage.getItem(LOCAL_USER_KEY)
        if (saved) {
          setUser(JSON.parse(saved))
        }
      } catch {
        // ignore
      }
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        })
        if (error) throw error
      } catch (err) {
        console.error('Google Sign-In Error:', err.message)
        toast.error(`Sign in error: ${err.message}`)
      }
    } else {
      // Demo / Local Google Sign-In when Supabase keys are pending
      const demoGoogleUser = {
        id: 'usr_google_karnataka_traveler',
        email: 'traveler@karnataka.ai',
        user_metadata: {
          full_name: 'Karnataka Explorer',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
      }
      setUser(demoGoogleUser)
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoGoogleUser))
      toast.success('Signed in with Google! 🎉')
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem(LOCAL_USER_KEY)
    }
    setUser(null)
    toast.success('Signed out successfully.')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
