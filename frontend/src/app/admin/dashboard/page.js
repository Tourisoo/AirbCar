"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Bar, BarChart, AreaChart, Area } from "recharts"
import { UserRound, Handshake, CarFront, Album   } from 'lucide-react';


import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  active: {
    label: "Active",
    color: "#2563eb",
  },
  inActive: {
    label: "InActive",
    color: "#2563eb",
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
  const [users, setUsers] = useState([
    {
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      is_active: true,
    },
    {
      first_name: "Jane",
      last_name: "Smith",
      username: "janesmith",
      email: "jane.smith@example.com",
      is_active: false,
    },
    {
      first_name: "Michael",
      last_name: "Brown",
      username: "mikeb",
      email: "mike.brown@example.com",
      is_active: true,
    },
    {
      first_name: "Emily",
      last_name: "Johnson",
      username: "emjay",
      email: "emily.johnson@example.com",
      is_active: false,
    },
    {
      first_name: "Chris",
      last_name: "Williams",
      username: "chrisw",
      email: "chris.williams@example.com",
      is_active: true,
    },
    {
      first_name: "Sarah",
      last_name: "Davis",
      username: "sarahd",
      email: "sarah.davis@example.com",
      is_active: true,
    },
  ]);
  const [partners, setPartners] = useState([
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
    {
      first_name: "Alice",
      last_name: "Wonderland",
      email: "asd@asdasd.com",
      cars: 5,
      joined: "March 2022",
    },
  ]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalPartners: 0,
    totalListings: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  // Check admin status and redirect if not admin
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/signin')
      return
    }

    if (user) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  const checkAdminStatus = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/admin/signin");
        return;
      }

      const response = await fetch(`${apiUrl}/api/verify-token/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.is_staff === true || userData.is_superuser === true) {
          setIsAdmin(true);
          loadDashboardData();
        } else {
          router.push("/admin/signin");
        }
      } else {
        router.push("/admin/signin");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      router.push("/admin/signin");
    }
  };

  const loadDashboardData = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("access_token");

      // Load users
      const usersResponse = await fetch(`${apiUrl}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.results || usersData);
        setStats((prev) => ({
          ...prev,
          totalUsers: (usersData.results || usersData).length,
        }));
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/admin/signin");
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
              <a
                href="#"
                className="flex items-center space-x-3 text-white bg-gray-700 px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Dashboard</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Users</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Partners</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
                <span>Cars</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Bookings</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
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
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-md"
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
              </a>
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
                        {users.slice(0, 6).map((user, index) => (
                          <div
                            key={index}
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {/* Earnings Card */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Earnings
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    $5,200
                  </div>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>

                {/* Partner Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-6 py-5">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Partner Activity
                      </h3>
                      <div className="space-y-1">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-600">
                            Name
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            Joined
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            Cars
                          </div>
                        </div>

                        {/* Table Body */}

                        <div className="space-y-4 pt-4">
                          {partners.slice(0, 6).map((partner, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-3 gap-4 py-3 hover:bg-gray-50 rounded-md px-2 -mx-2"
                            >
                              <p className=" font-medium text-gray-900">
                                {partner?.first_name && partner?.last_name
                                  ? `${partner?.first_name} ${partner?.last_name}`
                                  : "N/A"}
                              </p>
                              <p className=" text-gray-600">
                                {partner?.joined}
                              </p>
                              <p className=" font-medium text-gray-600">
                                {partner?.cars}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Earnings Card */}
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <AreaChart accessibilityLayer data={chartData}>
                    <Area
                    type="natural"
                      dataKey="active"
                      fill="#2563EB"
                      radius={4}
                    />
                    <Area
                    type="natural"
                      dataKey="inActive"
                      fill="#00FFFF40"
                      radius={4}
                    />
                  </AreaChart>
                </ChartContainer>

                {/* Partner Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Partner Activity
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Active</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                        <span className="text-gray-600">Inactive</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Savannah Nguyen
                        </p>
                        <p className="text-xs text-gray-500">Jan. 2021</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">3</p>
                        <p className="text-xs text-gray-500">Cars</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Kristin Watson
                        </p>
                        <p className="text-xs text-gray-500">Jan 2018</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">2</p>
                        <p className="text-xs text-gray-500">Cars</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
