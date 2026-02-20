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

    if (isPublicPath && token && path !== '/') {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/login',
        '/register',
        '/dashboard/:path*', // Assuming there's a dashboard
        '/rooms/:path*',    // Protect room booking if needed
    ],
};
