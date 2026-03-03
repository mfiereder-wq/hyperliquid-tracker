// app/api/hyperliquid/route.ts

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    return Response.json(
      { error: "Failed to fetch Hyperliquid data" },
      { status: 500 }
    );
  }
}