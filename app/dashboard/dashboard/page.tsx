"use client"

import { useState, useEffect, useMemo } from "react"
import { Gift, User as UserIcon, Wallet, FileText, Copy, CheckCircle, ArrowRight, Settings, Heart, MapPin, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AQIAlertCard } from "@/components/AQIAlertCard"
import { getStoredWallet, getUserProfile, hasUserProfile, type HealthProfile, clearCorruptedWallet } from "@/lib/aptos"
import { useUser } from "@civic/auth/react"

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { user, isLoading } = useUser()

  // Use a more stable identifier - prefer email if available, fallback to ID
  const stableUserId = user?.email || user?.id;
  
  // Check for corrupted wallet data and clear it if found
  useEffect(() => {
    if (stableUserId) {
      const wasCorrupted = clearCorruptedWallet(stableUserId)
      if (wasCorrupted) {
        setWalletError("Wallet data was corrupted and has been cleared. Please log in again to create a new wallet.")
      }
    }
  }, [stableUserId])

  // Trigger fade-in animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  const wallet = useMemo(
    () => (stableUserId ? getStoredWallet(stableUserId) : null),
    [stableUserId]
  )

  // Fetch health profile from blockchain
  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!wallet || !stableUserId) {
        setProfileLoading(false)
        return
      }

      setProfileLoading(true)
      setProfileError(null)
      try {
        console.log("Fetching health profile for wallet:", wallet.address)
        const profileResult = await getUserProfile(wallet)
        console.log("Profile result:", profileResult)

        if (profileResult.success && profileResult.profile) {
          setHealthProfile(profileResult.profile)
        } else {
          // This is not an error, it just means no profile exists.
          if (
            profileResult.error?.includes("Profile not found") ||
            profileResult.error?.includes("access denied")
          ) {
            setHealthProfile(null)
            console.log("No profile found for user.")
          } else {
            // This is a real error.
            setProfileError(profileResult.error || "Failed to load profile data")
          }
        }
      } catch (error) {
        console.error("Error fetching health profile:", error)
        setProfileError(
          "An unexpected error occurred while loading your profile"
        )
      } finally {
        setProfileLoading(false)
      }
    }

    fetchHealthProfile()
  }, [wallet, stableUserId])

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/dashboard.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Header */}
        <header 
          className={`bg-black/20 backdrop-blur-md border-b border-white/20 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-full shadow-lg">
                  <div className="w-4 h-4 text-black">🍃</div>
                </div>
                <h1 className="text-xl font-bold text-white">Vaayu Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://vaayu-voucher-hub.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Gift className="w-4 h-4" />
                    Rewards
                  </Button>
                </a>
                <Badge variant="secondary" className="flex items-center gap-1 bg-white/20 text-white border-white/20">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div 
              className={`transition-all duration-1000 ease-out delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome back{healthProfile ? `, ${healthProfile.name}` : ""}!
              </h2>
              <p className="text-white/90 drop-shadow-md">
                {healthProfile 
                  ? "Monitor your environmental health and manage your wellness profile."
                  : "Complete your health profile to get personalized environmental health recommendations."
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Wallet Info Card */}
                <Card 
                  className={`bg-black/20 backdrop-blur-md border-white/20 transition-all duration-1000 ease-out delay-300 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Wallet className="w-5 h-5" />
                      Your Aptos Wallet
                    </CardTitle>
                    <CardDescription className="text-white/80">Your secure blockchain wallet for health data storage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {walletError ? (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <p className="text-sm text-red-300 mb-3">{walletError}</p>
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Reload Page
                        </Button>
                      </div>
                    ) : wallet ? (
                      <>
                        <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20">
                          <code className="flex-1 text-sm font-mono break-all text-white">{wallet.address}</code>
                          <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="shrink-0 text-white hover:bg-white/20">
                            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="text-xs text-white/70">
                          This wallet is automatically generated and secured with your Civic identity
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Wallet className="w-6 h-6 text-white/60" />
                        </div>
                        <p className="text-sm text-white/80 mb-3">No wallet found</p>
                        <Button 
                          onClick={() => window.location.reload()} 
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          Reload Page
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Health Profile Card */}
                <Card 
                  className={`bg-black/20 backdrop-blur-md border-white/20 transition-all duration-1000 ease-out delay-400 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <UserIcon className="w-5 h-5" />
                      Health Profile
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Your personalized health information stored securely on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profileLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    ) : profileError ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Error Loading Profile</h3>
                        <p className="text-white/80 mb-4">{profileError}</p>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => window.location.reload()} 
                            variant="outline"
                            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            Retry
                          </Button>
                          <Link href="/onboarding">
                            <Button className="w-full bg-white text-black hover:bg-white/90">
                              Create New Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : healthProfile ? (
                      <div className="space-y-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-white/60" />
                              <span className="text-sm font-medium text-white/80">Name</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{healthProfile.name}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-white/60" />
                              <span className="text-sm font-medium text-white/80">Age & Gender</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{healthProfile.age} years old, {healthProfile.gender}</p>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white/60" />
                            <span className="text-sm font-medium text-white/80">Location</span>
                          </div>
                          <p className="text-lg font-semibold text-white">{healthProfile.location}</p>
                        </div>

                        {/* Chronic Conditions */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-white/60" />
                            <span className="text-sm font-medium text-white/80">Chronic Conditions</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {healthProfile.chronicCondition.map((condition, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-white/60" />
                              <span className="text-sm font-medium text-white/80">Preferred Walk Time</span>
                            </div>
                            <p className="text-sm text-white/90">{healthProfile.preferredWalkTime || "Not specified"}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-white/60" />
                              <span className="text-sm font-medium text-white/80">Pollution Sensitivity</span>
                            </div>
                            <p className="text-sm text-white/90">{healthProfile.pollutionSensitivity || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/20">
                          <Link href="/onboarding">
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                              <FileText className="w-4 h-4 mr-2" />
                              Update Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <UserIcon className="w-8 h-8 text-white/60" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No Health Profile Found</h3>
                        <p className="text-white/80 mb-4">Create your health profile to receive personalized recommendations</p>
                        <Link href="/onboarding">
                          <Button className="bg-white text-black hover:bg-white/90">
                            Create Profile
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card 
                  className={`bg-black/20 backdrop-blur-md border-white/20 transition-all duration-1000 ease-out delay-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Settings className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link href="/onboarding">
                        <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <FileText className="w-4 h-4 mr-2" />
                          {healthProfile ? "Update Health Profile" : "Create Health Profile"}
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" disabled>
                        <UserIcon className="w-4 h-4 mr-2" />
                        View Health History
                        <Badge variant="secondary" className="ml-auto text-xs bg-white/20 text-white border-white/20">
                          Soon
                        </Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - AQI and Alerts */}
              <div className="space-y-6">
                <div 
                  className={`transition-all duration-1000 ease-out delay-600 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <AQIAlertCard />
                </div>

                {/* Account Info */}
                <Card 
                  className={`bg-black/20 backdrop-blur-md border-white/20 transition-all duration-1000 ease-out delay-700 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-sm text-white">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Civic ID:</span>
                      <span className="font-mono text-xs text-white">
                        {isLoading ? "Loading..." : user?.id}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Status:</span>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
                        Verified
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Joined:</span>
                      <span className="text-xs text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
