import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register' || path === '/';

    // Get the token from the cookies
    // Note: Backend sets 'accessToken' cookie
    const token = request.cookies.get('accessToken')?.value || '';

    // If it's a public path and we have a token, we don't necessarily need to redirect to home.
    // However, if the user is ALREADY at /login or /register and has a token, we might want to redirect.
    // Let's keep it simple: only redirect if authenticated and trying to hit login/register specifically.
    // But for debugging, let's relax this so users can always see the login/register pages.
    /*
    if (isPublicPath && token && path !== '/') {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    */

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/login',
        '/register',
        '/user/:path*', // Protect user dashboard
        // '/rooms/:path*',    // Protect room booking if needed
        '/rooms',    
    ],
};
