import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = 'ps'
const ADMIN_PASS = 'QWRGWERF'

export function proxy(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      const [user, pass] = Buffer.from(encoded, 'base64').toString().split(':')
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        return NextResponse.next()
      }
    }
  }
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
