import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";

import { createUser, getUser } from "./actions";
import { SessionInterface, UserProfile } from "@/common.types";

// this session contains the data about currently logged users

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, //client id or undefined
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase", //issuer
          exp: Math.floor(Date.now() / 1000) + 60 * 60, //46,800seconds, 13 hrs - its a std practice, we can customize if we want to
        },
        secret
      );
      
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret);
      return decodedToken as JWT;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: { //every time user triggers the page and there we can just start the new session for the user
    async session({ session }) { //here merging the 2 users(google and db users)
      const email = session?.user?.email as string;

      try { 
        const data = await getUser(email) as { user?: UserProfile }

        const newSession = {
          ...session,
          user: { //merged
            ...session.user, //google user
            ...data?.user,  //db user
          },
        };

        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    async signIn({ user }: { //sign in user of type google user or the db user.
      user: AdapterUser | User
    }) {
      try {
        // if the usr exist get the user
        const userExists = await getUser(user?.email as string) as { user?: UserProfile }
        
        // or create a new user
        if (!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string)
        }

        // return true if they exist or created.
        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
}; 
// we don't want to simply return the google user, we wana hook up the google user with our own db user, so to do that we wanna merge the session with the 2 users

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;

  return session;
}
