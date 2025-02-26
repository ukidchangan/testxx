import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userid = searchParams.get("userid");
    console.log(userid);


    try {
         const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donate/list/?lineoa_userid=${userid}`;
    
        // Fetch data from external API
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization:  process.env.API_AUTHORIZATION as string,
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
