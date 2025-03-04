import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


export async function POST(request: Request) {
  try {
    const formDataxx = await request.formData(); // Parse formData instead of JSON
    console.log("pop 1xxxx");

    let data = new FormData();


    for (const key of formDataxx.keys()) {
      const value = formDataxx.get(key);

      if (key === "attachment" && value instanceof Blob) {
        // Convert Blob to Buffer
        console.log("key="+key);
        console.log("attachment 1");
        const buffer = Buffer.from(await value.arrayBuffer());
        const fileName = `upload-${Date.now()}.${value.type.split("/")[1]}`; // Generate filename
        console.log("attachment 2");
        // Append the file as a buffer
        data.append(key, buffer, { filename: fileName, contentType: value.type });
        console.log("attachment 3");

      } else if (typeof value === "string") {
        data.append(key, value); // Append regular text fields
        console.log("key="+key+" value="+value);
      }
    }
    console.log("pop 2");
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donate/form`,
      headers: { 
        'Authorization':  process.env.NEXT_PUBLIC_API_AUTHORIZATION, 
        ...data.getHeaders()
      },
      data: data
    };
    console.log("pop 3");

    const response = await axios.request(config);
    console.log("pop 4");
    console.log(JSON.stringify(response.data));
    console.log("pop 5");
    // Cleanup temporary file if it exists


    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
  }
}
