import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Use this only during development or with proper authentication
export async function GET(request: NextRequest) {
  const vercelEnv = process.env.VERCEL_ENV; // 'production', 'preview', or 'development'
  const isPreview = vercelEnv === "preview";
  const isDevelopment = process.env.NODE_ENV === "development";
  const isLocalhost = request.headers.get("host")?.includes("localhost");

  // const isAllowed = isPreview || isDevelopment || isLocalhost;
  const isAllowed = false

  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Debug endpoint not available in production environment",
        environment: vercelEnv || process.env.NODE_ENV,
      },
      { status: 403 }
    );
  }

  // Safely display database URL by masking the password
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";

  // Mask passwords in the URLs
  const maskedDbUrl = maskDatabaseUrl(dbUrl);
  const maskedDirectUrl = maskDatabaseUrl(directUrl);

  // Check for common issues
  const issues = checkUrlIssues(dbUrl);

  return NextResponse.json({
    databaseUrl: maskedDbUrl,
    directUrl: maskedDirectUrl,
    urlPresent: !!process.env.DATABASE_URL,
    directUrlPresent: !!process.env.DIRECT_URL,
    hasIssues: issues.length > 0,
    issues: issues,
  });
}

// Check for common issues with database URLs
function checkUrlIssues(url: string): string[] {
  const issues = [];

  if (!url) {
    issues.push("DATABASE_URL is not set");
    return issues;
  }

  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    issues.push("URL must start with postgresql:// or postgres://");
  }

  if (!url.includes("@")) {
    issues.push("URL appears to be missing authentication information");
  }

  if (!url.includes(":")) {
    issues.push("URL appears to be missing port information");
  }

  return issues;
}

// Helper to mask sensitive parts of the URL
function maskDatabaseUrl(url: string): string {
  if (!url) return "Not set";

  try {
    // Parse the URL
    const parsedUrl = new URL(url);

    // Mask the password
    if (parsedUrl.password) {
      parsedUrl.password = "********";
    }

    return parsedUrl.toString();
  } catch (error) {
    console.log(error);
    // If URL parsing fails, mask manually
    return url.replace(/\/\/([^:]+):([^@]+)@/, "//$1:********@");
  }
}
