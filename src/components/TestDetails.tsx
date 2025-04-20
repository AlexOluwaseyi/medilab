"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import TestRecord from "@/types/TestRecord";
import DeleteModal from "./modals/DeleteModal";
import EditModal from "./modals/EditModal";

interface TestDetailsProps {
  id: string;
}

const TestDetails = ({ id }: TestDetailsProps) => {
  const [test, setTest] = useState<TestRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/tests/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Test record not found");
          } else {
            throw new Error("Error fetching test details");
          }
        }

        const data = await response.json();
        setTest(data.Record || data.record || data);
      } catch (err) {
        console.error("Failed to fetch test details:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTestDetails();
    }
  }, [id]);

  const openDeleteModal = () => {
    if (test) {
      setDeleteModalOpen(true);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/tests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete test");
      }

      // Close the modal
      closeDeleteModal();

      // Show success message (could be a toast notification in a real app)
      alert("Record deleted successfully");

      // Redirect to tests list page
      window.location.href = "/tests";
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete record. Please try again.");
    }
  };

  const openEditModal = () => {
    if (test) {
      setEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEdit = async (updatedData: Partial<TestRecord>) => {
    try {
      const response = await fetch(`/api/v1/tests/${test?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testType: updatedData.testType,
          result: updatedData.result,
          notes: updatedData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update test");
      }

      const data = await response.json();

      // Update the test in state to refresh UI
      setTest(data.Record || data.record || data);

      // Close the modal
      closeEditModal();

      // Show success message
      alert("Record updated successfully");
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Failed to update record. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading test details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))]">
        <div className="flex items-center mb-6">
          <Link
            href="/tests"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tests
          </Link>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <p className="text-red-700 font-medium">Error</p>
          </div>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))]">
        <div className="flex items-center mb-6">
          <Link
            href="/tests"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tests
          </Link>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-md">
          <p className="text-yellow-700">
            Test record not found. The record may have been deleted or you may
            have followed an invalid link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))]">
      <div className="flex items-center mb-6">
        <Link
          href="/tests"
          className="flex items-center text-white hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tests
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-green-900 p-6">
          <h1 className="text-2xl font-bold text-white">
            Test Record #{test.id}
          </h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-medium text-black">Patient Name</h2>
              <p className="mt-1 text-lg text-black font-semibold">
                {test.patientName}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-black">Test Type</h2>
              <p className="mt-1 text-lg text-black font-semibold">
                {test.testType}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-black">Result</h2>
              <p className="mt-1 text-lg text-black font-semibold">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    test.result === "Positive"
                      ? "bg-red-100 text-red-800"
                      : test.result === "Negative"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {test.result}
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-black">Test Date</h2>
              <p className="mt-1 text-lg text-black font-semibold">
                {new Date(test.testDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h2 className="text-sm font-medium text-black mb-2">Notes</h2>
              <div className="w-full px-3 py-3 bg-gray-100 border border-gray-200 rounded-md text-gray-800 min-h-[50px] disabled:bg-gray-100 overflow-auto">
                {test.notes ? (
                  <div className="whitespace-pre-wrap">{test.notes}</div>
                ) : (
                  <div className="text-gray-500 italic">N/A</div>
                )}
              </div>
            </div>
          </div>

          {test.notes && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-black">Notes</h2>
              <div className="mt-1 p-4 bg-gray-50 rounded-md">
                <p className="whitespace-pre-wrap">{test.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-black">
              <div className="flex flex-col md:block">
                <span>
                  <strong>Created:</strong>{" "}
                  {new Date(test.createdAt).toLocaleString()}
                </span>
                <span className="md:ml-4">
                  <strong>Updated:</strong>{" "}
                  {new Date(test.updatedAt).toLocaleString()}
                </span>
              </div>

              <div className="flex space-x-3">
                {/* <Link
                  href={`/tests/edit/${test.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link> */}
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => openEditModal()}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => openDeleteModal()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {test && (
        <DeleteModal
          test={test}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          isOpen={deleteModalOpen}
        />
      )}

      {/* Edit modal */}
      {test && (
        <EditModal
          test={test}
          onClose={closeEditModal}
          onSuccess={handleEdit}
          isOpen={editModalOpen}
        />
      )}
    </div>
  );
};

export default TestDetails;
