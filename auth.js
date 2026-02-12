import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';
//import { AUTHOR_BY_GOOGLE_ID_QUERY } from './sanity/lib/queries';
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
//import { USER_BY_EMAIL_QUERY } from "./sanity/lib/queries";
//const ADMIN_EMAILS = ["fitsum1204@gmail.com"];
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (Total lifetime)
    updateAge: 24 * 60 * 60,   // 24 hours (How often to refresh the cookie)
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
   Credentials({
  name: "Email & Password",
  credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
    },
  async authorize(credentials) {

      if (!credentials?.email || !credentials?.password) {
      
        return null;
      }

      const user = await client
        .withConfig({ useCdn: false })
        .fetch(
          `*[_type=="user" && email==$email][0]`,
          { email: credentials.email }
        );

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        const isValid =  await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
}),

 

  ],

  callbacks: {
 async signIn({  account, profile }) {
  try {
    if (account?.provider !== "google")  return true;

    const googleId = account.providerAccountId;
    const email = profile?.email;

    if (!googleId || !email) return false;

    const existingUser = await client
      .withConfig({ useCdn: false })
      .fetch(
        `*[_type == "user" && email == $email][0]`,
        { email }
      );

    // Existing email user → link Google
    if (existingUser) {
      if (!existingUser.googleId) {
        await writeClient
          .patch(existingUser._id)
          .set({ googleId })
          .commit();
      }
      return true;
    }

    //  No user → create new (non-admin)
    await writeClient.create({
      _type: "user",
      email,
      googleId,
      name: profile.name,
      image: profile.picture,
      role: "user",
    });

    return true;
  } catch (err) {
    console.error("Google signIn error:", err);
    return false;
  }
}


,


async jwt({ token, user }) {
  try {
    // When user logs in first time
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.isAdmin = user.role === "admin";
    }

    // 🔥 ALWAYS re-fetch user from Sanity to keep role fresh
    if (token?.email) {
      const sanityUser = await client
        .withConfig({ useCdn: false })
        .fetch(
          `*[_type == "user" && email == $email][0]{ _id, role }`,
          { email: token.email }
        );

      if (sanityUser) {
        token.id = sanityUser._id;
        token.role = sanityUser.role;
        token.isAdmin = sanityUser.role === "admin";
      }
    }

  } catch (err) {
    console.error("JWT ERROR:", err);
  }

  return token;
}

,

async session({ session, token }) {
  console.log("ACTIVE SESSION EMAIL:", token.email);
  console.log("ACTIVE SESSION ROLE:", token.role);

  if (session.user) {
    session.user.id = token.id;
    session.user.role = token.role;
    session.user.isAdmin = token.isAdmin ?? false;
  }

  return session;
}
,
  },
});
