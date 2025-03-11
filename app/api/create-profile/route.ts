import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';

// Define the expected structure of the error response
interface ErrorResponse {
  success: boolean;
  message: string;
  status_code: number;
}

export async function POST(request: Request) {
  try {
    const formDataxx = await request.json();
    let data = new FormData();
    Object.keys(formDataxx).forEach((key) => {
      data.append(key, formDataxx[key]);
      console.log("key=" + key + "  " + formDataxx[key]);
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
      data: data
    };

    const response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>; // Explicitly type the error response
      if (axiosError.response) {
        const statusCode = axiosError.response.status;
        const errorMessage = axiosError.response.data?.message || 'An error occurred while creating the profile';
        console.error(`Error Status Code: ${statusCode}, Message: ${errorMessage}`);
        return NextResponse.json({ error: errorMessage }, { status: statusCode });
      }
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
  }
}