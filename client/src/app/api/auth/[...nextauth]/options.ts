import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosCustom from "@/utils/axiosCustom.utils";
import axios from "axios";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
        deviceUAParse_name: {},
        deviceUAParse_cpu_architecture: {},
        deviceUAParse_engine_name: {},
        deviceUAParse_engine_version: {},
        deviceUAParse_os_name: {},
        deviceUAParse_os_version: {},
        deviceUAParse_ua: {},
        deviceUAParse_version: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await axiosCustom.post<{
            message: string;
            result: { access_token: string; refresh_token: string };
          }>({
            url: "users/login",
            body: {
              email: credentials?.email,
              password: credentials?.password,
              deviceUAParse_name: credentials?.deviceUAParse_name,
              deviceUAParse_cpu_architecture:
                credentials?.deviceUAParse_cpu_architecture,
              deviceUAParse_engine_name: credentials?.deviceUAParse_engine_name,
              deviceUAParse_engine_version:
                credentials?.deviceUAParse_engine_version,
              deviceUAParse_os_name: credentials?.deviceUAParse_os_name,
              deviceUAParse_os_version: credentials?.deviceUAParse_os_version,
              deviceUAParse_ua: credentials?.deviceUAParse_ua,
              deviceUAParse_version: credentials?.deviceUAParse_version,
              device: (await axios.get("http://localhost:3000/api/os")).data,
            },
          });

          if (response.data.result) {
            return {
              id: "",
              access_token: response.data.result.access_token,
              refresh_token: response.data.result.refresh_token,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.access_token = (user as any).access_token;
        token.refresh_token = (user as any).refresh_token;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      (session as any).access_token = token.access_token;
      (session as any).refresh_token = token.refresh_token;

      return session;
    },
    signIn: async () => {
      return true;
    },
  },
};
