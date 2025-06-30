import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios'
import CredentialsProvider from "next-auth/providers/credentials";
import { logActivity } from "../../../lib/logger";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const emailToCheck = user.email;
      // console.log(user.email);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, 
        { email: emailToCheck },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY
          }
        }
      );

      if (response.data && response.data.length > 0) {
        return true;
      } else {
        console.error('User not found in local data');
        return "/403";  // Redirect to 403 page
      }
    }, 
    async session({session, token}) {
      try {
        const emailToCheck = token.email;
      // console.log(token);
        const apiResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, 
          { email: emailToCheck },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY
            }
          }
        );

        if (apiResponse.data) {
          session.user = {
            ...session.user,
            stdid: apiResponse.data[0].stdid,
            usertype: Number(apiResponse.data[0].type)
          };
        }

        return session;
      } catch (error) {
        console.error('Error fetching user data from API:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.stdid = user.stdid;
        token.type = user.type;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      if (message.isNewUser) {
        await logActivity(message.user.stdid, 'USER_REGISTER', { provider: message.account.provider });
      } else {
        await logActivity(message.user.stdid, 'USER_LOGIN', { provider: message.account.provider });
      }
    },
  }
};
export default NextAuth(authOptions);