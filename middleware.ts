import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }

  try {
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = atob(encodedCredentials);
    const index = decodedCredentials.indexOf(':');
    const username = decodedCredentials.slice(0, index);
    const typedPassword = decodedCredentials.slice(index + 1);

    if (username !== process.env.ADMIN_USERNAME || typedPassword !== process.env.ADMIN_PASSWORD) {
      console.log(username, process.env.ADMIN_USERNAME, typedPassword, process.env.ADMIN_PASSWORD);
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }

    return NextResponse.next();
  } catch {
    return new NextResponse('Authentication failed', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    });
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/add/:path*'],
};
