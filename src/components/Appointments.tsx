"use client";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { type Doctor, type Appointment } from "@/types/medilab";
import AppointmentDetailsModal from "./modals/AppointmentDetails";

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>(
    {}
  );
  // const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/v2/appointments");

      if (!response.ok) {
        throw new Error("Error fetching appointments.");
      }
      const { appointments } = await response.json();

      setAppointments(appointments);
    } catch (err) {
      toast.error("Failed to load appointments");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/v2/doctors");
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const { doctors } = await response.json();
      setDoctors(doctors);
    } catch (err) {
      toast.error("Failed to load doctors");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    id: string,
    status: "PENDING" | "APPROVED" | "DECLINED" | "COMPLETED" | "CANCELLED",
    doctorId?: string
  ) => {
    try {
      const loadingToast = toast.loading("Updating appointment status...");
      const response = await fetch("/api/v2/update-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId: id, status, doctorId }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve appointment");
      }
      toast.success("Appointment approved successfully!");

      if (doctorId) {
        const createTest = await fetch("/api/v2/tests", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId: id, doctorId }),
        });

        const testData = await createTest.json();

        if (!createTest.ok) {
          throw new Error(
            testData.message || "Failed to create test record after approval"
          );
        }
        toast.dismiss();
        toast.success("Created test record succesfully!");
      }
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status,
                doctorId: doctorId || appointment.doctorId,
              }
            : appointment
        )
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update appointment status"
      );
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    statusFilter === "all" ? true : appointment.status === statusFilter
  );

  const handleSendEmail = async (
    appointmentId: string,
    status: string,
    doctorId?: string // Make doctorId optional
  ) => {
    try {
      if (status !== "DECLINED" && !doctorId) {
        toast.error("No doctor assigned to this appointment");
        return;
      }

      // setIsSending(true);
      setSendingEmails((prev) => ({ ...prev, [appointmentId]: true }));
      toast.loading("Sending email notification...");

      const response = await fetch("/api/v2/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId, status, doctorId }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      toast.dismiss();
      toast.success("Email sent successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to send email"
      );
      console.error("Error sending email:", error);
    } finally {
      // setIsSending(false);
      setSendingEmails((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600";
      case "DECLINED":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] p-4 max-w-7xl mx-auto">
      <div className="mb-4 md:mb-8 flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-xl md:text-3xl mb-4 md:mb-0 font-bold text-white">
          Appointment Management
        </h1>
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-white" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:text-black focus:bg-white"
          >
            <option value="all">All Appointments</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="DECLINED">Declined</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-900 to-green-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border-r w-1/4">
                  Patient Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border-r w-1/5">
                  Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border-r w-1/6">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase border-r w-1/5">
                  Doctor Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 border-r border-r-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {appointment.patientName}
                      </span>
                      <span className="text-sm text-black">
                        {appointment.email}
                      </span>
                      <span className="text-sm text-black">
                        {appointment.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-r-gray-500">
                    <div className="flex flex-col">
                      <span className="text-sm text-black">
                        {formatDate(appointment.appointmentDate)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {appointment.test}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r border-r-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status === "PENDING" && (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {appointment.status === "APPROVED" && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {appointment.status === "DECLINED" && (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {appointment.status === "COMPLETED" && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {appointment.status === "CANCELLED" && (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r border-r-gray-500">
                    {(appointment.status === "APPROVED" ||
                      appointment.status === "COMPLETED") && (
                      <select
                        value={appointment.doctorId || ""}
                        onChange={(e) =>
                          updateAppointmentStatus(
                            appointment.id,
                            "APPROVED",
                            e.target.value
                          )
                        }
                        disabled={appointment.status === "COMPLETED"}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {appointment.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "APPROVED"
                              )
                            }
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment.id,
                                "DECLINED"
                              )
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {appointment.status !== "PENDING" && (
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={() =>
                              handleSendEmail(
                                appointment.id,
                                appointment.status,
                                appointment.doctorId || ""
                              )
                            }
                            disabled={
                              sendingEmails[appointment.id] ||
                              (appointment.status === "APPROVED" &&
                                !appointment.doctorId)
                            }
                            className={`text-xs ${
                              appointment.status === "APPROVED" &&
                              !appointment.doctorId
                                ? "text-gray-400 cursor-not-allowed"
                                : sendingEmails[appointment.id]
                                ? "text-gray-500"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {sendingEmails[appointment.id]
                              ? "Sending..."
                              : "Send Email"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            View Records
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Toaster position="top-center" />

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-white">
            No appointments found for the selected filter.
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={!!selectedAppointment}
          onClose={() => {
            setSelectedAppointment(null);
            fetchAppointments();
          }}
          appointment={selectedAppointment}
          doctors={doctors}
        />
      )}
    </div>
  );
};

export default Appointments;
