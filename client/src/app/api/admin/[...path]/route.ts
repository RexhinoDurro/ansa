import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Handle all HTTP methods
async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    // Ensure trailing slash for Django
    const url = `${BACKEND_URL}/api/admin/${path}/`;

    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    console.log(`[Admin API Proxy] ${request.method} ${fullUrl}`);

    // Get cookies and headers from the request
    const cookieHeader = request.headers.get('cookie');
    const csrfToken = request.headers.get('x-csrftoken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      credentials: 'include',
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('multipart/form-data')) {
        // For file uploads, forward the FormData directly
        const formData = await request.formData();
        fetchOptions.body = formData as any;
        // Remove content-type header to let fetch set it with boundary
        delete headers['Content-Type'];
      } else {
        // For JSON data
        const body = await request.text();
        if (body) {
          fetchOptions.body = body;
        }
      }
    }

    // Make request to Django backend
    const response = await fetch(fullUrl, fetchOptions);

    // Get response data
    let data;
    const responseContentType = response.headers.get('content-type');

    if (responseContentType?.includes('application/json')) {
      data = await response.json();
      console.log(`[Admin API Proxy] Response: ${response.status} (JSON)`);
    } else {
      const text = await response.text();
      console.log(`[Admin API Proxy] Response: ${response.status} (${responseContentType})`);
      console.log(`[Admin API Proxy] Response body preview:`, text.substring(0, 200));

      // If we got HTML instead of JSON, return an error
      if (text.startsWith('<!DOCTYPE') || text.startsWith('<!doctype')) {
        console.error('[Admin API Proxy] Received HTML instead of JSON from Django');
        return NextResponse.json(
          {
            error: 'Backend returned HTML instead of JSON',
            detail: 'The Django backend may not be running or the endpoint may not exist',
            url: fullUrl
          },
          { status: 502 }
        );
      }

      data = text;
    }

    // Create Next.js response
    const nextResponse = NextResponse.json(data, { status: response.status });

    // Forward cookies from Django
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      nextResponse.headers.set('set-cookie', setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error('Admin API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: String(error) },
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
