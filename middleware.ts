// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next({ request });
//   const { pathname } = request.nextUrl;

//   const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
//     cookies: {
//       getAll: () => request.cookies.getAll(),
//       setAll: (cookiesToSet) => {
//         cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
//       },
//     },
//   });

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // Jika belum login dan akses halaman protected → ke login
//   const isProtected = pathname.startsWith('/user') || pathname.startsWith('/ahli') || pathname.startsWith('/admin');

//   if (isProtected && !user) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (user && (pathname === '/login' || pathname === '/register')) {
//     // Kalau sudah login tapi buka login/register → redirect ke home
//     return NextResponse.redirect(new URL('/user/dashboardUser', request.url));
//   }

//   return response;
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
// };


import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 
