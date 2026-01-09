import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      role: "admin" | "user";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id?: string;
    role: "admin" | "user";
    isAdmin?: boolean;
  }
 

  interface User {
    role: "admin" | "user";
  }
}


