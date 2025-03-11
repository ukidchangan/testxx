import { NextResponse,NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mobilex = searchParams.get("mobile"); 
    const emailx = searchParams.get("email"); 
    console.log(mobilex);
    console.log(emailx);

    try {
        // Construct the API URL with the given user ID
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lineoa/profile/list?mobile=${mobilex}&email=${emailx}`;
        console.log("apiUrl="+apiUrl);
        console.log("NEXT_PUBLIC_API_AUTHORIZATION="+process.env.NEXT_PUBLIC_API_AUTHORIZATION);
        // Fetch data from external API
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization:  process.env.NEXT_PUBLIC_API_AUTHORIZATION as string,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data)
        return NextResponse.json(data);
        // Return plain JSON response

      } catch (error: any) {
        console.error("Proxy API Error:", error);
        return NextResponse.json({ message: 'Proxy API Error:' });
      }

  return NextResponse.json({ message: 'Hello from Next.js!' });
}

////////
