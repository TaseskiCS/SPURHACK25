"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clover, Layout, LogOut, Map, Plus, User, MessageCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/ui/chat";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        // Fetch unread message count from API
        fetchUnreadCount(token);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const fetchUnreadCount = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const totalUnread = data.conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    setUser(null);
    setIsChatOpen(false);
    setIsMobileMenuOpen(false);
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={closeMobileMenu}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Clover className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-emerald-800">LuckyLease</h1>
                <p className="text-xs text-emerald-600">
                  Find your lucky sublease
                </p>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/listings/browse"
                className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center"
              >
                <Layout className="h-4 w-4 mr-2" />
                Browse
              </Link>

              <Link
                href="/map"
                className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center"
              >
                <Map className="h-4 w-4 mr-2" />
                Map
              </Link>
              {user && (
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/listings/create" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Space
                  </Link>
                </Button>
              )}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  {/* Instagram-style Message Button */}
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="relative p-3 hover:bg-gray-100 rounded-full transition-all duration-200 group active:scale-95"
                    title="Messages"
                  >
                    <MessageCircle className="w-6 h-6 text-gray-800 group-hover:text-emerald-600 transition-colors stroke-[1.5]" />
                    {/* Notification badge for unread messages */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1 shadow-sm">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {user.name}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" className="text-emerald-600">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/listings/browse"
                  className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center px-2 py-2 rounded-lg hover:bg-emerald-50"
                  onClick={closeMobileMenu}
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Browse Listings
                </Link>

                <Link
                  href="/map"
                  className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center px-2 py-2 rounded-lg hover:bg-emerald-50"
                  onClick={closeMobileMenu}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map View
                </Link>

                {user && (
                  <>
                    <Link
                      href="/listings/create"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center px-2 py-2 rounded-lg hover:bg-emerald-50"
                      onClick={closeMobileMenu}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      List Your Space
                    </Link>

                    <button
                      onClick={() => {
                        setIsChatOpen(true);
                        closeMobileMenu();
                      }}
                      className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center px-2 py-2 rounded-lg hover:bg-emerald-50 relative"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messages
                      {unreadCount > 0 && (
                        <span className="ml-auto min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center px-2 py-2 rounded-lg hover:bg-emerald-50"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard ({user.name})
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  {!user ? (
                    <>
                      <Link
                        href="/auth/login"
                        className="block w-full text-center px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block w-full text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Chat Interface controlled from header */}
      {user && (
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUserId={user.id}
          token={localStorage.getItem("token") || ""}
        />
      )}
    </>
  );
}
