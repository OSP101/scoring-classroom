import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestComponent() {
    useEffect(() => {
        async function fetchData() {
            const emailToCheck = "supphitan.p@kkumail.com";
            // console.log(emailToCheck)
            const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, { email : emailToCheck }, {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.API_KEY
              }
            })
      
            // console.log("data.email == emailToCheck : ", data.data[0].email == emailToCheck)
            console.log("data.email == emailToCheck : ", data.data)
            console.log("data !== null : ", data && data.data && data.data.length > 0);

        }
        fetchData();
    }, []); // Empty dependency array to run this effect only once, on mount

    console.log(process.env.NEXT_PUBLIC_API_KEY)

    // You can render JSX here or return null if rendering is not needed
    return null;
}

