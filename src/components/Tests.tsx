"use client";
import { useEffect, useState } from "react";
import TestRecord from "@/types/TestRecord";
import DeleteModal from "./modals/DeleteModal";
import Link from "next/link";

const Tests = () => {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);

  useEffect(() => {
    document.title = "Tests Records";
    async function fetchTests() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/v1/tests");
        if (!response.ok) {
          throw new Error("An error occurred while fetching tests records.");
        }

        const data = await response.json();
        if (data.length === 0) {
          return "No records found.";
        }

        setTests(data.Records);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return `An error occurred while fetching tests records: ${errorMessage}`;
      } finally {
        setIsLoading(false);
      }
    }

    fetchTests();
  }, []);

  const openDeleteModal = (test: TestRecord) => {
    setSelectedTest(test);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTest(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/tests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete test");
      }
      // Remove the deleted test from the state
      setTests(tests.filter((test) => test.id !== id));

      // Close the modal
      closeDeleteModal();

      // Show success message (could be a toast notification in a real app)
      alert("Test deleted successfully");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete test. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="md:max-w-10/12 min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] mx-auto px-6 py-12 flex justify-center items-center">
        <div className="text-xl">Loading test records...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto md:max-w-10/12 min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] md:mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold flex justify-center">Tests Records</h1>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-900 to-green-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-r"
              >
                S/N
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-r"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider border-b border-r"
              >
                Patient Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider border-b"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y bg-black divide-gray-200">
            {tests && tests.length > 0 ? (
              tests.map((test, index) => (
                <tr key={test.id} className="">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white border-r">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white border-r">
                    {test.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white border-r">
                    {test.patientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center flex flex-col md:flex-row gap-4 items-center justify-center">
                    <button>
                      <Link
                        href={`/tests/${test.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-700 bg-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                    </button>
                    <button
                      onClick={() => openDeleteModal(test)}
                      className="hidden md:inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-white"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {selectedTest && (
        <DeleteModal
          test={selectedTest}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          isOpen={deleteModalOpen}
        />
      )}
    </div>
  );
};

export default Tests;
