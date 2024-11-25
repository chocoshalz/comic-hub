// headerService.ts
import { NextResponse } from 'next/server';

export function setGlobalHeaders(response: NextResponse) {
  // Set the Content-Type header (default to application/json)
  response.headers.set('Content-Type', 'application/json');

  // Custom application-specific headers
  response.headers.set('X-Custom-Header', 'CustomHeaderValue');
  response.headers.set('X-Request-Id', '123456'); // Example of tracking ID
  
  // Security headers
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'); // HSTS
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'no-referrer');

  // CORS headers (if needed)
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust the origin as per your needs
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Example function to add authentication token if needed
export function setAuthHeaders(response: NextResponse, token: string) {
  response.headers.set('Authorization', `Bearer ${token}`);
  return response;
}
