import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client, { db, DB_NAME } from "@/server/db";
import EmailProvider from "next-auth/providers/nodemailer";
import { env } from "@/env";

import { cookies } from "next/headers";

import {
  sendVerificationRequest,
  generateVerificationToken,
} from "@/config/email-config";
import type { User, UserSession } from "../db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserSession;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account) {
        const accountProvider = account.provider;

        // If the user is signing in with another provider, redirect them the provider sign in
        if (accountProvider !== "email") {
          return true;
        }

        /**  If the user is signing in with email, check if the email exists in the User db
         *@see https://next-auth.js.org/providers/email#sending-magic-links-to-existing-users
         */

        const userEmail = user.email;

        if (userEmail) {
          const user = await db
            .collection<User>("users")
            .find({ email: userEmail })
            .limit(1)
            .toArray();

          const userExist = user.some((user) => user.email === userEmail);

          if (userExist) {
            const cookieStore = await cookies();

            cookieStore.set({
              name: "otp-email",
              value: userEmail,
              maxAge: 10 * 60,
              sameSite: "lax",
            });
            return true; //if the email exists in the User schema, email them a magic code link
          }
          return `/auth/login?error=${userEmail}`; //if the email does not exist in the User schema, redirect to login showing an email error
        }
      }
      return false; // Return false to display a default error message
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        email: user.email,
        image: user.image,
        name: user.name,
      },
    }),
  },
  adapter: MongoDBAdapter(client, {
    databaseName: DB_NAME,
  }),
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      maxAge: 10 * 60, // 10 minutes
      sendVerificationRequest,
      generateVerificationToken,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
} satisfies NextAuthConfig;
