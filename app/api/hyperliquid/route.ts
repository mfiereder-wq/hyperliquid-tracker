// app/api/hyperliquid/route.ts
import { NextResponse } from 'next/server';

const HYPERLIQUID_API = 'https://api.hyperliquid.xyz/info';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(HYPERLIQUID_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Hyperliquid API Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy Hyperliquid API request' },
      { status: 500 }
    );
  }
}