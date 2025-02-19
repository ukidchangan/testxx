// // app/api/create-profile/route.ts
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const formData = await request.json();
//    console.log(formData);
//   try {
//     const apiResponse = await fetch('https://testdonate.luangphorsodh.com/api/lineoa/profile/create', {
//       method: 'POST',
//       headers: {
//         'Authorization': '9613972343509313335bdc6a7fe20772c9bdd4ad',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     // if (!apiResponse.ok) {

//     //   throw new Error('Failed to create prxofile');
//     // }

//     const data = await apiResponse.json();
//     console.log("========================");
//     console.log(data);
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'An error occurred while creating the profile' }, { status: 500 });
//   }
// }



// app/api/create-profile/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: Request) {
  try {
    const formDataxx = await request.json();
    console.log("pop 1");
    let data = new FormData();
    // data.append('fullname', 'BBBBBB');
    // data.append('street', 'sfdsdf');
    // data.append('street2', 'sdfsdf');
    // data.append('city', 'sdfsdf');
    // data.append('zip', 'sfsdf');
    // data.append('mobile', 'sdfsdf');
    // data.append('email', 'BBBB@gfg.com');
    // data.append('lineoa_displayname', 'DAM 🇹🇭🇬🇧🇨🇳🇦🇹🇭🇺🇨🇿🇸🇰');
    // data.append('lineoa_profile', 'https://profile.line-scdn.net/0h8kGLZ9-UZ0RqNU-ihUEZOxplZC5JRD5WRAQoJVw9bXdRUCQWRVQsJg82OSZTUHIaQgQgcFtlO31mJhAidGObcG0FOnVWAiYaQlEupQ');
    // data.append('lineoa_userid', 'Ub61da489ee7204079668abb91877e059ssddd');
    Object.keys(formDataxx).forEach((key) => {
      data.append(key, formDataxx[key]);
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://testdonate.luangphorsodh.com/api/lineoa/profile/create',
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


