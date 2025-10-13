"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bar, BarChart, AreaChart, Area } from "recharts"
import { UserRound, Handshake, CarFront, Album, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';


import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#2563eb",
  },
  users: {
    label: "Users",
    color: "#10b981",
  },
  earnings: {
    label: "Earnings ($)",
    color: "#f59e0b",
  },
}

const chartData = [
  { month: "January", active: 186, inActive: 80 },
  { month: "February", active: 305, inActive: 200 },
  { month: "March", active: 237, inActive: 120 },
  { month: "April", active: 73, inActive: 190 },
  { month: "May", active: 209, inActive: 130 },
  { month: "June", active: 214, inActive: 140 },
]

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalPartners: 0,
    totalListings: 0,
    totalEarnings: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [partnerSearchTerm, setPartnerSearchTerm] = useState("");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState("all");
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const [carStatusFilter, setCarStatusFilter] = useState("all");
  const [bookingSearchTerm, setBookingSearchTerm] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [listings, setListings] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard"); // dashboard, users, partners, cars, bookings, earnings
  const router = useRouter();

  // Check admin status and redirect if not admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  const checkAdminStatus = async () => {
    try {
      console.log("Checking admin status...");
      const apiUrl =
        process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      console.log("API URL:", apiUrl);
      console.log("Token exists:", !!token);

      if (!token) {
        console.log("No token found, redirecting to signin");
        router.push("/auth/signin");
        return;
      }

      const response = await fetch(`${apiUrl}/api/verify-token/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const userData = await response.json();
        console.log("User data:", userData);
        if (userData.is_staff === true || userData.is_superuser === true) {
          console.log("User is admin, loading dashboard");
          setIsAdmin(true);
          loadDashboardData();
          router.push("/admin/dashboard/");
        } else {
          console.log("User is not admin, redirecting");
          alert("Access denied: You don't have admin privileges");
          router.push("/auth/signin");
        }
      } else {
        const errorText = await response.text();
        console.log("Response error:", errorText);
        console.log("Response not ok, redirecting");
        alert(`Authentication failed: ${response.status} - ${errorText}`);
        localStorage.removeItem("access_token"); // Clear invalid token
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert("Cannot connect to server. Please check if the backend is running on http://localhost:8000");
      } else {
        alert(`Connection error: ${error.message}`);
      }
      router.push("/auth/signin");
    }
  };

  // Navigation handler
  const handleNavigation = (view) => {
    setCurrentView(view);
    // Update URL without page reload
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('view', view);
    window.history.pushState({}, '', currentUrl);
  };

  // Check URL params on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view) {
      setCurrentView(view);
    }
  }, []);

  const generateChartData = (usersCount, partnersCount, bookingsCount, totalEarnings) => {
    // Generate chart data based on real backend data
    const chartData = [
      { 
        month: "Current Stats", 
        bookings: bookingsCount,
        users: usersCount,
        earnings: Math.round(totalEarnings / 100) // Scale down earnings for better visualization
      }
    ];
    setChartData(chartData);
  };

  const loadDashboardData = async () => {
    try {
      console.log("Loading dashboard data...");
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("No token found when loading dashboard data");
        router.push("/auth/signin");
        return;
      }

      // Initialize variables to track data
      let usersList = [];
      let partnersList = [];
      let listingsList = [];
      let bookingsList = [];
      let totalEarnings = 0;

      // Load users with error handling
      try {
        console.log("Fetching users from:", `${apiUrl}/users/`);
        const usersResponse = await fetch(`${apiUrl}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log("Users data:", usersData);
          usersList = usersData.results || usersData || [];
          setUsers(usersList);
          setStats((prev) => ({ ...prev, totalUsers: usersList.length }));
        } else {
          console.error("Users response error:", usersResponse.status, await usersResponse.text());
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }

      // Load partners with error handling
      try {
        console.log("Fetching partners from:", `${apiUrl}/partners/`);
        const partnersResponse = await fetch(`${apiUrl}/partners/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (partnersResponse.ok) {
          const partnersData = await partnersResponse.json();
          console.log("Partners data:", partnersData);
          partnersList = partnersData.results || partnersData || [];
          setPartners(partnersList);
          setStats((prev) => ({ ...prev, totalPartners: partnersList.length }));
        } else {
          console.error("Partners response error:", partnersResponse.status, await partnersResponse.text());
        }
      } catch (error) {
        console.error("Error loading partners:", error);
      }

      // Load listings with error handling
      try {
        console.log("Fetching listings from:", `${apiUrl}/listings/`);
        const listingsResponse = await fetch(`${apiUrl}/listings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          console.log("Listings data:", listingsData);
          listingsList = listingsData.results || listingsData || [];
          setListings(listingsList);
          setStats((prev) => ({ ...prev, totalListings: listingsList.length }));
        } else {
          console.error("Listings response error:", listingsResponse.status, await listingsResponse.text());
        }
      } catch (error) {
        console.error("Error loading listings:", error);
      }

      // Load bookings with error handling
      try {
        console.log("Fetching bookings from:", `${apiUrl}/bookings/`);
        const bookingsResponse = await fetch(`${apiUrl}/bookings/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          console.log("Bookings data:", bookingsData);
          bookingsList = bookingsData.results || bookingsData || [];
          setBookings(bookingsList);
          
          // Calculate total earnings
          totalEarnings = bookingsList.reduce((sum, booking) => {
            return sum + (parseFloat(booking.price) || parseFloat(booking.total_price) || 0);
          }, 0);
          
          setStats((prev) => ({
            ...prev,
            totalBookings: bookingsList.length,
            totalEarnings: totalEarnings,
          }));
        } else {
          console.error("Bookings response error:", bookingsResponse.status, await bookingsResponse.text());
        }
      } catch (error) {
        console.error("Error loading bookings:", error);
      }

      // Generate chart data with all processed data
      generateChartData(usersList.length, partnersList.length, bookingsList.length, totalEarnings);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      alert(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/auth/signin");
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="flex gap-10">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <div className="p-4">
            <h2 className="text-white text-lg font-semibold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'dashboard' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => handleNavigation('analytics')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'analytics' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                <span>Analytics</span>
              </button>
              
              <button
                onClick={() => handleNavigation('users')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'users' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <UserRound className="w-5 h-5" />
                <span>Users</span>
              </button>
              
              <button
                onClick={() => handleNavigation('partners')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'partners' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Handshake className="w-5 h-5" />
                <span>Partners</span>
              </button>
              
              <button
                onClick={() => handleNavigation('cars')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'cars' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <CarFront className="w-5 h-5" />
                <span>Cars</span>
              </button>
              
              <button
                onClick={() => handleNavigation('bookings')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'bookings' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Album className="w-5 h-5" />
                <span>Bookings</span>
              </button>
              
              <button
                onClick={() => handleNavigation('earnings')}
                className={`flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md ${
                  currentView === 'earnings' 
                    ? 'text-white bg-gray-700' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                  <path d="M6 8a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm4 5a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Earnings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Admin
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-8xl mx-auto">
            
            {/* Render different views based on currentView */}
            {currentView === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <UserRound className="text-blue-500"/>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.totalUsers}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Handshake className="text-blue-500"/>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Partners
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.totalPartners}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CarFront className="text-blue-500"/> 
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Cars
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.totalListings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Album className="text-blue-500"/>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.totalBookings}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="flex gap-8">
                  {/* Users Table */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="px-6 py-5">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Users
                        </h3>
                        <div className="space-y-1">
                          {/* Table Header */}
                          <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-100">
                            <div className="text-sm font-medium text-gray-600">
                              Name
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                              Email
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                              Status
                            </div>
                          </div>

                          {/* Table Body */}
                          <div className="space-y-4 pt-4">
                            {loadingData ? (
                              <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                              </div>
                            ) : users.length > 0 ? (
                              users.slice(0, 6).map((user, index) => (
                                <div
                                  key={user.id || index}
                                  className="grid grid-cols-3 gap-4 py-3 hover:bg-gray-50 rounded-md px-2 -mx-2"
                                >
                                  <div className="text-sm font-medium text-gray-900">
                                    {user?.first_name && user?.last_name
                                      ? `${user?.first_name} ${user?.last_name}`
                                      : user?.username || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {user?.email}
                                  </div>
                                  <div className="text-sm font-medium">
                                    <span
                                      className={
                                        user?.is_active
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {user?.is_active ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                No users found
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Earnings Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Total Earnings
                      </h3>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${stats.totalEarnings.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">From All Bookings</p>
                    </div>

                    {/* Partner Activity */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Partner Activity
                      </h3>
                      <div className="space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-600">
                            Company Name
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            Tax ID
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            Created At
                          </div>
                        </div>

                        {/* Table Body */}
                        <div className="space-y-4 pt-4">
                          {loadingData ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                          ) : partners.length > 0 ? (
                            partners.slice(0, 6).map((partner, index) => (
                              <div
                                key={partner.id || index}
                                className="grid grid-cols-3 gap-4 py-3 hover:bg-gray-50 rounded-md px-2 -mx-2"
                              >
                                <p className="text-sm font-medium text-gray-900">
                                  {partner?.company_name || "N/A"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {partner?.tax_id || "N/A"}
                                </p>
                                <p className="text-sm font-medium text-gray-600">
                                  {partner?.created_at 
                                    ? new Date(partner?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : "N/A"}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No partners found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Real-time Statistics
                      </h3>
                      <ChartContainer
                        config={chartConfig}
                        className="min-h-[200px] w-full"
                      >
                        <AreaChart accessibilityLayer data={chartData}>
                          <Area
                            type="monotone"
                            dataKey="bookings"
                            stackId="1"
                            stroke="#2563eb"
                            fill="#2563eb"
                          />
                          <Area
                            type="monotone"
                            dataKey="users"
                            stackId="1"
                            stroke="#10b981"
                            fill="#10b981"
                          />
                          <Area
                            type="monotone"
                            dataKey="earnings"
                            stackId="1"
                            stroke="#f59e0b"
                            fill="#f59e0b"
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                      </ChartContainer>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Recent Bookings
                      </h3>
                      <div className="space-y-4">
                        {loadingData ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          </div>
                        ) : bookings.length > 0 ? (
                          bookings.slice(0, 4).map((booking, index) => (
                            <div key={booking.id || index} className="border-b border-gray-100 pb-3 last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-900">
                                  Booking #{booking.id || index + 1}
                                </p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status || "N/A"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                <div>
                                  <span className="font-medium">Start:</span> {booking.start_time 
                                    ? new Date(booking.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : "N/A"}
                                </div>
                                <div>
                                  <span className="font-medium">End:</span> {booking.end_time 
                                    ? new Date(booking.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : "N/A"}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-900">
                                  ${booking.price || booking.total_price || 0}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No bookings found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Users Management View */}
            {currentView === 'users' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600">Manage all registered users</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {users.filter(user => {
                      const matchesSearch = !searchTerm || 
                        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
                      
                      const matchesStatus = statusFilter === "all" ||
                        (statusFilter === "active" && user.is_active) ||
                        (statusFilter === "inactive" && !user.is_active);
                      
                      return matchesSearch && matchesStatus;
                    }).length} users found
                  </span>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search users by name, username, or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingData ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          </td>
                        </tr>
                      ) : users.filter(user => {
                        const matchesSearch = !searchTerm || 
                          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        const matchesStatus = statusFilter === "all" ||
                          (statusFilter === "active" && user.is_active) ||
                          (statusFilter === "inactive" && !user.is_active);
                        
                        return matchesSearch && matchesStatus;
                      }).map((user, index) => (
                        <tr key={user.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <UserRound className="h-6 w-6 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user?.first_name && user?.last_name
                                    ? `${user?.first_name} ${user?.last_name}`
                                    : user?.username || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user?.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user?.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user?.is_superuser ? 'Super Admin' : 
                               user?.is_staff ? 'Staff' : 
                               user?.is_partner ? 'Partner' : 'User'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user?.date_joined 
                                ? new Date(user?.date_joined).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other Views Placeholder */}
            {currentView === 'analytics' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                    <p className="text-gray-600">Comprehensive insights and performance metrics</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                      <option value="365">Last year</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      Export Report
                    </button>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-sm font-medium text-green-600">+12.5%</span>
                          <span className="text-sm text-gray-500 ml-1">vs last period</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {users.length > 0 ? ((bookings.length / users.length) * 100).toFixed(1) : 0}%
                        </p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-sm font-medium text-green-600">+8.2%</span>
                          <span className="text-sm text-gray-500 ml-1">vs last period</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ${bookings.length > 0 ? Math.round(stats.totalEarnings / bookings.length) : 0}
                        </p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-sm font-medium text-green-600">+15.3%</span>
                          <span className="text-sm text-gray-500 ml-1">vs last period</span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Album className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Car Utilization</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {listings.length > 0 ? ((listings.filter(car => car.is_available).length / listings.length) * 100).toFixed(1) : 0}%
                        </p>
                        <div className="flex items-center mt-2">
                          <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                          <span className="text-sm font-medium text-red-600">-2.1%</span>
                          <span className="text-sm text-gray-500 ml-1">vs last period</span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <CarFront className="w-8 h-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Trend Chart */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">Revenue</button>
                        <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md">Bookings</button>
                      </div>
                    </div>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                      <AreaChart accessibilityLayer data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stackId="1"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.6}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </div>

                  {/* User Activity Chart */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md">Active</button>
                        <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md">New</button>
                      </div>
                    </div>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                      <AreaChart accessibilityLayer data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="users"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>

                {/* Performance Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Performing Categories */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Car Categories</h3>
                    <div className="space-y-4">
                      {[...new Set(listings.map(car => car.category || 'Uncategorized'))]
                        .map(category => ({
                          category,
                          count: listings.filter(car => (car.category || 'Uncategorized') === category).length,
                          revenue: listings
                            .filter(car => (car.category || 'Uncategorized') === category)
                            .reduce((sum, car) => sum + ((car.bookings_count || 0) * (car.price_per_day || car.daily_rate || 0)), 0)
                        }))
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map((item, index) => (
                        <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-yellow-500' :
                              index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 capitalize">{item.category}</p>
                              <p className="text-xs text-gray-500">{item.count} cars</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Status Distribution */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                    <div className="space-y-4">
                      {['confirmed', 'pending', 'active', 'completed', 'cancelled'].map((status, index) => {
                        const count = bookings.filter(booking => booking.status?.toLowerCase() === status).length;
                        const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                status === 'confirmed' ? 'bg-green-500' :
                                status === 'pending' ? 'bg-yellow-500' :
                                status === 'active' ? 'bg-blue-500' :
                                status === 'completed' ? 'bg-gray-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{count}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    status === 'confirmed' ? 'bg-green-500' :
                                    status === 'pending' ? 'bg-yellow-500' :
                                    status === 'active' ? 'bg-blue-500' :
                                    status === 'completed' ? 'bg-gray-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Geographic Distribution */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">System Status</p>
                            <p className="text-xs text-gray-500">All systems operational</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">99.9%</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserRound className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Active Users</p>
                            <p className="text-xs text-gray-500">Last 24 hours</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">{users.filter(u => u.is_active).length}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <CarFront className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Available Cars</p>
                            <p className="text-xs text-gray-500">Ready for booking</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-purple-600">{listings.filter(car => car.is_available).length}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Handshake className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Active Partners</p>
                            <p className="text-xs text-gray-500">Contributing revenue</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">{partners.filter(p => p.is_active).length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800">View All Metrics</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monthly Revenue</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Math.round(stats.totalEarnings / 12).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Math.round(stats.totalEarnings / 15).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+25.0%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Math.round(stats.totalEarnings / 10).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              On Track
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User Acquisition</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(users.length / 30)} /day</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(users.length / 35)} /day</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+16.7%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(users.length / 25)} /day</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Exceeding
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Car Utilization Rate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {listings.length > 0 ? ((listings.filter(car => car.is_available).length / listings.length) * 100).toFixed(1) : 0}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">87.5%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-red-600 font-medium">-2.1%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">90.0%</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Below Target
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Partner Growth</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{partners.length}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(partners.length * 0.9)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+11.1%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(partners.length * 1.2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              On Track
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">Generate Report</p>
                        <p className="text-xs text-gray-500">Create custom analytics report</p>
                      </div>
                    </button>

                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">Set Alerts</p>
                        <p className="text-xs text-gray-500">Configure performance alerts</p>
                      </div>
                    </button>

                    <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-900">Share Insights</p>
                        <p className="text-xs text-gray-500">Export and share analytics</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'partners' && (
              <div className="bg-white rounded-lg shadow p-6">
                                {/* Partner Statistics Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Handshake className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Active Partners
                        </p>
                        <p className="text-2xl font-bold">
                          {partners.filter(p => p.is_active).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <CarFront className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Total Cars Listed
                        </p>
                        <p className="text-2xl font-bold">
                          {partners.reduce((sum, p) => sum + (p.listings_count || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Album className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Average Cars/Partner
                        </p>
                        <p className="text-2xl font-bold">
                          {partners.length > 0 
                            ? Math.round(partners.reduce((sum, p) => sum + (p.listings_count || 0), 0) / partners.length)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Partners Management</h2>
                    <p className="text-gray-600">Manage all registered partners and their companies</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {partners.filter(partner => {
                      const matchesSearch = !partnerSearchTerm || 
                        partner.company_name?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                        partner.tax_id?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                        partner.user?.email?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                        partner.user?.username?.toLowerCase().includes(partnerSearchTerm.toLowerCase());
                      
                      const matchesStatus = partnerStatusFilter === "all" ||
                        (partnerStatusFilter === "active" && partner.is_active) ||
                        (partnerStatusFilter === "inactive" && !partner.is_active);
                      
                      return matchesSearch && matchesStatus;
                    }).length} partners found
                  </span>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search partners by company name, tax ID, or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={partnerSearchTerm}
                        onChange={(e) => setPartnerSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={partnerStatusFilter}
                      onChange={(e) => setPartnerStatusFilter(e.target.value)}
                    >
                      <option value="all">All Partners</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>

                {/* Partners Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Person
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cars Listed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingData ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          </td>
                        </tr>
                      ) : partners.filter(partner => {
                        const matchesSearch = !partnerSearchTerm || 
                          partner.company_name?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                          partner.tax_id?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                          partner.user?.email?.toLowerCase().includes(partnerSearchTerm.toLowerCase()) ||
                          partner.user?.username?.toLowerCase().includes(partnerSearchTerm.toLowerCase());
                        
                        const matchesStatus = partnerStatusFilter === "all" ||
                          (partnerStatusFilter === "active" && partner.is_active) ||
                          (partnerStatusFilter === "inactive" && !partner.is_active);
                        
                        return matchesSearch && matchesStatus;
                      }).map((partner, index) => (
                        <tr key={partner.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Handshake className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {partner?.company_name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {partner?.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {partner?.user?.first_name && partner?.user?.last_name
                                ? `${partner?.user?.first_name} ${partner?.user?.last_name}`
                                : partner?.user?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {partner?.user?.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {partner?.tax_id || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              partner?.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {partner?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {partner?.created_at 
                                ? new Date(partner?.created_at).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <CarFront className="h-3 w-3 mr-1" />
                                {partner?.listings_count || 0} cars
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900" title="Edit Partner">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900" title="Delete Partner">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentView === 'cars' && (
              
              <div className="bg-white rounded-lg shadow p-6">
                {/* Car Statistics Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <CarFront className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Total Cars
                        </p>
                        <p className="text-2xl font-bold">
                          {listings.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <CarFront className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Available Cars
                        </p>
                        <p className="text-2xl font-bold">
                          {listings.filter(car => car.is_available).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Album className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold">
                          {listings.reduce((sum, car) => sum + (car.bookings_count || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Avg Price/Day
                        </p>
                        <p className="text-2xl font-bold">
                          ${listings.length > 0 
                            ? Math.round(listings.reduce((sum, car) => sum + (car.price_per_day || car.daily_rate || 0), 0) / listings.length)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cars Management</h2>
                    <p className="text-gray-600">Manage all car listings and their details</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {listings.filter(car => {
                      const matchesSearch = !carSearchTerm || 
                        car.make?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                        car.model?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                        car.license_plate?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                        car.partner?.company_name?.toLowerCase().includes(carSearchTerm.toLowerCase());
                      
                      const matchesStatus = carStatusFilter === "all" ||
                        (carStatusFilter === "available" && car.is_available) ||
                        (carStatusFilter === "unavailable" && !car.is_available);
                      
                      return matchesSearch && matchesStatus;
                    }).length} cars found
                  </span>
                </div>


                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search cars by make, model, license plate, or partner..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={carSearchTerm}
                        onChange={(e) => setCarSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={carStatusFilter}
                      onChange={(e) => setCarStatusFilter(e.target.value)}
                    >
                      <option value="all">All Cars</option>
                      <option value="available">Available Only</option>
                      <option value="unavailable">Unavailable Only</option>
                    </select>
                  </div>
                </div>

                {/* Cars Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Partner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          License Plate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price/Day
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingData ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          </td>
                        </tr>
                      ) : listings.filter(car => {
                        const matchesSearch = !carSearchTerm || 
                          car.make?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                          car.model?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                          car.license_plate?.toLowerCase().includes(carSearchTerm.toLowerCase()) ||
                          car.partner?.company_name?.toLowerCase().includes(carSearchTerm.toLowerCase());
                        
                        const matchesStatus = carStatusFilter === "all" ||
                          (carStatusFilter === "available" && car.is_available) ||
                          (carStatusFilter === "unavailable" && !car.is_available);
                        
                        return matchesSearch && matchesStatus;
                      }).map((car, index) => (
                        <tr key={car.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0">
                                {car.image ? (
                                  <img 
                                    className="h-12 w-12 rounded-lg object-cover" 
                                    src={car.image} 
                                    alt={`${car.make} ${car.model}`}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className={`h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center ${car.image ? 'hidden' : 'flex'}`}>
                                  <CarFront className="h-6 w-6 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {car.make} {car.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {car.year} • {car.category || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {car.partner?.company_name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {car.partner?.id || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {car.license_plate || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              car.is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {car.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${car.price_per_day || car.daily_rate || 0}/day
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Album className="h-3 w-3 mr-1" />
                                {car.bookings_count || 0} bookings
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900" title="Edit Car">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900" title="Delete Car">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentView === 'bookings' && (
              <div className="bg-white rounded-lg shadow p-6">
                                {/* Booking Statistics Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Album className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold">
                          {bookings.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <Album className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Active Bookings
                        </p>
                        <p className="text-2xl font-bold">
                          {bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">
                          ${bookings.reduce((sum, b) => sum + (parseFloat(b.price) || parseFloat(b.total_price) || 0), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium opacity-90">
                          Avg Booking Value
                        </p>
                        <p className="text-2xl font-bold">
                          ${bookings.length > 0 
                            ? Math.round(bookings.reduce((sum, b) => sum + (parseFloat(b.price) || parseFloat(b.total_price) || 0), 0) / bookings.length)
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                                {/* Booking Status Breakdown */}
                <div className="mt-8 grid-cols-1 md:grid-cols-4 gap-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Status Breakdown</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map(status => (
                        <div key={status} className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {bookings.filter(booking => booking.status?.toLowerCase() === status).length}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bookings Management</h2>
                    <p className="text-gray-600">Manage all car rental bookings and reservations</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {bookings.filter(booking => {
                      const matchesSearch = !bookingSearchTerm || 
                        booking.id?.toString().includes(bookingSearchTerm) ||
                        booking.user?.email?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                        booking.user?.username?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                        booking.listing?.make?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                        booking.listing?.model?.toLowerCase().includes(bookingSearchTerm.toLowerCase());
                      
                      const matchesStatus = bookingStatusFilter === "all" ||
                        booking.status?.toLowerCase() === bookingStatusFilter;
                      
                      return matchesSearch && matchesStatus;
                    }).length} bookings found
                  </span>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search bookings by ID, user, or car..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={bookingSearchTerm}
                        onChange={(e) => setBookingSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                    >
                      <option value="all">All Bookings</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loadingData ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          </td>
                        </tr>
                      ) : bookings.filter(booking => {
                        const matchesSearch = !bookingSearchTerm || 
                          booking.id?.toString().includes(bookingSearchTerm) ||
                          booking.user?.email?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                          booking.user?.username?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                          booking.listing?.make?.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
                          booking.listing?.model?.toLowerCase().includes(bookingSearchTerm.toLowerCase());
                        
                        const matchesStatus = bookingStatusFilter === "all" ||
                          booking.status?.toLowerCase() === bookingStatusFilter;
                        
                        return matchesSearch && matchesStatus;
                      }).map((booking, index) => (
                        <tr key={booking.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Album className="h-6 w-6 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  #{booking.id || index + 1}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.created_at 
                                    ? new Date(booking.created_at).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.user?.first_name && booking.user?.last_name
                                ? `${booking.user?.first_name} ${booking.user?.last_name}`
                                : booking.user?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.user?.email || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0">
                                {booking.listing?.image ? (
                                  <img 
                                    className="h-8 w-8 rounded object-cover" 
                                    src={booking.listing.image} 
                                    alt={`${booking.listing.make} ${booking.listing.model}`}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className={`h-8 w-8 rounded bg-gray-100 flex items-center justify-center ${booking.listing?.image ? 'hidden' : 'flex'}`}>
                                  <CarFront className="h-4 w-4 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {booking.listing?.make} {booking.listing?.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.listing?.year || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">
                                {booking.start_time 
                                  ? new Date(booking.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                  : "N/A"}
                              </div>
                              <div className="text-gray-500">
                                to {booking.end_time 
                                  ? new Date(booking.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                  : "N/A"}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {booking.start_time && booking.end_time 
                                ? (() => {
                                    const start = new Date(booking.start_time)
                                    const end = new Date(booking.end_time)
                                    start.setHours(0, 0, 0, 0)
                                    end.setHours(0, 0, 0, 0)
                                    const diffInMs = end.getTime() - start.getTime()
                                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
                                    return Math.max(1, Math.ceil(diffInDays)) + " days"
                                  })()
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${booking.price || booking.total_price || 0}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${booking.daily_rate || booking.price_per_day || 0}/day
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900" title="View Details">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900" title="Edit Booking">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900" title="Cancel Booking">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Activity Timeline */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Booking Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      {bookings
                        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
                        .slice(0, 5)
                        .map((booking, index) => (
                        <div key={booking.id || index} className="flex items-center space-x-3 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-500' :
                            booking.status === 'pending' ? 'bg-yellow-500' :
                            booking.status === 'cancelled' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}></div>
                          <span className="text-gray-600">
                            {booking.created_at 
                              ? new Date(booking.created_at).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span className="text-gray-900">
                            New booking #{booking.id} by {booking.user?.username || "Unknown"}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'earnings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Earnings Overview</h2>
                    <p className="text-gray-600">Monitor revenue, profits, and financial analytics</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="all">All Time</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>

                {/* Revenue Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Total Revenue</p>
                        <p className="text-3xl font-bold">
                          ${stats.totalEarnings.toLocaleString()}
                        </p>
                        <p className="text-sm opacity-75 mt-1">
                          +12.5% from last month
                        </p>
                      </div>
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Monthly Revenue</p>
                        <p className="text-3xl font-bold">
                          ${Math.round(stats.totalEarnings / 12).toLocaleString()}
                        </p>
                        <p className="text-sm opacity-75 mt-1">
                          Average per month
                        </p>
                      </div>
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Avg. Booking Value</p>
                        <p className="text-3xl font-bold">
                          ${bookings.length > 0 
                            ? Math.round(stats.totalEarnings / bookings.length)
                            : 0}
                        </p>
                        <p className="text-sm opacity-75 mt-1">
                          Per booking
                        </p>
                      </div>
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <Album className="h-8 w-8" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Commission Rate</p>
                        <p className="text-3xl font-bold">15%</p>
                        <p className="text-sm opacity-75 mt-1">
                          Platform fee
                        </p>
                      </div>
                      <div className="p-3 bg-white bg-opacity-20 rounded-full">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Revenue Trends</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">Daily</button>
                        <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md">Weekly</button>
                        <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-md">Monthly</button>
                      </div>
                    </div>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                      <AreaChart accessibilityLayer data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stackId="1"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.6}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>

                {/* Earnings Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Top Performing Cars */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Cars</h3>
                    <div className="space-y-4">
                      {listings
                        .sort((a, b) => (b.bookings_count || 0) * (b.price_per_day || b.daily_rate || 0) - (a.bookings_count || 0) * (a.price_per_day || a.daily_rate || 0))
                        .slice(0, 5)
                        .map((car, index) => (
                        <div key={car.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 flex-shrink-0">
                              {car.image ? (
                                <img 
                                  className="h-10 w-10 rounded-lg object-cover" 
                                  src={car.image} 
                                  alt={`${car.make} ${car.model}`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center ${car.image ? 'hidden' : 'flex'}`}>
                                <CarFront className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {car.make} {car.model}
                              </p>
                              <p className="text-xs text-gray-500">
                                {car.bookings_count || 0} bookings
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${((car.bookings_count || 0) * (car.price_per_day || car.daily_rate || 0)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${car.price_per_day || car.daily_rate || 0}/day
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Partners by Revenue */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Partners by Revenue</h3>
                    <div className="space-y-4">
                      {partners
                        .sort((a, b) => (b.listings_count || 0) - (a.listings_count || 0))
                        .slice(0, 5)
                        .map((partner, index) => {
                          const partnerRevenue = listings
                            .filter(car => car.partner?.id === partner.id)
                            .reduce((sum, car) => sum + ((car.bookings_count || 0) * (car.price_per_day || car.daily_rate || 0)), 0);
                          
                          return (
                            <div key={partner.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Handshake className="h-6 w-6 text-blue-600" />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {partner.company_name || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {partner.listings_count || 0} cars listed
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                  ${partnerRevenue.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Total revenue
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Revenue Analytics Table */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Metric
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            This Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Change
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Gross Revenue
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round(stats.totalEarnings / 12).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round(stats.totalEarnings / 15).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+25.0%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${stats.totalEarnings.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Platform Commission (15%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round((stats.totalEarnings / 12) * 0.15).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round((stats.totalEarnings / 15) * 0.15).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+25.0%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${Math.round(stats.totalEarnings * 0.15).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Partner Payout (85%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round((stats.totalEarnings / 12) * 0.85).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${Math.round((stats.totalEarnings / 15) * 0.85).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+25.0%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${Math.round(stats.totalEarnings * 0.85).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Total Bookings
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {Math.round(stats.totalBookings / 12)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {Math.round(stats.totalBookings / 15)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="text-green-600 font-medium">+25.0%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stats.totalBookings}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {listings.filter(car => car.is_available).length}
                    </div>
                    <div className="text-sm text-gray-600">Available Cars</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Generating revenue
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-gray-600">Active Bookings</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Currently earning
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {partners.filter(p => p.is_active).length}
                    </div>
                    <div className="text-sm text-gray-600">Active Partners</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Contributing to revenue
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
