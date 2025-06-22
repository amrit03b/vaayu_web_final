"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserButton } from "@civic/auth-web3/react"
import { Leaf, Shield, Wallet, Heart } from "lucide-react"
import Link from "next/link"
import ContinueToDashboardButton from "./ContinueToDashboardButton"

export default function LoginPage() {
  const [error, setError] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLoginSuccess = () => {
    // This will be handled by the ContinueToDashboardButton component
  }

  const handleLoginError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/login_background.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* App Header */}
        <div 
          className={`text-center space-y-2 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-white rounded-full shadow-lg">
              <Leaf className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Vaayu</h1>
          </div>
          <p className="text-white/90 drop-shadow-md">Your personalized environmental health companion</p>
        </div>

        {/* Login Card */}
        <Card 
          className={`bg-black/95 backdrop-blur-sm border-0 shadow-2xl transition-all duration-1000 ease-out delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-white">Welcome to Vaayu</CardTitle>
            <CardDescription className="text-gray-300">
              Secure login with Civic to access your personalized health dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Preview */}
            <div 
              className={`space-y-3 transition-all duration-1000 ease-out delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <Shield className="w-4 h-4 text-white" />
                <span>Secure identity verification with Civic</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <Wallet className="w-4 h-4 text-white" />
                <span>Personal Aptos wallet for data privacy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <Heart className="w-4 h-4 text-white" />
                <span>Personalized health recommendations</span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert 
                variant="destructive"
                className={`transition-all duration-500 ease-out ${
                  error ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <div 
              className={`transition-all duration-1000 ease-out delay-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <UserButton className="w-full" />
            </div>

            {/* Continue to Dashboard Link (client component) */}
            <div 
              className={`transition-all duration-1000 ease-out delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <ContinueToDashboardButton />
            </div>

            <div 
              className={`text-xs text-center text-gray-400 transition-all duration-1000 ease-out delay-800 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              By logging in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div 
          className={`text-center text-xs text-white/80 drop-shadow-md transition-all duration-1000 ease-out delay-900 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Powered by Civic Identity & Aptos Blockchain
        </div>
      </div>
    </div>
  )
}
