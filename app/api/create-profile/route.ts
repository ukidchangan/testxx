
import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: Request) {
  try {
    const formDataxx = await request.json();
    let data = new FormData();
    Object.keys(formDataxx).forEach((key) => {
      data.append(key, formDataxx[key]);
      console.log("key="+key+"  "+formDataxx[key])
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lineoa/profile/create`,
      headers: { 
        'Authorization': process.env.NEXT_PUBLIC_API_AUTHORIZATION,
        'Content-Type': 'application/json', 
        ...data.getHeaders()
      },
      data : data
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
  }
}


