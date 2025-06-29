"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  //   Users,
  //   ClipboardList,
  UserPlus,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { type Appointment } from "@/types/medilab";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Calculate appointment statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    approved: appointments.filter((a) => a.status === "APPROVED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    declined: appointments.filter((a) => a.status === "DECLINED").length,
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/v2/appointments");

      if (!response.ok) {
        throw new Error("Error fetching appointments.");
      }
      const { appointments } = await response.json();
      console.log(appointments);

      setAppointments(appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart configuration
  const chartData = {
    labels: [
      "Total",
      "Pending",
      "Approved",
      "Completed",
      "Cancelled",
      "Declined",
    ],
    datasets: [
      {
        label: "Appointments",
        data: [
          stats.total,
          stats.pending,
          stats.approved,
          stats.completed,
          stats.cancelled,
          stats.declined,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)", // blue
          "rgba(245, 158, 11, 0.5)", // yellow
          "rgba(16, 185, 129, 0.5)", // green
          "rgba(147, 51, 234, 0.5)", // purple
          "rgba(107, 114, 128, 0.5)", // gray
          "rgba(239, 68, 68, 0.5)", // red
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
          "rgb(147, 51, 234)",
          "rgb(107, 114, 128)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Appointment Statistics",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-8">
            Admin Dashboard
          </h1>
          <div className="flex flex-row ml-auto space-x-4">
            <Link href="/admin/appointments">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-blue-600 rounded-lg md:hidden">
                <Calendar className="h-5 w-5 text-blue-500" />{" "}
              </button>
            </Link>
            <Link href="/admin/doctors">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-green-700 rounded-lg md:hidden">
                <UserPlus className="h-5 w-5 text-blue-500" />{" "}
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {stats.completed}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {stats.cancelled}
                </p>
              </div>
              <Ban className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-semibold text-red-600">
                  {stats.declined}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Chart and Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Appointment Summary
            </h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-2">
                    Status
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-2">
                    Count
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider py-2">
                    Percentage
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {/* <td className="py-2 text-black">Total</td> */}
                  <td className="py-2 text-black">Pending</td>
                  <td className="py-2 text-black">{stats.pending}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? `((stats.pending / stats.total) * 100).toFixed(1)%`
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-black">Approved</td>
                  <td className="py-2 text-black">{stats.approved}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? `((stats.approved / stats.total) * 100).toFixed(1)%`
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-black">Completed</td>
                  <td className="py-2 text-black">{stats.completed}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? `((stats.completed / stats.total) * 100).toFixed(1)%`
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-black">Cancelled</td>
                  <td className="py-2 text-black">{stats.cancelled}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? `((stats.cancelled / stats.total) * 100).toFixed(1)%`
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-black">Declined</td>
                  <td className="py-2 text-black">{stats.declined}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? `((stats.declined / stats.total) * 100).toFixed(1)%`
                      : "-"}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 text-black">Total</td>
                  <td className="py-2 text-black">{stats.total}</td>
                  <td className="py-2 text-black">
                    {stats.total !== undefined && stats.total > 0
                      ? "100%"
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/appointments"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Appointments
                </h3>
                <p className="text-gray-500">
                  View and manage all appointment requests
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/doctors"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <UserPlus className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Doctors
                </h3>
                <p className="text-gray-500">Add and manage doctor records</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
