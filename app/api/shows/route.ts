import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async function shows(req: NextRequest) {
  try {
    const res: NextResponse = new NextResponse();
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:shows']
    });
    const apiPort: string = process.env.API_PORT || '3001';
    const response: Response = await fetch(`http://localhost:${apiPort}/api/shows`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows: Response = await response.json();

    return NextResponse.json(shows, res);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
