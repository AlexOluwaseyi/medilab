import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Function to check if a request should be protected
function isProtectedRoute(pathname: string) {
    // Add your protected routes patterns here
    const protectedRoutes = [
        '/dashboard',
        '/profile',
        '/admin',
        '/tests',
        // Add more protected routes as needed
    ];

    return protectedRoutes.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // For test mode, check for a special header or query parameter
    if (isTestMode) {
        const testBypassToken = request.headers.get('x-test-bypass-auth') ||
            request.nextUrl.searchParams.get('testBypassAuth');

        if (testBypassToken === process.env.TEST_BYPASS_SECRET) {
            return NextResponse.next();
        }
    }

    // Check if this is a protected route
    if (isProtectedRoute(pathname)) {
        // Here you would normally check for auth tokens, session cookies, etc.
        // For this example, we'll just check for a simple auth header or cookie
        const authToken = request.cookies.get('auth-token')?.value ||
            request.headers.get('authorization');

        if (!authToken) {
            // Redirect to login if no auth token
            const url = new URL('/login', request.url);
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }

        // In a real app, you'd validate the token here
        // For now, we'll just let it pass if the token exists
    }

    return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
    matcher: [
        // Match all paths except for:
        // - api routes (/api/*)
        // - static files (_next/static/*)
        // - public files (public/*)
        // - login and register routes
        '/((?!api|_next/static|_next/image|public|login|register).*)',
    ],
};