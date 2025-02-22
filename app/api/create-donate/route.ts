import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formDataxx = await request.formData(); // Parse formData instead of JSON
    console.log("pop 1");

    let data = new FormData();
    let tempFilePath: string | null = null; // Store temp file path if needed

    for (const key of formDataxx.keys()) {
      const value = formDataxx.get(key);

      if (key === "attachment" && value instanceof Blob) {
        // Convert Blob to Buffer
        const buffer = Buffer.from(await value.arrayBuffer());
        data.append(key, buffer, {
          filename: `upload-${Date.now()}.${value.type.split("/")[1]}`, // Generate a filename
          contentType: value.type // Set the content type
        });
      } else if (typeof value === "string") {
        data.append(key, value); // Append regular text fields
      }
    }

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

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));

    // Cleanup temporary file if it exists
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
  }
}
