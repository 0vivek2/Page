import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "travel";

    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
    if (!PEXELS_API_KEY) {
      return NextResponse.json({ photos: [] });
    }

    const res = await fetch(`https://api.pexels.com/v1/search?query=${category}&per_page=10`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!res.ok) {
      console.error("Pexels API error", res.status);
      return NextResponse.json({ photos: [] });
    }

    const data = await res.json();
    // Map only necessary fields
    const photos = data.photos.map((photo: any) => ({
      id: photo.id,
      src: { landscape: photo.src.landscape },
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
    }));

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("Error fetching Pexels images:", err);
    return NextResponse.json({ photos: [] });
  }
}