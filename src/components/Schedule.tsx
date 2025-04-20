"use client";
import { useState } from "react";
import ScheduleModal from "./modals/ScheduleModal";
import { Calendar } from "lucide-react";

export const metadata = {
  title: "Schedule an Appointment",
  description: "Book your laboratory test appointment",
};

function Appointment() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = (record: unknown) => {
    console.log("New schedule:", record);
    // Additional success handling if needed
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Schedule Your Test
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Book your medical test appointment quickly and easily. Our
            professional team is ready to assist you.
          </p>
        </div>

        {/* Main Content */}
        <div className=" rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column - Information */}
            <div className="p-8 bg-gradient-to-br from-blue-900 to-green-900 text-white">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Why Choose Us?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-blue-200">
                      ✓
                    </span>
                    <span className="ml-3">Professional medical staff</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-blue-200">
                      ✓
                    </span>
                    <span className="ml-3">State-of-the-art equipment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-blue-200">
                      ✓
                    </span>
                    <span className="ml-3">Quick results delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 text-blue-200">
                      ✓
                    </span>
                    <span className="ml-3">Flexible scheduling options</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Available Tests
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-medium">Blood Tests</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-medium">COVID-19</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-medium">X-Ray</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="font-medium">Ultrasound</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Schedule Button */}
            <div className="p-8 flex flex-col items-center justify-center bg-gray-50">
              <div className="text-center max-w-md">
                <Calendar className="mx-auto h-16 w-16 text-blue-900 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Schedule?
                </h2>
                <p className="text-gray-600 mb-8">
                  Click below to schedule your test appointment. Our team will
                  confirm your booking within 24 hours.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 px-6 text-white bg-gradient-to-r from-blue-900 to-green-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fast Results
            </h3>
            <p className="text-gray-600">
              Get your test results quickly and securely through our online
              portal.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Expert Analysis
            </h3>
            <p className="text-gray-600">
              Our experienced medical professionals ensure accurate test
              interpretation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600">
              Our customer service team is always available to assist you.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default Appointment;
