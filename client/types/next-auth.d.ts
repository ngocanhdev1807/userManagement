import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      password: string;
      name: string;
      email: string;
      address: string;
      zip: string;
      role: string;
      access_token: string;
      refresh_token: string;
    };
  }
}
