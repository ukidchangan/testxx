import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { Readable } from 'stream'; // Import Readable stream

export async function POST(request: Request) {
  try {
    const formDataxx = await request.formData(); // Parse formData instead of JSON
    console.log("pop 1");

    let data = new FormData();


    for (const key of formDataxx.keys()) {
      const value = formDataxx.get(key);

      if (key === "attachment" && value instanceof Blob) {
        // Convert Blob to Buffer
        console.log("key="+key);
        console.log("attachment 1");
        // Convert Blob to a Readable stream
        const buffer = Buffer.from(await value.arrayBuffer());
        const readableStream = new Readable();
        readableStream.push(buffer); // Push the buffer into the stream
        readableStream.push(null); // Signal end of stream

        // Append the stream to FormData
        data.append(key, readableStream, {
          filename: `upload-${Date.now()}.${value.type.split("/")[1]}`, // Generate a filename
          contentType: value.type // Set the content type
        });
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
      url: 'https://testdonate.luangphorsodh.com/api/donate/form',
      headers: { 
        'Authorization': '9613972343509313335bdc6a7fe20772c9bdd4ad', 
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
