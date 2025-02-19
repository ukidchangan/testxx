// app/api/create-profile/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.json();
   console.log(formData);
  try {
    const apiResponse = await fetch('https://testdonate.luangphorsodh.com/api/lineoa/profile/create', {
      method: 'POST',
      headers: {
        'Authorization': '9613972343509313335bdc6a7fe20772c9bdd4ad',
        'Content-Type': 'application/json',
        'Cookie': 'session_id=w3VYNXpzk-SQZG663GtNHDCGEvgN36BBOVcLKl7TtZdBUFLs0d4WOyN-9c8vQT7zFcbmy1OWvH4WTHSEmkmI', 
      },
      body: JSON.stringify(formData),
    });

    // if (!apiResponse.ok) {

    //   throw new Error('Failed to create prxofile');
    // }

    const data = await apiResponse.json();
    console.log("========================");
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
  }
}