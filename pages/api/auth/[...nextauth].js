import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import postcss from "postcss";
import axios from 'axios';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile, session) {
      const emailToCheck = user.user.email;
      // console.log(emailToCheck)
      const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, { email : emailToCheck }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      })

      console.log(data && data.data && data.data.length > 0)


      if (data && data.data && data.data.length > 0) {
        // return Promise.resolve({ ...user, session: { ...user.session }});
        return true;
      } else {
        console.error('User not found in local data');
        return Promise.resolve("/403");
      }
    },
  },
  
};

export default NextAuth(authOptions);