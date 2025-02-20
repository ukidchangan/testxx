import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userid = searchParams.get("userid");
    console.log(userid);


    try {
        // Construct the API URL with the given user ID
        // const apiUrl = `https://testdonate.luangphorsodh.com/api/lineoa/profile/list?lineoa_userid=${userid}`;
         const apiUrl = `https://testdonate.luangphorsodh.com/api/donate/list/?lineoa_userid=U9cd87cd0a095b3c1a062cab85dbf9701`;
    
        // Fetch data from external API
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: "9613972343509313335bdc6a7fe20772c9bdd4ad",
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

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const userid = searchParams.get("userid");
    
//     console.log(userid);

//     return NextResponse.json({ message: 'Hello from Next.js!' });
// }
