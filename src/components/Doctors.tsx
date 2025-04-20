"use client";
import { useState, useEffect } from "react";
import {
  UserPlus,
  Stethoscope,
  X,
  Check,
  Loader2,
  Trash2,
  Pencil,
  Mail,
} from "lucide-react";
import { type Doctor } from "@/types/medilab";
import { toast, Toaster } from "react-hot-toast";

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
  });
  const [editDoctor, setEditDoctor] = useState({
    name: "",
    email: "",
    specialty: "",
  });
  const [currentDoctorId, setCurrentDoctorId] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/v2/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoctor),
      });

      if (!response.ok) {
        throw new Error("Failed to add doctor");
      }

      fetchDoctors(); // Refresh the list of doctors
      toast.success("Doctor added successfully");

      setIsModalOpen(false);
      setNewDoctor({ name: "", email: "", specialty: "" });
    } catch (err) {
      toast.error("Failed to add doctor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v2/doctors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }
      toast.success("Doctor deleted successfully");
      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    } catch (err) {
      toast.error("Failed to delete doctor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setIsEditModalOpen(true);
      const doctorToEdit = doctors.find((doctor) => doctor.id === id);

      if (!doctorToEdit) {
        toast.error("Doctor not found");
      }

      setEditDoctor({
        name: doctorToEdit?.name || "",
        email: doctorToEdit?.email || "",
        specialty: doctorToEdit?.specialty || "",
      });
      setCurrentDoctorId(id);
    } catch (error) {
      toast.error("Error editing record.");
      console.error(error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v2/doctors/${currentDoctorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editDoctor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update doctor");
      }

      toast.success("Doctor updated successfully");

      // Update the doctors list with the edited doctor
      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor.id === currentDoctorId
            ? { ...doctor, ...editDoctor, id: currentDoctorId }
            : doctor
        )
      );

      // Close modal and reset form
      setIsEditModalOpen(false);
      setEditDoctor({ name: "", email: "", specialty: "" });
      setCurrentDoctorId("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.message && err.message.includes("Unique constraint")) {
        toast.error("Email address is already in use");
      } else {
        toast.error(err.message || "Failed to update doctor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && doctors.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] py-4 px-4 max-w-7xl mx-auto md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white">
          Doctors Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          <span className="hidden md:block">Add New Doctor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-lg shadow-md p-4 pr-2 md:p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start h-full justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>
                  {/* Doctor details with proper icons */}
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm">{doctor.specialty}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full">
                  <button
                    className="p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => handleEdit(doctor.id)}
                  >
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </button>
                  <button
                    className="p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-white">
            No doctors record found.
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl md:w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Add New Doctor
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewDoctor({ name: "", email: "", specialty: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newDoctor.name}
                    placeholder="Full Name"
                    onChange={(e) =>
                      setNewDoctor((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newDoctor.email}
                    placeholder="Email address"
                    onChange={(e) =>
                      setNewDoctor((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Specialty
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    value={newDoctor.specialty}
                    placeholder="Specialty"
                    onChange={(e) =>
                      setNewDoctor((prev) => ({
                        ...prev,
                        specialty: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewDoctor({ name: "", email: "", specialty: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-white bg-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Add Doctor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl md:w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Edit Doctor
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditDoctor({ name: "", email: "", specialty: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={editDoctor.name}
                    placeholder="Full Name"
                    onChange={(e) =>
                      setEditDoctor((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={editDoctor.email}
                    placeholder="Email address"
                    onChange={(e) =>
                      setEditDoctor((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-specialty"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Specialty
                  </label>
                  <input
                    type="text"
                    id="edit-specialty"
                    value={editDoctor.specialty}
                    placeholder="Specialty"
                    onChange={(e) =>
                      setEditDoctor((prev) => ({
                        ...prev,
                        specialty: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditDoctor({ name: "", email: "", specialty: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-white bg-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Update Doctor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Doctors;
