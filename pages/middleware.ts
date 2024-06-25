// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });

  // ถ้าไม่มี token ให้ redirect ไปที่หน้า login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ถ้ามี token ให้ดำเนินการต่อ
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/c/:path*'],
};
