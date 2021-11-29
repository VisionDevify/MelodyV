import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET })

    const { pathname } = req.nextUrl

    // Allow the requests if this is true...
    // 1. Its a request for next-auth session & provider fetching
    // 2. The token exists

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next()
    }

    // Redirects user to login if the user doesnt have a token AND trying to access a protected route
    if (!token && pathname !== '/login') {
        return NextResponse.redirect('/login')
    }
}