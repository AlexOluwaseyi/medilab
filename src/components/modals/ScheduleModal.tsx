"use client";
import { useState, useRef, useEffect } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (record: unknown) => void;
}

const ScheduleModal = ({ isOpen, onClose, onSuccess }: ScheduleModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    patientName: "",
    phone: "",
    test: "",
    appointmentDate: "",
  });

  // Handle email check and auto-fill
  const checkEmailAndFillData = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v2/check-email?email=${email}`);

      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const { data } = await response.json();

      if (data) {
        setFormData((prev) => ({
          ...prev,
          patientName: data.patientName,
          phone: data.phone,
        }));
      }

      setEmailSubmitted(true);
    } catch (err) {
      console.error("Error checking email:", err);
      setError("Failed to fetch patient data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Email is required");
      return;
    }
    await checkEmailAndFillData(formData.email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v2/create-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "PENDING",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      const data = await response.json();
      setSuccess(true);

      if (onSuccess) {
        onSuccess(data);
      }

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          email: "",
          patientName: "",
          phone: "",
          test: "",
          appointmentDate: "",
        });
        setEmailSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to schedule appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        resetForm();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Add this reset function to your component
  const resetForm = () => {
    setFormData({
      email: "",
      patientName: "",
      phone: "",
      test: "",
      appointmentDate: "",
    });
    setEmailSubmitted(false);
    setError(null);
    setSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden"
        >
          {/* Modal header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-900 to-green-900 text-white">
            <h2 className="text-xl font-bold">Schedule Test Appointment</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Success message */}
          {success && (
            <div className="p-6 bg-green-50 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800">
                Appointment scheduled successfully!
              </span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={emailSubmitted ? handleSubmit : handleEmailSubmit}
            className="p-6"
          >
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                  placeholder="Enter your email"
                  required
                  disabled={emailSubmitted}
                />
              </div>

              {emailSubmitted && (
                <>
                  {/* Patient Name */}
                  <div>
                    <label
                      htmlFor="patientName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* Test Description */}
                  <div>
                    <label
                      htmlFor="testDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Test Description*
                    </label>
                    <textarea
                      id="test"
                      name="test"
                      value={formData.test}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                      rows={3}
                      placeholder="Describe the test you need"
                      required
                    />
                  </div>

                  {/* Appointment Date */}
                  <div>
                    <label
                      htmlFor="appointmentDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Preferred Appointment Date*
                    </label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate.split("T")[0]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Submit button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-blue-900 to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    {emailSubmitted ? "Scheduling..." : "Please wait..."}
                  </div>
                ) : emailSubmitted ? (
                  "Schedule Appointment"
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ScheduleModal;
