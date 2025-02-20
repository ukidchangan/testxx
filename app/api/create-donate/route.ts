import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


export async function POST(request: Request) {
  try {
    const formDataxx = await request.json();
    console.log("pop 1");
    let data = new FormData();

    Object.keys(formDataxx).forEach((key) => {
        if(key=="attachment"){
            data.append(key, fs.createReadStream(formDataxx[key]));
        }else{
            data.append(key, formDataxx[key]);
    }
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://testdonate.luangphorsodh.com/api/donate/form',
      headers: { 
        'Authorization': '9613972343509313335bdc6a7fe20772c9bdd4ad', 
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


