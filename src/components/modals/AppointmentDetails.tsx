import { X, Calendar, Mail, Phone, Stethoscope, Clock } from "lucide-react";
import { type Appointment } from "@/types/medilab";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  doctors: Array<{ id: string; name: string; specialty: string }>;
}

const AppointmentDetailsModal = ({
  appointment,
  isOpen,
  onClose,
  doctors,
}: AppointmentDetailsModalProps) => {
  if (!isOpen) return null;

  // Initialize with existing test result if available
  const existingResult =
    appointment.TestResult && appointment.TestResult.length > 0
      ? appointment.TestResult[0].result
      : "";

  const [testResult, setTestResult] = useState(existingResult);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignedDoctor = doctors.find((d) => d.id === appointment.doctorId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleResultSubmit = async () => {
    if (!testResult.trim()) {
      toast.error("Please enter a test result");
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Submitting test result...");

      const response = await fetch("/api/v2/tests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          result: testResult,
          status: "COMPLETED",
        }),
      });

      const data = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit test result");
      }

      toast.success("Test result submitted successfully");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit test result"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Appointment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">{appointment.patientName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{appointment.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{appointment.phone}</span>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Appointment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
                {assignedDoctor && (
                  <div className="flex items-center text-gray-600">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    <span>
                      {assignedDoctor.name} - {assignedDoctor.specialty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test description and result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Test Description
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
                {appointment.test}
              </p>
            </div>
            {(appointment.status === "APPROVED" ||
              appointment.status === "COMPLETED") && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Test Result
                </h3>
                <textarea
                  name="testResult"
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                  placeholder="Enter test result here."
                  disabled={appointment.status === "COMPLETED"}
                  className={`w-full text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-300 
                    ${
                      appointment.status !== "COMPLETED"
                        ? "focus:outline-none focus:ring-2 focus:ring-blue-500"
                        : ""
                    }
                    ${
                      appointment.status === "COMPLETED"
                        ? "opacity-80 cursor-not-allowed"
                        : ""
                    }`}
                  rows={1}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-500 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {appointment.status === "APPROVED" && (
            <button
              onClick={handleResultSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Complete"}
            </button>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default AppointmentDetailsModal;
