import React from "react";
import {
  Microscope,
  FlaskRound as Flask,
  Clock,
  ChevronDown,
  Building2,
  Users,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-[calc(100dvh-(64px))] bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="text-white max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Advanced Medical Testing You Can Trust
              </h1>
              <p className="text-xl mb-8">
                Delivering precise and reliable laboratory results to millions
                of patients worldwide with state-of-the-art equipment and expert
                professionals.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors">
                <Link href={"/book-test"}> Book a Test</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <a href="#stats">
            <ChevronDown size={32} />
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <div
        id="stats"
        className="bg-gradient-to-r from-blue-900 to-green-900 py-16"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Building2 className="w-12 h-12 text-white mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                Facilities Nationwide
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-white mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">2M+</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                Patients Served
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award className="w-12 h-12 text-white mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                Accuracy Rate
              </p>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* Features Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose Our Laboratory?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <Microscope className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-semibold mb-3">Advanced Equipment</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                State-of-the-art testing equipment ensuring precise and reliable
                results
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Flask className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                Highly qualified laboratory scientists and medical professionals
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quick Results</h3>
              <p className="text-black bg-white p-2 rounded-lg">
                Fast turnaround times with most results available within 24
                hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-black">
            Our Expert Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
                alt="Lab Scientist"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl text-black font-semibold mb-2">
                  Dr. Sarah Johnson
                </h3>
                <p className="text-black">Laboratory Director</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80"
                alt="Medical Technologist"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl  text-black font-semibold mb-2">
                  Dr. Michael Chen
                </h3>
                <p className="text-black">Chief Medical Technologist</p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80"
                alt="Research Scientist"
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl text-black  font-semibold mb-2">
                  Dr. Emily Martinez
                </h3>
                <p className="text-black">Research Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className=" bg-gradient-to-r from-blue-900 to-green-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get Your Tests Done?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience our world-class
            laboratory services.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
            <Link href={"/book-test"}>Schedule Now</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
