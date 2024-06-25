import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';

interface ExtendedUser extends User {
  stdid?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const emailToCheck = user.email;
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, 
          { email: emailToCheck },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "",
            }
          }
        );

        if (response.data && response.data.length > 0) {
          return true;
        } else {
          console.error('User not found in local data');
          return "/403";  // Redirect to 403 page
        }
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        const emailToCheck = token.email;
        const apiResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/authen`, 
          { email: emailToCheck },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "",
            }
          }
        );

        if (apiResponse.data) {
          (session.user as ExtendedUser).stdid = apiResponse.data[0].stdid;
        }

        return session;
      } catch (error) {
        console.error('Error fetching user data from API:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const emailToCheck = user.email;
        try {
          const apiResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/authen`,
            { email: emailToCheck },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || "",
              }
            }
          );

          if (apiResponse.data) {
            token.stdid = apiResponse.data[0].stdid;
          }
        } catch (error) {
          console.error('Error fetching user data from API:', error);
        }
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
