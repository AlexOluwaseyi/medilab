"use client";
import { useState, useRef, useEffect } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import TestRecord from "@/types/TestRecord";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (record: TestRecord) => void;
}

const CreateModal = ({ isOpen, onClose, onSuccess }: CreateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    testType: "",
    result: "",
    notes: "",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!formData.patientName.trim()) {
      setError("Patient name is required");
      return;
    }

    if (!formData.testType.trim()) {
      setError("Test type is required");
      return;
    }

    if (!formData.result.trim()) {
      setError("Test result is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Show success message
      setSuccess(true);

      // Reset form
      setFormData({
        patientName: "",
        testType: "",
        result: "",
        notes: "",
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data.record || data.Record);
      }

      // Close modal after delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to create test:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create test record"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden"
      >
        {/* Modal header */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-900 to-green-900 text-white">
          <h2 className="text-xl font-bold">Create New Test</h2>
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
              Test record created successfully!
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Patient Name */}
            <div>
              <label
                htmlFor="patientName"
                className="block text-sm font-medium text-black mb-1"
              >
                Patient Name*
              </label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none "
                placeholder="Enter patient name"
                required
              />
            </div>

            {/* Test Type */}
            <div>
              <label
                htmlFor="testType"
                className="block text-sm font-medium text-black mb-1"
              >
                Test Type*
              </label>
              <select
                id="testType"
                name="testType"
                value={formData.testType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                required
              >
                <option value="">Select a test type</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="COVID-19">COVID-19</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI Scan">MRI Scan</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="Biopsy">Biopsy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Test Result */}
            <div>
              <label
                htmlFor="result"
                className="block text-sm font-medium text-black mb-1"
              >
                Result*
              </label>
              <select
                id="result"
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none "
                required
              >
                <option value="">Select a result</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Inconclusive">Inconclusive</option>
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-black mb-1"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-black"
                rows={3}
                placeholder="Add any notes or observations"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white  bg-gradient-to-r from-blue-900 to-green-900  focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating...
                </div>
              ) : (
                "Create Test Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
