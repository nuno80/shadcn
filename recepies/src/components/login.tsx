'use client'

import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, AuthError } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isResetPassword, setIsResetPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/recipes')
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Il reindirizzamento sarà gestito dall'effect hook
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message || 'Failed to log in')
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccessMessage('Password reset email sent. Check your inbox.')
      setError('')
      setIsResetPassword(true)
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message || 'Failed to send password reset email')
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      // Il reindirizzamento sarà gestito dall'effect hook
    } catch (error) {
      const authError = error as AuthError
      setError(authError.message || 'Failed to sign in with Google')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>{isResetPassword ? 'Reset Password' : 'Login'}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isResetPassword ? (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Login</Button>
            </form>
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 bg-white">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
              Sign in with Google
            </Button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            <Button
              type="button"
              variant="link"
              className="mt-2 p-0"
              onClick={handlePasswordReset}
            >
              Password dimenticata?
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-green-500 text-sm">{successMessage}</p>
            <Button
              onClick={() => setIsResetPassword(false)}
              className="w-full"
            >
              Torna al login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}