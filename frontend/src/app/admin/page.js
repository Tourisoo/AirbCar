'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to admin sign-in
        router.push('/admin/signin')
      } else {
        // Logged in, check if admin and redirect accordingly
        checkAdminAndRedirect()
      }
    }
  }, [user, loading, router])

  const checkAdminAndRedirect = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        router.push('/admin/signin')
        return
      }

      const response = await fetch(`${apiUrl}/api/verify-token/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.is_staff === true || userData.is_superuser === true) {
          // User is admin, redirect to dashboard
          router.push('/admin/dashboard')
        } else {
          // User is not admin, redirect to admin sign-in
          router.push('/admin/signin')
        }
      } else {
        router.push('/admin/signin')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/admin/signin')
    }
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
    </div>
  )
}