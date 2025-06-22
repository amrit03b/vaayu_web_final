"use client"

import { useEffect, useState } from "react"
import { getUser } from "@civic/auth/nextjs";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import Link from "next/link";
import ContinueToDashboardButton from "./ContinueToDashboardButton";

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user information
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        if (!userData) {
          redirect("/");
        }
        setUser(userData);
      } catch (error) {
        redirect("/");
      }
    };

    fetchUser();

    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-white animate-gradient-xy"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div 
            className={`border border-gray-300 rounded-lg p-6 bg-white/10 backdrop-blur-md transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 
                className={`text-3xl font-bold text-white transition-all duration-1000 ease-out delay-200 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Dashboard
              </h1>
              <div 
                className={`transition-all duration-1000 ease-out delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <DashboardClient user={user} />
              </div>
            </div>

            {/* Welcome Section */}
            <div 
              className={`bg-black/20 border border-gray-300 rounded-lg p-6 mb-6 transition-all duration-1000 ease-out delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h2 
                className={`text-xl font-semibold text-white mb-2 transition-all duration-1000 ease-out delay-500 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Welcome back, {user.name || user.email}!
              </h2>
              <p 
                className={`text-gray-200 transition-all duration-1000 ease-out delay-600 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                You have successfully logged in to your dashboard.
              </p>
            </div>

            {/* User Information Card */}
            <div 
              className={`bg-black/20 border border-gray-300 rounded-lg p-6 mb-6 transition-all duration-1000 ease-out delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 
                className={`text-lg font-medium text-white mb-4 transition-all duration-1000 ease-out delay-800 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                User Information
              </h3>
              <div 
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-1000 ease-out delay-900 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    User ID
                  </label>
                  <p className="mt-1 text-sm text-white">{user.id}</p>
                </div>
                {user.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-white">{user.email}</p>
                  </div>
                )}
                {user.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-white">{user.name}</p>
                  </div>
                )}
                {user.given_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Given Name
                    </label>
                    <p className="mt-1 text-sm text-white">{user.given_name}</p>
                  </div>
                )}
                {user.family_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Family Name
                    </label>
                    <p className="mt-1 text-sm text-white">{user.family_name}</p>
                  </div>
                )}
                {user.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Last Updated
                    </label>
                    <p className="mt-1 text-sm text-white">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className={`bg-black/20 border border-gray-300 rounded-lg p-6 transition-all duration-1000 ease-out delay-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 
                className={`text-lg font-medium text-white mb-4 transition-all duration-1000 ease-out delay-1100 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                Quick Actions
              </h3>
              <div 
                className={`grid grid-cols-1 gap-4 transition-all duration-1000 ease-out delay-1200 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <ContinueToDashboardButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animated gradient */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
}