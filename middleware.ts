import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to protect routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the pathname of the request
  const isUserLoggedIn = checkUserAuthentication(request); // Check user authentication (e.g., token)

  // Redirect unauthenticated users to the sign-in page
  if (!isUserLoggedIn && pathname.startsWith('/product')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow access if the user is authenticated
  return NextResponse.next();
}

// Dummy function to simulate user authentication
function checkUserAuthentication(request: NextRequest) {
  // For example, check for a token in cookies or session
  const token = request.cookies.get('authToken'); // Check cookie for auth token
  return !!token; // If token exists, user is authenticated
}

// Config to apply middleware only to specific routes
export const config = {
  matcher: ['/product/:path*', '/admin/:path*'], // Protect product and admin routes
};


// // export { auth as middleware } from "@/auth"
// export function middleware(request:any)
// {
//     const isUserloggedin = false
//     if(!isUserloggedin){
//        return  Response.redirect(new URL('/signin', request.url))
//     }
// }

// export const config ={
//     matcher: "/product/batman-the-dark-knight-returns"
// }