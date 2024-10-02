'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <nav className="p-4 shadow-lg" style={{ backgroundColor: 'hsl(0 0% 98%)' }}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: Logo and Search */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="btn btn-ghost text-xl font-bold">Recipe Weekly Plan</Link>
          <div className="form-control">
            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          </div>
        </div>

        {/* Right side: User Info and Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.email}</span>

              <Button onClick={handleLogout} variant="secondary">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
