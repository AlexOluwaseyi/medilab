"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import TestRecord from "@/types/TestRecord";
import CreateModal from "./modals/CreateModal";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { ChevronDown, ChevronUp, Database, AlertTriangle } from "lucide-react";
import Cookies from "js-cookie";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<
    "idle" | "checking" | "success" | "error"
  >("idle");
  const [apiMessage, setApiMessage] = useState("");

  // Define interface for debug data
  interface DebugData {
    urlPresent?: boolean;
    databaseUrl?: string;
    issues?: string[];
    hasIssues?: boolean;
    directUrlPresent?: boolean;
    directUrl?: string;
    [key: string]: boolean | string | string[] | undefined; // For any additional properties
  }

  // Add these state variables inside your Header component
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [isDebugAllowed, setIsDebugAllowed] = useState<boolean | null>(null);
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [isLoadingDebug, setIsLoadingDebug] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check API status on component mount and periodically
  useEffect(() => {
    checkApiHealth();

    // Check API every 120 seconds
    const interval = setInterval(() => {
      checkApiHealth();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // Check if the user is logged in
  useEffect(() => {
    // Use js-cookie library or document.cookie to check auth in client components
    const authToken = Cookies.get("auth-token");
    if (authToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch debug data on component mount
  useEffect(() => {
    // Fetch debug data when the component mounts
    fetchDebug();
  }, []);

  useEffect(() => {
    if (showDebugPanel && !debugData) {
      fetchDebug();
    }
  }, [showDebugPanel, debugData]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCreateSuccess = (newTest: TestRecord) => {
    window.location.href = `/tests/${newTest.id}`;
  };

  // Define checkApiHealth with useCallback
  const checkApiHealth = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    try {
      setApiStatus("checking");
      setApiMessage("Checking API connection...");

      const response = await fetch("/api/v1/healthcheck");
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setApiStatus("success");
        setApiMessage("Database connected successfully!");
      } else {
        setApiStatus("error");
        setApiMessage(data.message || "API check failed");
      }
    } catch (error) {
      setApiStatus("error");
      setApiMessage(`Failed to connect to API ${error}`);
      console.error("API check error:", error);
    }

    // Hide toast message after 2 seconds
    setTimeout(() => {
      setApiMessage("");
    }, 2000);
  }, []); // Empty dependency array since we don't use any external values

  // Update your fetchDebug function to set the state
  const fetchDebug = async () => {
    try {
      setIsLoadingDebug(true);
      const response = await fetch("/api/v1/debug");
      const data = await response.json();
      if (response.status == 403) {
        setIsDebugAllowed(false);
        setDebugData({ isAllowed: false, ...data });
      } else {
        setIsDebugAllowed(true);
        setDebugData(data);
        console.log("Debug data loaded.");
      }
      return data;
    } catch (error) {
      setDebugData({
        error: "Failed to fetch debug information",
        message: `${error}`,
      });
      return null;
    } finally {
      setIsLoadingDebug(false);
    }
  };

  return (
    <>
      <header className="bg-black max-w-4xl md:max-w-10/12 mx-auto text-white h-16 flex items-center justify-between px-6">
        <div id="header" className="hover:underline md:text-2xl font-bold">
          <Link href="/">🔬 Medi-Lab</Link>
        </div>

        <div className="flex flex-row-reverse md:col-span-1 md:grid md:grid-cols-1 gap-4">
          {/* Status Indicator Circle */}
          <div className="hidden sm:flex items-center absolute top-5 right-28">
            {isDebugAllowed === true && (
              <div
                className="relative group cursor-pointer"
                onClick={checkApiHealth}
              >
                {apiStatus === "checking" ? (
                  <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" />
                ) : apiStatus === "success" ? (
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                ) : apiStatus === "error" ? (
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-400" />
                )}

                {/* Tooltip */}
                <div className="absolute hidden group-hover:block top-6 right-0 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2">
                  {apiStatus === "checking"
                    ? "Checking API connection..."
                    : apiStatus === "success"
                    ? "API connected successfully"
                    : apiStatus === "error"
                    ? "API connection failed"
                    : "Click to check API status"}
                </div>
              </div>
            )}
          </div>

          <button
            id="mobile-open-button"
            className={`${
              isMobileMenuOpen
                ? "hidden"
                : "text-3xl justify-self-end sm:hidden focus:outline-none z-50"
            }`}
            onClick={toggleMobileMenu}
          >
            &#9776;
          </button>

          <button
            id="mobile-close-button"
            className={`${
              isMobileMenuOpen
                ? "text-3xl justify-self-end focus:outline-none z-50 "
                : "hidden"
            }`}
            onClick={toggleMobileMenu}
          >
            &times;
          </button>

          <nav
            className={`${
              isMobileMenuOpen
                ? "flex h-dvh w-dvw top-0 left-0 pt-16 absolute bg-black flex-col items-center text-center z-10"
                : "hidden sm:flex gap-8 items-center justify-evenly z-10"
            }`}
          >
            {/* <Link
              href="/tests"
              className="!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              Tests
            </Link> */}
            <Link
              href="/admin"
              className={`${
                isLoggedIn
                  ? "!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
                  : "hidden"
              }`}
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/appointments"
              className={`${
                isLoggedIn
                  ? "!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
                  : "hidden"
              }`}
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              Appointments
            </Link>
            <Link
              href="/admin/doctors"
              className={`${
                isLoggedIn
                  ? "!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
                  : "hidden"
              }`}
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              Doctors
            </Link>
            <Link
              href="/login"
              className={`${
                !isLoggedIn
                  ? "!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
                  : "hidden"
              }`}
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              Login
            </Link>

            {/* <Link
              href="#"
              onClick={handleOpenCreateModal}
              className="!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
            >
              Create test
            </Link> */}

            {/* <Link
              href="#"
              onClick={() => {
                toast("Feature not available");
                if (isMobileMenuOpen) toggleMobileMenu();
              }}
              className="!m-0 py-4 sm:py-0 hover:text-blue-600 hover:underline hover:underline-offset-2"
            >
              More
            </Link> */}
          </nav>

          {/* Mobile-only status indicator */}
          {isDebugAllowed === true && (
            <div
              className="sm:hidden flex items-center gap-2 py-4"
              onClick={checkApiHealth}
            >
              {apiStatus === "checking" ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                  <span className="hidden md:block">Checking API...</span>
                </>
              ) : apiStatus === "success" ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="hidden md:block">API Connected</span>
                </>
              ) : apiStatus === "error" ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="hidden md:block">API Error</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="hidden md:block">Check API</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* API Status Toast - only show when explicitly checking or on success/error */}
      {isDebugAllowed === true && apiMessage && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-md shadow-lg z-50 max-w-xs transition-all duration-300 ${
            apiStatus === "checking"
              ? "bg-blue-50 text-blue-800 border border-blue-300"
              : apiStatus === "success"
              ? "bg-green-50 text-green-800 border border-green-300"
              : "bg-red-50 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {apiStatus === "checking" && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            )}
            {apiStatus === "success" && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {apiStatus === "error" && (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <p>{apiMessage}</p>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {isDebugAllowed === true && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md shadow-lg"
          >
            <Database className="h-4 w-4" />
            Debug
            {showDebugPanel ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>

          {/* {showDebugPanel && ( */}
          {showDebugPanel && (
            <div className="fixed bottom-16 right-4 w-72 md:w-96 h-auto overflow-y-auto bg-gray-900 text-white rounded-md shadow-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Database Debug Info</h3>
                <button
                  onClick={() => fetchDebug()}
                  className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                  disabled={isLoadingDebug}
                >
                  {isLoadingDebug ? "Loading..." : "Refresh"}
                </button>
              </div>

              {isLoadingDebug ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : debugData ? (
                <div className="space-y-3 text-sm">
                  {/* Database URL Status */}
                  <div className="p-2 border border-gray-700 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">Database URL:</span>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded ${
                            debugData.urlPresent ? "bg-green-900" : "bg-red-900"
                          }`}
                        >
                          {debugData.urlPresent ? "Present" : "Missing"}
                        </span>
                      </div>
                      {debugData.hasIssues && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Display maskable version of the URL */}
                    {debugData.databaseUrl && (
                      <div className="mt-2 bg-gray-800 p-2 rounded overflow-x-auto text-xs font-mono">
                        {/* Only display part of the URL for security */}
                        <div className="whitespace-pre-wrap break-all">
                          {debugData.databaseUrl.replace(
                            /\/\/([^:]+):([^@]+)@/,
                            "//$1:********@"
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show any URL issues */}
                    {debugData.issues && debugData.issues.length > 0 && (
                      <div className="mt-2 border-t border-gray-700 pt-2">
                        <div className="text-yellow-500 text-xs font-medium mb-1">
                          Issues:
                        </div>
                        <ul className="list-disc list-inside text-xs">
                          {debugData.issues.map(
                            (issue: string, idx: number) => (
                              <li key={idx} className="text-yellow-400">
                                {issue}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Direct URL Status */}
                  <div className="p-2 border border-gray-700 rounded">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">Direct URL:</span>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded ${
                            debugData.directUrlPresent
                              ? "bg-green-900"
                              : "bg-red-900"
                          }`}
                        >
                          {debugData.directUrlPresent ? "Present" : "Missing"}
                        </span>
                      </div>
                    </div>

                    {debugData.directUrl && (
                      <div className="mt-2 bg-gray-800 p-2 rounded overflow-x-auto text-xs font-mono">
                        <div className="whitespace-pre-wrap break-all">
                          {debugData.directUrl.replace(
                            /\/\/([^:]+):([^@]+)@/,
                            "//$1:********@"
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Raw Debug Data - Expandable Section */}
                  <div className="p-2 border border-gray-700 rounded">
                    <details>
                      <summary className="cursor-pointer font-medium">
                        Raw Debug Data
                      </summary>
                      <pre className="mt-2 bg-gray-800 p-2 rounded overflow-x-auto text-xs">
                        {JSON.stringify(debugData, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No debug data available
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-2">
                <span>This panel is for development/debugging only.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Create Modal component */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default Header;
